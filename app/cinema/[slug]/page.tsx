import { ArticlePage } from "@/components/article/article-page";
import { getSectionArticles } from "@/content/articles";
import {
  buildArticleMetadata,
  resolveArticle,
  type ArticlePageProps,
} from "@/content/article-page";

export function generateStaticParams() {
  return getSectionArticles("CINEMA").map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: ArticlePageProps) {
  return buildArticleMetadata("CINEMA", params);
}

export default async function CinemaArticlePage({ params }: ArticlePageProps) {
  const article = await resolveArticle("CINEMA", params);

  return <ArticlePage article={article} />;
}
