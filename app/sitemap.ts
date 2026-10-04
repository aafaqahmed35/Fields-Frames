import { getArticleSummaries } from "@/content/source";
import { editorialSections } from "@/content/editorial-routing";
import { buildSitemap } from "@/lib/seo";

export default async function sitemap() {
  const articles = (
    await Promise.all(editorialSections.map(getArticleSummaries))
  ).flat();
  return buildSitemap(articles);
}
