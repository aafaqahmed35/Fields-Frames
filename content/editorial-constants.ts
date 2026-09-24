import type { EditorialSection } from "./story";

export const articleModes = ["FEATURE", "STANDARD", "ESSAY"] as const;

export const categoriesBySection = {
  FIELD: [
    "Culture",
    "Essay",
    "History",
    "Ideas",
    "Match",
    "Notebook",
    "Places",
    "Players",
    "Tactics",
  ],
  CINEMA: [
    "Design",
    "Editing",
    "Essay",
    "History",
    "Image",
    "Moviegoing",
    "Notebook",
    "Performance",
    "Places",
    "Screenwriting",
    "Sound",
  ],
  ESSAYS: [
    "Attention",
    "Ideas",
    "Internet",
    "Life",
    "Memory",
    "Objects",
    "Places",
    "Relationships",
    "Technology",
    "Work",
  ],
} as const satisfies Record<EditorialSection, readonly string[]>;

export const allCategories = Array.from(
  new Set(Object.values(categoriesBySection).flat()),
).sort();

export function isCategoryForSection(
  section: EditorialSection,
  category: string,
): boolean {
  return (categoriesBySection[section] as readonly string[]).includes(category);
}
