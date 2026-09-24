import { createReadStream, existsSync } from "node:fs";
import { basename, resolve } from "node:path";

import { createClient, type SanityClient } from "@sanity/client";

import { articles, type EditorialBodyBlock } from "../content/articles";
import { authors, getAuthor } from "../content/authors";
import {
  articleModes,
  isCategoryForSection,
} from "../content/editorial-constants";
import { formatPublicationDate } from "../content/editorial-utils";

type UploadedAsset = { _id: string };

const apply = process.argv.includes("--apply");

function articleId(section: string, slug: string) {
  return `article-${section.toLowerCase()}-${slug}`;
}

function legacyArticleId(section: string, slug: string) {
  return `article.${section.toLowerCase()}.${slug}`;
}

function legacyAuthorId(slug: string) {
  return `author.${slug}`;
}

function cmsCategory(article: (typeof articles)[number]) {
  return article.section === "ESSAYS"
    ? `${article.category.charAt(0)}${article.category.slice(1).toLowerCase()}`
    : article.category;
}

function span(text: string, key: string) {
  return { _key: key, _type: "span", marks: [], text };
}

function portableBlock(
  text: string,
  key: string,
  style: "normal" | "h2" | "h3" = "normal",
  listItem?: "bullet" | "number",
) {
  return {
    _key: key,
    _type: "block",
    style,
    markDefs: [],
    children: [span(text, `${key}-span`)],
    ...(listItem ? { level: 1, listItem } : {}),
  };
}

function imagePaths() {
  const paths = new Set<string>();
  for (const article of articles) {
    if (article.image) paths.add(article.image.src);
    for (const block of article.body) {
      if (block.type === "figure") paths.add(block.image.src);
    }
  }
  return [...paths].sort();
}

function localImagePath(src: string) {
  if (!src.startsWith("/images/")) {
    throw new Error(`Seed only accepts repository-local editorial images: ${src}`);
  }
  return resolve(process.cwd(), "public", src.slice(1));
}

function assertSeedIsValid() {
  const ids = new Set(articles.map((article) => articleId(article.section, article.slug)));
  if (ids.size !== articles.length) throw new Error("Seed article identities must be unique");
  if ([...ids].some((id) => id.includes("."))) {
    throw new Error("Seed article IDs must remain public-dataset safe");
  }

  const authorIds = new Set(
    (Object.keys(authors) as (keyof typeof authors)[]).map((name) => getAuthor(name).id),
  );
  if (authorIds.size !== Object.keys(authors).length) {
    throw new Error("Seed author identities must be unique");
  }
  if ([...authorIds].some((id) => id.includes("."))) {
    throw new Error("Seed author IDs must remain public-dataset safe");
  }

  for (const article of articles) {
    formatPublicationDate(article.date);
    if (!isCategoryForSection(article.section, cmsCategory(article))) {
      throw new Error(`Invalid seed category: ${article.section}/${article.category}`);
    }
    if (!(articleModes as readonly string[]).includes(article.mode)) {
      throw new Error(`Invalid seed mode: ${article.mode}`);
    }
    if (!authorIds.has(article.authorDetails.id)) {
      throw new Error(`Missing seed author: ${article.authorDetails.id}`);
    }
    if (article.body.length === 0) throw new Error(`Empty seed body: ${article.slug}`);
    if (article.mode === "FEATURE" && !article.image) {
      throw new Error(`Feature seed article requires a lead image: ${article.slug}`);
    }
    if (article.related.length > 3) {
      throw new Error(`Too many related seed targets: ${article.slug}`);
    }
    for (const related of article.related) {
      const target = articleId(related.section, related.slug);
      if (target === articleId(article.section, article.slug)) {
        throw new Error(`Seed article cannot relate to itself: ${target}`);
      }
      if (!ids.has(target)) {
        throw new Error(`Missing related seed target: ${target}`);
      }
    }
  }
  for (const src of imagePaths()) {
    const path = localImagePath(src);
    if (!existsSync(path)) throw new Error(`Missing seed image: ${path}`);
  }
}

async function uploadImages(client: SanityClient) {
  const assets = new Map<string, UploadedAsset>();
  for (const src of imagePaths()) {
    const path = localImagePath(src);
    const asset = await client.assets.upload("image", createReadStream(path), {
      filename: basename(path),
      source: { id: `mind-margin:${src}`, name: "Mind & Margin P9 seed" },
    });
    assets.set(src, asset);
  }
  return assets;
}

