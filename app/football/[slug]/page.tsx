import { ArticlePage } from "@/components/article/article-page";
import { getArticleSlugs } from "@/content/source";
import {
  buildArticleMetadata,
  resolveArticle,
  type ArticlePageProps,
} from "@/content/article-page";

export async function generateStaticParams() {
  return (await getArticleSlugs("FIELD")).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: ArticlePageProps) {
  return buildArticleMetadata("FIELD", params);
}

export default async function FieldArticlePage({ params }: ArticlePageProps) {
  const article = await resolveArticle("FIELD", params);

  return <ArticlePage article={article} />;
}
