import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getArticle } from "./articles";
import type { EditorialSection } from "./story";

export type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function resolveArticle(
  section: EditorialSection,
  params: ArticlePageProps["params"],
) {
  const { slug } = await params;
  const article = getArticle(section, slug);

  if (!article) {
    notFound();
  }

  return article;
}

export async function buildArticleMetadata(
  section: EditorialSection,
  params: ArticlePageProps["params"],
): Promise<Metadata> {
  const article = await resolveArticle(section, params);

  return {
    title: article.title,
    description: article.dek,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.dek,
      publishedTime: article.date,
      authors: [article.author],
      section: article.section,
    },
  };
}
