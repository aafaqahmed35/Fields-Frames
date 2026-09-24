import { createImageUrlBuilder } from "@sanity/image-url";

import {
  articleModes,
  isCategoryForSection,
} from "@/content/editorial-constants";
import {
  deriveReadingMinutes,
  formatPublicationDate,
} from "@/content/editorial-utils";
import type {
  Article,
  ArticleMode,
  ArticleReference,
  EditorialBodyBlock,
} from "@/content/articles";
import type { Author } from "@/content/authors";
import type {
  ArticleSummary,
  EditorialSection,
  StoryImage,
} from "@/content/story";

type UnknownRecord = Record<string, unknown>;

export class CmsContentError extends Error {
  constructor(message: string) {
    super(`Malformed Sanity content: ${message}`);
    this.name = "CmsContentError";
  }
}

function record(value: unknown, field: string): UnknownRecord {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new CmsContentError(`${field} must be an object`);
  }

  return value as UnknownRecord;
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new CmsContentError(`${field} must be a non-empty string`);
  }

  return value;
}

function optionalString(value: unknown, field: string): string | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  return requiredString(value, field);
}

function sectionValue(value: unknown, field: string): EditorialSection {
  if (value === "FIELD" || value === "CINEMA" || value === "ESSAYS") {
    return value;
  }

  throw new CmsContentError(`${field} has an unsupported section`);
}

function modeValue(value: unknown): ArticleMode {
  if (typeof value === "string" && (articleModes as readonly string[]).includes(value)) {
    return value as ArticleMode;
  }

  throw new CmsContentError("mode has an unsupported value");
}

function numberValue(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new CmsContentError(`${field} must be a number`);
  }

  return value;
}

type ImageConfig = { projectId: string; dataset: string };

function adaptImage(
  value: unknown,
  field: string,
  config: ImageConfig,
): StoryImage | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  const image = record(value, field);
  const asset = record(image.asset, `${field}.asset`);
  const assetId = requiredString(asset._id, `${field}.asset._id`);
  const metadata = record(asset.metadata, `${field}.asset.metadata`);
  const dimensions = record(metadata.dimensions, `${field}.asset.metadata.dimensions`);
  const originalWidth = numberValue(dimensions.width, `${field}.asset.metadata.dimensions.width`);
  const originalHeight = numberValue(dimensions.height, `${field}.asset.metadata.dimensions.height`);
  const crop = image.crop ? record(image.crop, `${field}.crop`) : undefined;
  const cropLeft = crop ? numberValue(crop.left, `${field}.crop.left`) : 0;
  const cropRight = crop ? numberValue(crop.right, `${field}.crop.right`) : 0;
  const cropTop = crop ? numberValue(crop.top, `${field}.crop.top`) : 0;
  const cropBottom = crop ? numberValue(crop.bottom, `${field}.crop.bottom`) : 0;
  const widthRatio = 1 - cropLeft - cropRight;
  const heightRatio = 1 - cropTop - cropBottom;

  if (widthRatio <= 0 || heightRatio <= 0) {
    throw new CmsContentError(`${field}.crop removes the entire image`);
  }

  const source = {
    ...image,
    asset: { _ref: assetId, _type: "reference" },
  };
  const src = createImageUrlBuilder(config)
    .image(source)
    .auto("format")
    .quality(85)
    .url();
  const hotspot = image.hotspot ? record(image.hotspot, `${field}.hotspot`) : undefined;
  let focalPoint: string | undefined;

  if (hotspot) {
    const x = numberValue(hotspot.x, `${field}.hotspot.x`);
    const y = numberValue(hotspot.y, `${field}.hotspot.y`);
    const adjustedX = Math.min(1, Math.max(0, (x - cropLeft) / widthRatio));
    const adjustedY = Math.min(1, Math.max(0, (y - cropTop) / heightRatio));
    focalPoint = `${Math.round(adjustedX * 100)}% ${Math.round(adjustedY * 100)}%`;
  }

  return {
    src,
    width: Math.max(1, Math.round(originalWidth * widthRatio)),
    height: Math.max(1, Math.round(originalHeight * heightRatio)),
    alt: requiredString(image.alt, `${field}.alt`),
    credit: requiredString(image.credit, `${field}.credit`),
    caption: optionalString(image.caption, `${field}.caption`),
    focalPoint,
  };
}

function portableText(value: unknown): string {
  const block = record(value, "body block");
  if (!Array.isArray(block.children)) {
    throw new CmsContentError("Portable Text block children must be an array");
  }

  return block.children
    .map((child, index) => requiredString(record(child, `body child ${index}`).text, `body child ${index}.text`))
    .join("");
}

