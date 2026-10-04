import { articleMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import type { Article } from "./articles";
import { getArticle, type ArticleFetchOptions } from "./source";
import type { EditorialSection } from "./story";

export type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function resolveArticle(
  section: EditorialSection,
  params: ArticlePageProps["params"],
  options?: ArticleFetchOptions,
): Promise<Article> {
  const { slug } = await params;
  const article = await getArticle(section, slug, options);

  if (!article) {
    notFound();
    throw new Error("Next.js notFound() returned unexpectedly");
  }

  return article;
}

export async function buildArticleMetadata(
  section: EditorialSection,
  params: ArticlePageProps["params"],
): Promise<Metadata> {
  const article = await resolveArticle(section, params, { stega: false });
  const isPreview = (await draftMode()).isEnabled;
  return articleMetadata(article, isPreview);
}
