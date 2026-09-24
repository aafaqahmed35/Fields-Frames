import { formatPublicationDate } from "./editorial-utils";

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
  author: string;
  date: string;
  dateLabel: string;
  image?: StoryImage;
};

export type StorySummaryInput<Category extends string = string> = Omit<
  StorySummary<Category>,
  "dateLabel"
>;

export function defineStories<
  const Stories extends readonly StorySummaryInput[],
>(stories: Stories): {
  readonly [Index in keyof Stories]: Stories[Index] & { dateLabel: string };
} {
  return stories.map((story) => ({
    ...story,
    dateLabel: formatPublicationDate(story.date),
  })) as {
    readonly [Index in keyof Stories]: Stories[Index] & { dateLabel: string };
  };
}

export type ArticleSummary = StorySummary & {
  section: EditorialSection;
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
