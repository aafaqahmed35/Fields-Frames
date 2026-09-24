import { cache } from "react";

import {
  getArticle as getLocalArticle,
  getSectionArticles as getLocalSectionArticles,
  type Article,
} from "./articles";
import {
  sectionRoutes,
  type ArticleSummary,
  type EditorialSection,
  type StorySummary,
} from "./story";
import {
  fetchSanityArticle,
  fetchSanityArticleSlugs,
  fetchSanityArticleSummaries,
} from "@/sanity/lib/data";
import { publicSanityConfig } from "@/sanity/env";

export type ContentSourceMode = "local" | "sanity";

let warnedAboutProductionDefault = false;

export function resolveContentSourceMode(
  env: Partial<
    Pick<NodeJS.ProcessEnv, "MIND_MARGIN_CONTENT_SOURCE" | "NODE_ENV">
  > = process.env,
): ContentSourceMode {
  const configured = env.MIND_MARGIN_CONTENT_SOURCE;

  if (configured === "local" || configured === "sanity") {
    return configured;
  }
  if (configured) {
    throw new Error(
      `Unsupported MIND_MARGIN_CONTENT_SOURCE value: ${configured}. Use "local" or "sanity".`,
    );
  }

  if (env.NODE_ENV === "production" && !warnedAboutProductionDefault) {
    warnedAboutProductionDefault = true;
    console.warn(
      "MIND_MARGIN_CONTENT_SOURCE is unset; using the explicit migration fallback (local). Set it to sanity for CMS-backed production content.",
    );
  }

  return "local";
}

function assertSanityReady() {
  if (!publicSanityConfig) {
    throw new Error(
      "MIND_MARGIN_CONTENT_SOURCE=sanity requires NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.",
    );
  }
}

export const getArticle = cache(
  async (section: EditorialSection, slug: string): Promise<Article | undefined> => {
    if (resolveContentSourceMode() === "sanity") {
      assertSanityReady();
      return fetchSanityArticle(section, slug);
    }

    return getLocalArticle(section, slug);
  },
);

export const getArticleSlugs = cache(
  async (section: EditorialSection): Promise<readonly string[]> => {
    if (resolveContentSourceMode() === "sanity") {
      assertSanityReady();
      return fetchSanityArticleSlugs(section);
    }

    return getLocalSectionArticles(section).map(({ slug }) => slug);
  },
);

export const getArticleSummaries = cache(
  async (section: EditorialSection): Promise<readonly ArticleSummary[]> => {
    if (resolveContentSourceMode() === "sanity") {
      assertSanityReady();
      return fetchSanityArticleSummaries(section);
    }

    return getLocalSectionArticles(section).map((article) => ({
      author: article.author,
      category: article.category,
      date: article.date,
      dateLabel: article.dateLabel,
      dek: article.dek,
      image: article.image,
      section: article.section,
      slug: article.slug,
      title: article.title,
    }));
  },
);

export async function resolveCuratedStories<T extends StorySummary>(
  section: EditorialSection,
  stories: readonly T[],
): Promise<readonly T[]> {
  if (resolveContentSourceMode() === "local") {
    return stories;
  }

  const summaries = await getArticleSummaries(section);
  const bySlug = new Map(summaries.map((summary) => [summary.slug, summary]));

  return stories.map((story) => {
    const summary = bySlug.get(story.slug);
    if (!summary) return story;

    const category =
      story.category === story.category.toUpperCase()
        ? summary.category.toUpperCase()
        : summary.category;

    return {
      ...story,
      author: summary.author,
      category,
      date: summary.date,
      dateLabel: summary.dateLabel,
      dek: summary.dek,
      image: summary.image,
      title: summary.title,
    } as T;
  });
}

export async function getArticleHref(
  section: EditorialSection,
  slug: string,
): Promise<string | undefined> {
  const slugs = await getArticleSlugs(section);
  if (!slugs.includes(slug)) {
    return undefined;
  }

  return `${sectionRoutes[section]}/${slug}`;
}
