import type { Metadata, MetadataRoute } from "next";
import { stegaClean } from "next-sanity";
import type { Article } from "@/content/articles";
import type { ArticleSummary } from "@/content/story";
import { sectionRoutes } from "@/content/story";
import { resolveArticlePath } from "@/content/editorial-routing";
import { publicUrl } from "./site-origin";

export const publicationName = "Mind & Margin";
export const publicationDescription =
  "An independent publication about football, cinema, life, culture, and ideas.";
export const previewRobots = {
  index: false,
  follow: false,
  nocache: true,
  noarchive: true,
};

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = publicUrl(path);
  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: publicationName,
      type: "website",
    },
    twitter: { card: "summary", title, description },
  };
}

export function articleMetadata(article: Article, preview = false): Metadata {
  const title = stegaClean(article.seo?.title ?? article.title);
  const description = stegaClean(article.seo?.description ?? article.dek);
  const path = resolveArticlePath(article.section, stegaClean(article.slug));
  if (!path) throw new Error("Invalid canonical article identity");
  const image = article.seo?.socialImage ?? article.image;
  // Local SVG compositions are editorial artwork, not supported social-card images.
  const socialImage =
    image && !/\.svg(?:\?|$)/i.test(image.src) ? image : undefined;
  const images = socialImage
    ? [
        {
          url: new URL(socialImage.src, publicUrl("/")).href,
          width: socialImage.width,
          height: socialImage.height,
          alt: stegaClean(socialImage.alt),
        },
      ]
    : [];
  return {
    ...pageMetadata(title, description, path),
    authors: [{ name: stegaClean(article.author) }],
    robots: preview ? previewRobots : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      url: publicUrl(path),
      siteName: publicationName,
      publishedTime: stegaClean(article.date),
      modifiedTime: article.modifiedAt,
      authors: [stegaClean(article.author)],
      section: article.section,
      images,
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
  };
}

export function articleStructuredData(article: Article) {
  const path = resolveArticlePath(article.section, stegaClean(article.slug));
  if (!path) throw new Error("Invalid structured-data article identity");
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: stegaClean(article.title),
    description: stegaClean(article.dek),
    datePublished: stegaClean(article.date),
    dateModified: article.modifiedAt,
    articleSection: article.section,
    author: { "@type": "Person", name: stegaClean(article.authorDetails.name) },
    mainEntityOfPage: publicUrl(path),
    publisher: {
      "@type": "Organization",
      name: publicationName,
      url: publicUrl("/"),
    },
    image: article.image
      ? new URL(article.image.src, publicUrl("/")).href
      : undefined,
  };
}

export function buildSitemap(
  articles: readonly ArticleSummary[],
): MetadataRoute.Sitemap {
  return [
    ...["/", ...Object.values(sectionRoutes)].map((path) => ({
      url: publicUrl(path),
    })),
    ...articles.map((article) => {
      const path = resolveArticlePath(article.section, article.slug);
      if (!path) throw new Error("Invalid sitemap article identity");
      return {
        url: publicUrl(path),
        lastModified: article.modifiedAt ?? article.date,
      };
    }),
  ];
}

export function robotsPolicy(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] },
    sitemap: publicUrl("/sitemap.xml"),
  };
}