function hotspot(focalPoint?: string) {
  const match = focalPoint?.match(/^(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/);
  if (!match) return undefined;
  return {
    _type: "sanity.imageHotspot",
    x: Number(match[1]) / 100,
    y: Number(match[2]) / 100,
    width: 1,
    height: 1,
  };
}

function sanityImage(
  image: NonNullable<(typeof articles)[number]["image"]>,
  assets: Map<string, UploadedAsset>,
) {
  const asset = assets.get(image.src);
  if (!asset) throw new Error(`Image was not uploaded: ${image.src}`);
  return {
    _type: "editorialImage",
    asset: { _type: "reference", _ref: asset._id },
    alt: image.alt,
    caption: image.caption,
    credit: image.credit,
    hotspot: hotspot(image.focalPoint),
  };
}

function bodyBlocks(
  blocks: readonly EditorialBodyBlock[],
  assets: Map<string, UploadedAsset>,
): Record<string, unknown>[] {
  return blocks.flatMap<Record<string, unknown>>((block, index) => {
    const key = `block-${String(index + 1).padStart(3, "0")}`;
    switch (block.type) {
      case "paragraph":
        return [portableBlock(block.text, key)];
      case "heading":
        return [portableBlock(block.text, key, block.level === 2 ? "h2" : "h3")];
      case "list":
        return block.items.map((item, itemIndex) =>
          portableBlock(
            item,
            `${key}-${itemIndex + 1}`,
            "normal",
            block.style === "ordered" ? "number" : "bullet",
          ),
        );
      case "pullQuote":
        return [{ _key: key, _type: "pullQuote", text: block.text, attribution: block.attribution }];
      case "figure":
        return [{ _key: key, _type: "articleFigure", image: sanityImage(block.image, assets) }];
      case "divider":
        return [{ _key: key, _type: "divider", style: "divider" }];
      case "note":
        return [{ _key: key, _type: "articleNote", label: block.label, text: block.text }];
    }
  });
}

async function main() {
  assertSeedIsValid();

  if (!apply) {
    console.log(
      JSON.stringify(
        {
          mode: "dry-run",
          articles: articles.length,
          authors: Object.keys(authors).length,
          images: imagePaths(),
          relatedReferences: articles.reduce((total, article) => total + article.related.length, 0),
          duplicateSafety: "stable document IDs + createIfNotExists + Sanity asset deduplication",
        },
        null,
        2,
      ),
    );
    return;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !dataset || !token) {
    throw new Error(
      "--apply requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and server-only SANITY_API_WRITE_TOKEN.",
    );
  }

  const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: "2026-02-01",
    useCdn: false,
  });
  const assets = await uploadImages(client);
  let transaction = client.transaction();

  for (const name of Object.keys(authors) as (keyof typeof authors)[]) {
    const author = getAuthor(name);
    transaction = transaction.createIfNotExists({
      _id: author.id,
      _type: "author",
      name: author.name,
      slug: { _type: "slug", current: author.slug },
      bio: author.bio,
    });
  }

  for (const article of articles) {
    transaction = transaction.createIfNotExists({
      _id: articleId(article.section, article.slug),
      _type: "article",
      title: article.title,
      slug: { _type: "slug", current: article.slug },
      section: article.section,
      category: cmsCategory(article),
      mode: article.mode,
      dek: article.dek,
      kicker: article.kicker,
      opening: article.opening,
      body: bodyBlocks(article.body, assets),
      author: { _type: "reference", _ref: article.authorDetails.id },
      publishedAt: article.date,
      leadImage: article.image ? sanityImage(article.image, assets) : undefined,
      relatedArticles: article.related.map((related, index) => ({
        _key: `related-${index + 1}`,
        _type: "reference",
        _ref: articleId(related.section, related.slug),
      })),
    });
  }

  await transaction.commit();

  let cleanup = client.transaction();
  for (const article of articles) {
    cleanup = cleanup.delete(legacyArticleId(article.section, article.slug));
  }
  for (const name of Object.keys(authors) as (keyof typeof authors)[]) {
    cleanup = cleanup.delete(legacyAuthorId(getAuthor(name).slug));
  }
  await cleanup.commit();

  console.log(
    `Ensured ${Object.keys(authors).length} authors and ${articles.length} articles with public-safe stable IDs; removed legacy private-path IDs if present.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
