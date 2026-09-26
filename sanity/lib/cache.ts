import type { EditorialSection } from "@/content/story";

const prefix = "sanity";

export const articleCacheTag = `${prefix}:article`;

export function articleIdentityCacheTag(
  section: EditorialSection,
  slug: string,
) {
  return `${prefix}:article:${section.toLowerCase()}:${slug}`;
}

export function sectionCacheTag(section: EditorialSection) {
  return `${prefix}:section:${section.toLowerCase()}`;
}
