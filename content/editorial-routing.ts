import { sectionRoutes, type EditorialSection } from "./story";

export const editorialSections = ["FIELD", "CINEMA", "ESSAYS"] as const;
export const articleSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isEditorialSection(value: unknown): value is EditorialSection {
  return (
    typeof value === "string" &&
    editorialSections.includes(value as EditorialSection)
  );
}

export function isValidArticleSlug(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length <= 96 &&
    articleSlugPattern.test(value)
  );
}

export function resolveArticlePath(
  section: unknown,
  slug: unknown,
): string | undefined {
  if (!isEditorialSection(section) || !isValidArticleSlug(slug)) {
    return undefined;
  }

  return `${sectionRoutes[section]}/${slug}`;
}
