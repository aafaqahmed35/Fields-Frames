import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Article } from "./articles";
import { getArticle } from "./source";
import type { EditorialSection } from "./story";

export type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function resolveArticle(
  section: EditorialSection,
  params: ArticlePageProps["params"],
): Promise<Article> {
  const { slug } = await params;
  const article = await getArticle(section, slug);

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
  const article = await resolveArticle(section, params);
  const socialImage =
    article.seo?.socialImage ??
    (article.image?.src.startsWith("https://") ? article.image : undefined);

  return {
    title: article.seo?.title ?? article.title,
    description: article.seo?.description ?? article.dek,
    openGraph: {
      type: "article",
      title: article.seo?.title ?? article.title,
      description: article.seo?.description ?? article.dek,
      publishedTime: article.date,
      authors: [article.author],
      section: article.section,
      images: socialImage
        ? [
            {
              url: socialImage.src,
              width: socialImage.width,
              height: socialImage.height,
              alt: socialImage.alt,
            },
          ]
        : undefined,
    },
  };
}
