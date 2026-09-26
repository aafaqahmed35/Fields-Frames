import type { Article } from "@/content/articles";
import type { ArticleSummary, EditorialSection } from "@/content/story";
import { requirePublicSanityConfig } from "@/sanity/env";

import { adaptSanityArticle, adaptSanitySummary } from "./adapter";
import {
  articleCacheTag,
  articleIdentityCacheTag,
  sectionCacheTag,
} from "./cache";
import { sanityFetch } from "./fetch";
import {
  ARTICLE_QUERY,
  ARTICLE_SLUGS_QUERY,
  ARTICLE_SUMMARIES_QUERY,
} from "./queries";

export async function fetchSanityArticle(
  section: EditorialSection,
  slug: string,
  options: { stega?: boolean } = {},
): Promise<Article | undefined> {
  const raw = await sanityFetch<unknown>({
    query: ARTICLE_QUERY,
    params: { section, slug },
    stega: options.stega,
    tags: [
      articleCacheTag,
      articleIdentityCacheTag(section, slug),
    ],
  });
  return raw ? adaptSanityArticle(raw, requirePublicSanityConfig()) : undefined;
}

export async function fetchSanityArticleSlugs(
  section: EditorialSection,
): Promise<readonly string[]> {
  const raw = await sanityFetch<unknown>({
    query: ARTICLE_SLUGS_QUERY,
    params: { section },
    preview: false,
    tags: [articleCacheTag, sectionCacheTag(section)],
  });
  if (!Array.isArray(raw)) {
    throw new Error("Malformed Sanity response: article slug query must return an array");
  }

  return raw.map((item, index) => {
    if (!item || typeof item !== "object" || !("slug" in item) || typeof item.slug !== "string") {
      throw new Error(`Malformed Sanity response: article slug ${index} is invalid`);
    }
    return item.slug;
  });
}

export async function fetchSanityArticleSummaries(
  section: EditorialSection,
): Promise<readonly ArticleSummary[]> {
  const raw = await sanityFetch<unknown>({
    query: ARTICLE_SUMMARIES_QUERY,
    params: { section },
    preview: false,
    tags: [articleCacheTag, sectionCacheTag(section)],
  });
  if (!Array.isArray(raw)) {
    throw new Error("Malformed Sanity response: article summary query must return an array");
  }

  const config = requirePublicSanityConfig();
  return raw.map((summary) => adaptSanitySummary(summary, config));
}
