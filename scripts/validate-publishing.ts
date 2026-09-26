import assert from "node:assert/strict";

import {
  isValidArticleSlug,
  resolveArticlePath,
} from "../content/editorial-routing";
import {
  articleCacheTag,
  articleIdentityCacheTag,
  sectionCacheTag,
} from "../sanity/lib/cache";
import { buildRevalidationPlan } from "../sanity/lib/revalidation";

assert.equal(
  resolveArticlePath("FIELD", "what-the-floodlights-remember"),
  "/football/what-the-floodlights-remember",
);
assert.equal(resolveArticlePath("CINEMA", "cutting-on-the-breath"), "/cinema/cutting-on-the-breath");
assert.equal(resolveArticlePath("ESSAYS", "draft-essay"), "/essays/draft-essay");
assert.equal(resolveArticlePath("ARTICLES", "draft-essay"), undefined);
assert.equal(resolveArticlePath("FIELD", "Draft Essay"), undefined);
assert.equal(resolveArticlePath("FIELD", "draft/essay"), undefined);
assert.equal(resolveArticlePath("FIELD", ""), undefined);
assert.equal(isValidArticleSlug("one-slug"), true);
assert.equal(isValidArticleSlug("one--slug"), false);
assert.equal(isValidArticleSlug("a".repeat(97)), false);

const created = buildRevalidationPlan({
  _id: "article-new",
  _type: "article",
  before: null,
  after: { section: "FIELD", slug: "new-story" },
});
assert.deepEqual(created.paths, ["/", "/football", "/football/new-story"]);
assert.deepEqual(created.tags, [
  sectionCacheTag("FIELD"),
  articleIdentityCacheTag("FIELD", "new-story"),
]);

const moved = buildRevalidationPlan({
  _id: "article-moved",
  _type: "article",
  before: { section: "FIELD", slug: "old-slug" },
  after: { section: "ESSAYS", slug: "new-slug" },
});
assert.deepEqual(moved.paths, [
  "/",
  "/football",
  "/football/old-slug",
  "/essays",
  "/essays/new-slug",
]);
assert.ok(moved.tags.includes(articleIdentityCacheTag("FIELD", "old-slug")));
assert.ok(moved.tags.includes(articleIdentityCacheTag("ESSAYS", "new-slug")));

const unpublished = buildRevalidationPlan({
  _id: "article-archived",
  _type: "article",
  before: { section: "CINEMA", slug: "archived-film" },
  after: null,
});
assert.ok(unpublished.paths.includes("/cinema/archived-film"));
assert.ok(unpublished.paths.includes("/cinema"));

const malformedPublishedArticle = buildRevalidationPlan({
  _id: "article-malformed",
  _type: "article",
  before: null,
  after: { section: null, slug: null },
});
assert.deepEqual(malformedPublishedArticle.paths, [
  "/",
  "/football",
  "/cinema",
  "/essays",
]);

const author = buildRevalidationPlan({
  _id: "author-editor",
  _type: "author",
  before: null,
  after: null,
  dependents: [
    { section: "FIELD", slug: "new-story" },
    { section: "CINEMA", slug: "film-story" },
  ],
});
assert.deepEqual(author.paths, [
  "/",
  "/football",
  "/football/new-story",
  "/cinema",
  "/cinema/film-story",
]);
assert.deepEqual(author.tags, [
  sectionCacheTag("FIELD"),
  articleIdentityCacheTag("FIELD", "new-story"),
  sectionCacheTag("CINEMA"),
  articleIdentityCacheTag("CINEMA", "film-story"),
]);

const relatedConsumer = buildRevalidationPlan({
  _id: "article-related",
  _type: "article",
  before: { section: "FIELD", slug: "new-story" },
  after: { section: "FIELD", slug: "new-story" },
  dependents: [{ section: "ESSAYS", slug: "consumer" }],
});
assert.ok(relatedConsumer.paths.includes("/essays/consumer"));
assert.ok(
  relatedConsumer.tags.includes(articleIdentityCacheTag("ESSAYS", "consumer")),
);

const fallback = buildRevalidationPlan({
  _id: "article-malformed",
  _type: "article",
  before: null,
  after: null,
});
assert.ok(fallback.tags.includes(articleCacheTag));

assert.throws(() => buildRevalidationPlan(null));
assert.throws(() => buildRevalidationPlan({ _type: "article" }));
assert.throws(() =>
  buildRevalidationPlan({ _id: "drafts.article.invalid", _type: "article" }),
);
assert.throws(() =>
  buildRevalidationPlan({
    _id: "bad-section",
    _type: "article",
    after: { section: "NEWS", slug: "story" },
  }),
);
assert.throws(() =>
  buildRevalidationPlan({
    _id: "bad-slug",
    _type: "article",
    after: { section: "FIELD", slug: "Bad Slug" },
  }),
);

console.log("Validated editorial routes, lifecycle payloads, and targeted revalidation plans.");
