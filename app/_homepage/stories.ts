export type StorySection = "FIELD" | "CINEMA" | "ESSAYS";

export type StoryImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
  focalPoint?: string;
};

export type HomepageStory = {
  slug: string;
  section: StorySection;
  label: string;
  title: string;
  dek: string;
  author: string;
  date: string;
  dateLabel: string;
  image?: StoryImage;
};

// Temporary editorial photography was generated specifically for Mind & Margin
// with OpenAI ImageGen. It is local, original placeholder material designed to
// preserve the intended crops until the publication has its own image library.
export const homepageStories: readonly HomepageStory[] = [
  {
    slug: "what-the-floodlights-remember",
    section: "FIELD",
    label: "Essay",
    title: "What the floodlights remember",
    dek: "A winter pitch, a final whistle, and the strange way a football ground keeps the history of everyone who has stood beside it.",
    author: "Rafi Mirza",
    date: "2026-09-18",
    dateLabel: "18 September 2026",
    image: {
      src: "/images/editorial/field-after-rain.jpg",
      width: 1536,
      height: 1024,
      alt: "An empty community football pitch after rain beneath floodlights at blue hour",
      credit: "Original visual study for Mind & Margin",
      focalPoint: "50% 54%",
    },
  },
  {
    slug: "the-case-for-looking-out-of-the-window",
    section: "ESSAYS",
    label: "Attention",
    title: "The case for looking out of the window",
    dek: "On buses, boredom, and the small discoveries that arrive when a journey is allowed to remain a journey.",
    author: "Leena Thomas",
    date: "2026-09-15",
    dateLabel: "15 September 2026",
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
    slug: "cutting-on-the-breath",
    section: "CINEMA",
    label: "Craft",
    title: "Cutting on the breath",
    dek: "The invisible rhythms that let an edit feel less like a decision and more like an instinct.",
    author: "Mara Sen",
    date: "2026-09-12",
    dateLabel: "12 September 2026",
  },
  {
    slug: "the-geometry-of-the-second-ball",
    section: "FIELD",
    label: "Tactics",
    title: "The geometry of the second ball",
    dek: "The first contest makes the noise. The next one often decides the match.",
    author: "Owen D'Souza",
    date: "2026-09-10",
    dateLabel: "10 September 2026",
  },
  {
    slug: "the-room-before-the-picture-begins",
    section: "CINEMA",
    label: "Cinema",
    title: "The room before the picture begins",
    dek: "An empty screen is not empty at all. It holds anticipation, memory, and the private ritual of waiting for light.",
    author: "Nadia Rahman",
    date: "2026-09-08",
    dateLabel: "8 September 2026",
    image: {
      src: "/images/editorial/frames-empty-cinema.jpg",
      width: 1672,
      height: 941,
      alt: "An empty independent cinema auditorium facing a blank screen in a projector beam",
      credit: "Original visual study for Mind & Margin",
      focalPoint: "50% 50%",
    },
  },
  {
    slug: "the-useful-distance-of-an-unfinished-thought",
    section: "ESSAYS",
    label: "Notebook",
    title: "The useful distance of an unfinished thought",
    dek: "Some ideas improve not through pursuit, but through the quiet interval in which they are almost forgotten.",
    author: "Jonah Iyer",
    date: "2026-09-04",
    dateLabel: "4 September 2026",
  },
  {
    slug: "a-ground-at-the-edge-of-town",
    section: "FIELD",
    label: "Places",
    title: "A ground at the edge of town",
    dek: "Where the floodlights meet the ring road, Saturday still gathers a crowd.",
    author: "Rafi Mirza",
    date: "2026-08-30",
    dateLabel: "30 August 2026",
  },
  {
    slug: "the-close-up-is-a-promise",
    section: "CINEMA",
    label: "Form",
    title: "The close-up is a promise, not an answer",
    dek: "A face fills the frame. What the camera withholds matters just as much.",
    author: "Nadia Rahman",
    date: "2026-08-26",
    dateLabel: "26 August 2026",
  },
  {
    slug: "in-praise-of-the-ordinary-notebook",
    section: "ESSAYS",
    label: "Objects",
    title: "In praise of the ordinary notebook",
    dek: "Dog-eared pages, abandoned lists, and a life recorded without an audience.",
    author: "Leena Thomas",
    date: "2026-08-22",
    dateLabel: "22 August 2026",
  },
  {
    slug: "why-the-full-back-keeps-disappearing",
    section: "FIELD",
    label: "Ideas",
    title: "Why the full-back keeps disappearing",
    dek: "A familiar position is being redrawn by the spaces players leave behind.",
    author: "Owen D'Souza",
    date: "2026-08-18",
    dateLabel: "18 August 2026",
  },
];
