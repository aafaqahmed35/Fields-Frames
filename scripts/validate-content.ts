import assert from "node:assert/strict";

import { cinemaStories } from "../app/cinema/cinema-stories";
import { essayStories } from "../app/essays/essay-stories";
import { fieldStories } from "../app/football/field-stories";
import { articles, getArticle as getLocalArticle } from "../content/articles";
import { authors, getAuthor } from "../content/authors";
import { isCategoryForSection } from "../content/editorial-constants";
import {
  deriveReadingMinutes,
  formatPublicationDate,
} from "../content/editorial-utils";
import {
  getArticleHref,
  getArticleSlugs,
  getArticleSummaries,
  resolveContentSourceMode,
} from "../content/source";
import { sectionRoutes } from "../content/story";
import { adaptSanityArticle, CmsContentError } from "../sanity/lib/adapter";

assert.deepEqual(sectionRoutes, {
  FIELD: "/football",
  CINEMA: "/cinema",
  ESSAYS: "/essays",
});
assert.equal(formatPublicationDate("2026-09-18"), "18 September 2026");
assert.throws(() => formatPublicationDate("2026-02-30"));
assert.equal(
  deriveReadingMinutes([{ type: "paragraph", text: "word ".repeat(226) }]),
  2,
);
assert.equal(resolveContentSourceMode({ NODE_ENV: "development" }), "local");
assert.equal(
  resolveContentSourceMode({ NODE_ENV: "production", MIND_MARGIN_CONTENT_SOURCE: "sanity" }),
  "sanity",
);
assert.throws(() =>
  resolveContentSourceMode({ NODE_ENV: "test", MIND_MARGIN_CONTENT_SOURCE: "invalid" }),
);

const imageAssetId = `image-${"a".repeat(40)}-1200x800-jpg`;
const fixture = {
  _id: "article-field-fixture",
  title: "A fixture article",
  slug: "a-fixture-article",
  section: "FIELD",
  category: "Essay",
  mode: "STANDARD",
  dek: "A deliberately complete fixture for the Sanity adapter.",
  publishedAt: "2026-09-18",
  author: {
    _id: "author-fixture",
    name: "Fixture Writer",
    slug: "fixture-writer",
    bio: "Fixture Writer exists only to validate the CMS adapter boundary.",
  },
  body: [
    {
      _key: "one",
      _type: "block",
      style: "normal",
      children: [{ _type: "span", text: "A structured paragraph." }],
    },
    {
      _key: "two",
      _type: "block",
      style: "normal",
      listItem: "bullet",
      children: [{ _type: "span", text: "First item" }],
    },
    {
      _key: "three",
      _type: "block",
      style: "normal",
      listItem: "bullet",
      children: [{ _type: "span", text: "Second item" }],
    },
    {
      _key: "four",
      _type: "block",
      style: "h2",
      children: [{ _type: "span", text: "A structured heading" }],
    },
    {
      _key: "five",
      _type: "pullQuote",
      text: "A structured quotation.",
      attribution: "Fixture source",
    },
    {
      _key: "six",
      _type: "articleFigure",
      image: {
        asset: {
          _id: imageAssetId,
          _type: "sanity.imageAsset",
          metadata: { dimensions: { width: 1200, height: 800, aspectRatio: 1.5 } },
        },
        alt: "A body fixture with meaningful alternative text",
        caption: "A deterministic figure caption.",
        credit: "Fixture credit",
      },
    },
    { _key: "seven", _type: "divider" },
    {
      _key: "eight",
      _type: "articleNote",
      label: "Fixture note",
      text: "A structured editorial note.",
    },
    {
      _key: "nine",
      _type: "block",
      style: "normal",
      listItem: "number",
      children: [{ _type: "span", text: "A numbered item" }],
    },
  ],
  leadImage: {
    asset: {
      _id: imageAssetId,
      _type: "sanity.imageAsset",
      metadata: { dimensions: { width: 1200, height: 800, aspectRatio: 1.5 } },
    },
    alt: "A fixture image with meaningful alternative text",
    credit: "Fixture credit",
    crop: { left: 0.1, right: 0.1, top: 0, bottom: 0 },
    hotspot: { x: 0.5, y: 0.5 },
  },
  relatedArticles: [],
};

const adapted = adaptSanityArticle(fixture, {
  projectId: "fixtureproject",
  dataset: "production",
});
assert.equal(adapted.authorDetails.name, "Fixture Writer");
assert.equal(adapted.dateLabel, "18 September 2026");
assert.equal(adapted.body[1]?.type, "list");
assert.deepEqual(
  adapted.body.map((block) => block.type),
  ["paragraph", "list", "heading", "pullQuote", "figure", "divider", "note", "list"],
);
assert.equal(adapted.image?.width, 960);
assert.match(adapted.image?.src ?? "", /^https:\/\/cdn\.sanity\.io\/images\//);
assert.throws(
  () => adaptSanityArticle({ ...fixture, category: "Sound" }, { projectId: "fixtureproject", dataset: "production" }),
  CmsContentError,
);

const storyCatalog = [...fieldStories, ...cinemaStories, ...essayStories];
for (const story of storyCatalog) {
  assert.equal(story.dateLabel, formatPublicationDate(story.date));
}

const authorSlugs = new Set<string>();
for (const name of Object.keys(authors) as (keyof typeof authors)[]) {
  const author = getAuthor(name);
  assert.ok(!authorSlugs.has(author.slug), `Duplicate author slug: ${author.slug}`);
  authorSlugs.add(author.slug);
  assert.equal(author.id, `author-${author.slug}`);
  assert.ok(!author.id.includes("."));
}

async function validateContentSource() {
  const articleIdentities = new Set(articles.map(({ section, slug }) => `${section}/${slug}`));
  assert.equal(articleIdentities.size, articles.length);
  for (const article of articles) {
    assert.equal(article.dateLabel, formatPublicationDate(article.date));
    assert.ok(article.readingMinutes >= 1);
    const schemaCategory = article.section === "ESSAYS"
      ? `${article.category.charAt(0)}${article.category.slice(1).toLowerCase()}`
      : article.category;
    assert.ok(isCategoryForSection(article.section, schemaCategory));
    assert.ok(article.body.length > 0);
    assert.ok(article.related.length <= 3);
    assert.equal(article.relatedArticles.length, 0);
    assert.ok(!article.related.some((related) =>
      related.section === article.section && related.slug === article.slug
    ));
    for (const related of article.related) {
      assert.ok(articleIdentities.has(`${related.section}/${related.slug}`));
    }
    assert.equal(
      await getArticleHref(article.section, article.slug),
      `${sectionRoutes[article.section]}/${article.slug}`,
    );
  }

  for (const section of ["FIELD", "CINEMA", "ESSAYS"] as const) {
    const expected = articles
      .filter((article) => article.section === section)
      .map((article) => article.slug);
    assert.deepEqual(await getArticleSlugs(section), expected);
    assert.equal((await getArticleSummaries(section)).length, expected.length);
  }

  const localArticle = getLocalArticle("FIELD", "what-the-floodlights-remember");
  assert.equal(localArticle?.relatedArticles.length, 3);
  assert.equal(getLocalArticle("FIELD", "not-a-real-article"), undefined);
  assert.equal(await getArticleHref("FIELD", "not-a-real-article"), undefined);

  console.log(`Validated ${articles.length} local articles and the Sanity adapter fixture.`);
}

validateContentSource().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
