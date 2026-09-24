import { ArticlePage } from "@/components/article/article-page";
import { getArticleSlugs } from "@/content/source";
import {
  buildArticleMetadata,
  resolveArticle,
  type ArticlePageProps,
} from "@/content/article-page";

export async function generateStaticParams() {
  return (await getArticleSlugs("ESSAYS")).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: ArticlePageProps) {
  return buildArticleMetadata("ESSAYS", params);
}

export default async function EssayArticlePage({ params }: ArticlePageProps) {
  const article = await resolveArticle("ESSAYS", params);

  return <ArticlePage article={article} />;
}
