import { defineStories, type StorySummary } from "@/content/story";

export type EssayCategory =
  | "ATTENTION"
  | "IDEAS"
  | "INTERNET"
  | "LIFE"
  | "MEMORY"
  | "OBJECTS"
  | "PLACES"
  | "RELATIONSHIPS"
  | "TECHNOLOGY"
  | "WORK";

export type EssayForm = "Essay" | "Notebook" | "Observation";

export type EssayStory = StorySummary<EssayCategory> & {
  form: EssayForm;
  readingMinutes: number;
  excerpt?: string;
};

export const essayStories = defineStories([
  {
    slug: "the-case-for-looking-out-of-the-window",
    category: "ATTENTION",
    form: "Essay",
    title: "The case for looking out of the window",
    dek: "A view with nothing urgent in it can return us to the scale of our own lives.",
    author: "Leila Arun",
    date: "2026-09-18",
    readingMinutes: 9,
    excerpt:
      "The window asks very little of us. It offers weather, repetition, an unknown person crossing the street—and, if we stay long enough, the slow return of our attention.",
    image: {
      src: "/images/editorial/journal-rain-window.jpg",
      width: 1024,
      height: 1536,
      alt: "A passenger reading beside a rain-streaked city bus window",
      credit: "Original visual study for Mind & Margin",
      focalPoint: "54% 50%",
    },
  },
  {
    slug: "the-rooms-we-remember-have-their-own-weather",
    category: "MEMORY",
    form: "Essay",
    title: "The rooms we remember have their own weather",
    dek: "Why the light in an old kitchen can outlast the address, the furniture, and the people who once gathered there.",
    author: "Mara Venn",
    date: "2026-09-12",
    readingMinutes: 8,
  },
  {
    slug: "a-small-defence-of-being-early",
    category: "LIFE",
    form: "Observation",
    title: "A small defence of being early",
    dek: "The ten unclaimed minutes before anyone else arrives are not empty time.",
    author: "Nikhil Sethi",
    date: "2026-09-09",
    readingMinutes: 4,
  },
  {
    slug: "what-we-keep-after-usefulness-ends",
    category: "OBJECTS",
    form: "Essay",
    title: "What we keep after usefulness ends",
    dek: "A blunt pencil, a dead key, a receipt from another decade: private museums rarely announce themselves.",
    author: "Jon Bell",
    date: "2026-09-04",
    readingMinutes: 6,
  },
  {
    slug: "walking-the-same-street-until-it-changes",
    category: "PLACES",
    form: "Essay",
    title: "Walking the same street until it changes",
    dek: "A familiar route is a record kept in shopfronts, scaffolding, faces, and the things we fail to notice leaving.",
    author: "Sofia Reyes",
    date: "2026-08-28",
    readingMinutes: 10,
    image: {
      src: "/images/editorial/journal-rain-window.jpg",
      alt: "A rainy city street seen through the window of a bus, with a passenger reading in the reflection",
      width: 1024,
      height: 1536,
      credit: "Mind & Margin archive",
      focalPoint: "50% 50%",
    },
  },
  {
    slug: "friendship-in-the-time-between-plans",
    category: "RELATIONSHIPS",
    form: "Observation",
    title: "Friendship in the time between plans",
    dek: "Some relationships are sustained less by occasions than by the quiet traffic of remembered details.",
    author: "Amelia Hart",
    date: "2026-08-23",
    readingMinutes: 5,
  },
  {
    slug: "the-taste-you-did-not-choose",
    category: "TECHNOLOGY",
    form: "Essay",
    title: "The taste you did not choose",
    dek: "Recommendation systems do not only predict preference. Slowly, politely, they furnish the room in which preference is formed.",
    author: "Ishaan Malik",
    date: "2026-08-17",
    readingMinutes: 11,
  },
  {
    slug: "an-inbox-is-not-an-archive",
    category: "INTERNET",
    form: "Essay",
    title: "An inbox is not an archive",
    dek: "Old messages survive in abundance, but abundance is not the same as memory.",
    author: "Mara Venn",
    date: "2026-08-10",
    readingMinutes: 7,
  },
  {
    slug: "work-has-entered-the-waiting-room",
    category: "WORK",
    form: "Observation",
    title: "Work has entered the waiting room",
    dek: "The small intervals that once belonged to nobody now arrive with a screen and a task attached.",
    author: "Leila Arun",
    date: "2026-08-03",
    readingMinutes: 5,
  },
  {
    slug: "in-praise-of-the-ordinary-notebook",
    category: "OBJECTS",
    form: "Notebook",
    title: "In praise of the ordinary notebook",
    dek: "Its great virtue is not permanence but permission: a place where a thought can arrive without having to perform.",
    author: "Jon Bell",
    date: "2026-07-27",
    readingMinutes: 6,
  },
  {
    slug: "the-useful-distance-of-an-unfinished-thought",
    category: "IDEAS",
    form: "Notebook",
    title: "The useful distance of an unfinished thought",
    dek: "Leave the sentence alone overnight and it may return with less certainty and more truth.",
    author: "Amelia Hart",
    date: "2026-07-19",
    readingMinutes: 4,
  },
  {
    slug: "the-photographs-we-decided-not-to-take",
    category: "MEMORY",
    form: "Notebook",
    title: "The photographs we decided not to take",
    dek: "Not every refusal to document a moment is a claim to have lived it more fully.",
    author: "Sofia Reyes",
    date: "2026-07-11",
    readingMinutes: 5,
  },
  {
    slug: "walking-without-headphones",
    category: "ATTENTION",
    form: "Observation",
    title: "Walking without headphones",
    dek: "A city has a rough, repetitive score. Hearing it again changes the distance between the street and the self.",
    author: "Nikhil Sethi",
    date: "2026-07-02",
    readingMinutes: 4,
  },
  {
    slug: "against-optimising-the-afternoon",
    category: "LIFE",
    form: "Essay",
    title: "Against optimising the afternoon",
    dek: "Not every open hour is waiting to become a better version of itself.",
    author: "Ishaan Malik",
    date: "2026-06-24",
    readingMinutes: 7,
  },
] as const satisfies readonly Omit<EssayStory, "dateLabel">[]);
