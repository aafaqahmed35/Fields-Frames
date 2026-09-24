import { cinemaStories } from "@/app/cinema/cinema-stories";
import { essayStories } from "@/app/essays/essay-stories";
import { fieldStories } from "@/app/football/field-stories";
import {
  getArticleSummaries,
  resolveContentSourceMode,
} from "@/content/source";
import type { EditorialSection, StoryImage, StorySummary } from "@/content/story";

export type StorySection = EditorialSection;
export type { StoryImage };

export type HomepageStory = Omit<StorySummary, "category"> & {
  section: StorySection;
  label: string;
  dekOverride?: string;
};

function storyBySlug(
  stories: readonly StorySummary[],
  slug: string,
): StorySummary {
  const story = stories.find((candidate) => candidate.slug === slug);

  if (!story) {
    throw new Error(`Missing canonical story summary: ${slug}`);
  }

  return story;
}

function homepageStory(
  section: StorySection,
  story: StorySummary,
  label: string,
  homepageDek?: string,
): HomepageStory {
  return {
    ...story,
    section,
    label,
    dek: homepageDek ?? story.dek,
    dekOverride: homepageDek,
  };
}

// The homepage owns only its curation and presentation copy. Canonical title,
// author, date, slug, and image metadata come from the section summaries.
export const homepageStories = [
  homepageStory(
    "FIELD",
    storyBySlug(fieldStories, "what-the-floodlights-remember"),
    "Essay",
  ),
  homepageStory(
    "ESSAYS",
    storyBySlug(essayStories, "the-case-for-looking-out-of-the-window"),
    "Attention",
    "On buses, boredom, and the small discoveries that arrive when a journey is allowed to remain a journey.",
  ),
  homepageStory(
    "CINEMA",
    storyBySlug(cinemaStories, "cutting-on-the-breath"),
    "Craft",
  ),
  homepageStory(
    "FIELD",
    storyBySlug(fieldStories, "the-geometry-of-the-second-ball"),
    "Tactics",
  ),
  homepageStory(
    "CINEMA",
    storyBySlug(cinemaStories, "the-room-before-the-picture-begins"),
    "Cinema",
  ),
  homepageStory(
    "ESSAYS",
    storyBySlug(essayStories, "the-useful-distance-of-an-unfinished-thought"),
    "Notebook",
    "Some ideas improve not through pursuit, but through the quiet interval in which they are almost forgotten.",
  ),
  homepageStory(
    "FIELD",
    storyBySlug(fieldStories, "a-ground-at-the-edge-of-town"),
    "Places",
  ),
  homepageStory(
    "CINEMA",
    storyBySlug(cinemaStories, "the-close-up-is-a-promise"),
    "Form",
  ),
  homepageStory(
    "ESSAYS",
    storyBySlug(essayStories, "in-praise-of-the-ordinary-notebook"),
    "Objects",
    "Dog-eared pages, abandoned lists, and a life recorded without an audience.",
  ),
  homepageStory(
    "FIELD",
    storyBySlug(fieldStories, "why-the-full-back-keeps-disappearing"),
    "Ideas",
  ),
] as const satisfies readonly HomepageStory[];

export async function getHomepageStories(): Promise<readonly HomepageStory[]> {
  if (resolveContentSourceMode() === "local") {
    return homepageStories;
  }

  const summaries = (
    await Promise.all(
      (["FIELD", "CINEMA", "ESSAYS"] as const).map((section) =>
        getArticleSummaries(section),
      ),
    )
  ).flat();
  const byIdentity = new Map(
    summaries.map((story) => [`${story.section}/${story.slug}`, story]),
  );

  return homepageStories.map((story) => {
    const summary = byIdentity.get(`${story.section}/${story.slug}`);
    if (!summary) return story;

    return {
      ...story,
      author: summary.author,
      date: summary.date,
      dateLabel: summary.dateLabel,
      dek: story.dekOverride ?? summary.dek,
      image: summary.image,
      title: summary.title,
    };
  });
}
