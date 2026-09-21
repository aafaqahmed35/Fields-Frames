import type { AuthorName } from "./authors";

export type EditorialSection = "FIELD" | "CINEMA" | "ESSAYS";

export type StoryImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
  caption?: string;
  focalPoint?: string;
};

export type StorySummary<Category extends string = string> = {
  slug: string;
  category: Category;
  title: string;
  dek: string;
  author: AuthorName;
  date: string;
  dateLabel: string;
  image?: StoryImage;
};

export const sectionRoutes: Record<EditorialSection, string> = {
  FIELD: "/football",
  CINEMA: "/cinema",
  ESSAYS: "/essays",
};

export const sectionNames: Record<EditorialSection, string> = {
  FIELD: "FIELD",
  CINEMA: "CINEMA",
  ESSAYS: "ESSAYS",
};
