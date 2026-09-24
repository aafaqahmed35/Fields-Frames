import type { Article } from "@/content/articles";
import type { ArticleSummary, EditorialSection } from "@/content/story";
import { requirePublicSanityConfig } from "@/sanity/env";

import { adaptSanityArticle, adaptSanitySummary } from "./adapter";
import { getSanityClient } from "./client";
import {
  ARTICLE_QUERY,
  ARTICLE_SLUGS_QUERY,
  ARTICLE_SUMMARIES_QUERY,
} from "./queries";

export async function fetchSanityArticle(
  section: EditorialSection,
  slug: string,
): Promise<Article | undefined> {
  const raw: unknown = await getSanityClient().fetch(ARTICLE_QUERY, { section, slug });
  return raw ? adaptSanityArticle(raw, requirePublicSanityConfig()) : undefined;
}

export async function fetchSanityArticleSlugs(
  section: EditorialSection,
): Promise<readonly string[]> {
  const raw: unknown = await getSanityClient().fetch(ARTICLE_SLUGS_QUERY, { section });
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
  const raw: unknown = await getSanityClient().fetch(ARTICLE_SUMMARIES_QUERY, { section });
  if (!Array.isArray(raw)) {
    throw new Error("Malformed Sanity response: article summary query must return an array");
  }

  const config = requirePublicSanityConfig();
  return raw.map((summary) => adaptSanitySummary(summary, config));
}