function adaptBody(value: unknown, config: ImageConfig): EditorialBodyBlock[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new CmsContentError("body must be a non-empty array");
  }

  const blocks: EditorialBodyBlock[] = [];

  for (let index = 0; index < value.length; index += 1) {
    const raw = record(value[index], `body[${index}]`);
    const type = requiredString(raw._type, `body[${index}]._type`);

    if (type === "block") {
      const text = portableText(raw);
      const listItem = optionalString(raw.listItem, `body[${index}].listItem`);

      if (listItem) {
        if (listItem !== "bullet" && listItem !== "number") {
          throw new CmsContentError(`body[${index}] has an unsupported list style`);
        }

        const style = listItem === "number" ? "ordered" : "unordered";
        const previous = blocks.at(-1);

        if (previous?.type === "list" && previous.style === style) {
          blocks[blocks.length - 1] = {
            ...previous,
            items: [...previous.items, text],
          };
        } else {
          blocks.push({ type: "list", style, items: [text] });
        }
        continue;
      }

      const style = raw.style ?? "normal";
      if (style === "normal") {
        blocks.push({ type: "paragraph", text });
      } else if (style === "h2" || style === "h3") {
        blocks.push({ type: "heading", level: style === "h2" ? 2 : 3, text });
      } else {
        throw new CmsContentError(`body[${index}] has an unsupported block style`);
      }
    } else if (type === "pullQuote") {
      blocks.push({
        type: "pullQuote",
        text: requiredString(raw.text, `body[${index}].text`),
        attribution: optionalString(raw.attribution, `body[${index}].attribution`),
      });
    } else if (type === "articleFigure") {
      const image = adaptImage(raw.image, `body[${index}].image`, config);
      if (!image) {
        throw new CmsContentError(`body[${index}].image is required`);
      }
      blocks.push({ type: "figure", image });
    } else if (type === "divider") {
      blocks.push({ type: "divider" });
    } else if (type === "articleNote") {
      blocks.push({
        type: "note",
        label: optionalString(raw.label, `body[${index}].label`),
        text: requiredString(raw.text, `body[${index}].text`),
      });
    } else {
      throw new CmsContentError(`body[${index}] has unsupported type ${type}`);
    }
  }

  return blocks;
}

function adaptAuthor(value: unknown): Author {
  const author = record(value, "author");
  return {
    id: requiredString(author._id, "author._id"),
    name: requiredString(author.name, "author.name"),
    slug: requiredString(author.slug, "author.slug"),
    bio: requiredString(author.bio, "author.bio"),
  };
}

export function adaptSanitySummary(
  value: unknown,
  config: ImageConfig,
): ArticleSummary {
  const raw = record(value, "article summary");
  const section = sectionValue(raw.section, "article summary.section");
  const category = requiredString(raw.category, "article summary.category");
  const date = requiredString(raw.publishedAt, "article summary.publishedAt");

  if (!isCategoryForSection(section, category)) {
    throw new CmsContentError(`${category} is not valid for ${section}`);
  }

  return {
    slug: requiredString(raw.slug, "article summary.slug"),
    category,
    title: requiredString(raw.title, "article summary.title"),
    dek: requiredString(raw.dek, "article summary.dek"),
    author: requiredString(raw.author, "article summary.author"),
    date,
    dateLabel: formatPublicationDate(date),
    image: adaptImage(raw.leadImage, "article summary.leadImage", config),
    section,
  };
}

export function adaptSanityArticle(
  value: unknown,
  config: ImageConfig,
): Article {
  const raw = record(value, "article");
  const section = sectionValue(raw.section, "article.section");
  const category = requiredString(raw.category, "article.category");
  const date = requiredString(raw.publishedAt, "article.publishedAt");
  const authorDetails = adaptAuthor(raw.author);
  const body = adaptBody(raw.body, config);
  const opening = optionalString(raw.opening, "article.opening");
  const relatedValues = raw.relatedArticles ?? [];

  if (!isCategoryForSection(section, category)) {
    throw new CmsContentError(`${category} is not valid for ${section}`);
  }
  if (!Array.isArray(relatedValues) || relatedValues.length > 3) {
    throw new CmsContentError("relatedArticles must contain zero to three articles");
  }

  const relatedArticles = relatedValues.map((related) =>
    adaptSanitySummary(related, config),
  );
  const selfSlug = requiredString(raw.slug, "article.slug");
  if (relatedArticles.some((related) => related.section === section && related.slug === selfSlug)) {
    throw new CmsContentError("article cannot relate to itself");
  }

  const override = raw.readingTimeOverride;
  const readingMinutes =
    override === null || override === undefined
      ? deriveReadingMinutes(body, opening)
      : numberValue(override, "article.readingTimeOverride");
  if (!Number.isInteger(readingMinutes) || readingMinutes < 1) {
    throw new CmsContentError("article.readingTimeOverride must be a positive integer");
  }

  const seo = raw.seo ? record(raw.seo, "article.seo") : undefined;

  return {
    slug: selfSlug,
    category,
    title: requiredString(raw.title, "article.title"),
    dek: requiredString(raw.dek, "article.dek"),
    author: authorDetails.name,
    authorDetails,
    date,
    dateLabel: formatPublicationDate(date),
    image: adaptImage(raw.leadImage, "article.leadImage", config),
    section,
    mode: modeValue(raw.mode),
    readingMinutes,
    kicker: optionalString(raw.kicker, "article.kicker"),
    opening,
    body,
    related: relatedArticles.map<ArticleReference>(({ section: relatedSection, slug }) => ({
      section: relatedSection,
      slug,
    })),
    relatedArticles,
    seo: seo
      ? {
          title: optionalString(seo.title, "article.seo.title"),
          description: optionalString(seo.description, "article.seo.description"),
          socialImage: adaptImage(seo.socialImage, "article.seo.socialImage", config),
        }
      : undefined,
  };
}
