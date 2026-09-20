export type FieldCategory =
  | "Culture"
  | "Essay"
  | "History"
  | "Ideas"
  | "Match"
  | "Notebook"
  | "Places"
  | "Players"
  | "Tactics";

export type FieldImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string;
  focalPoint?: string;
};

export type FieldStory = {
  slug: string;
  category: FieldCategory;
  title: string;
  dek: string;
  author: string;
  date: string;
  dateLabel: string;
  image?: FieldImage;
};

// Local editorial material for the FIELD section. These are deliberately
// timeless, non-linked story concepts until the shared article system exists.
export const fieldStories = [
  {
    slug: "what-the-floodlights-remember",
    category: "Essay",
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
    slug: "the-geometry-of-the-second-ball",
    category: "Tactics",
    title: "The geometry of the second ball",
    dek: "The first contest makes the noise. The next one often decides the match.",
    author: "Owen D'Souza",
    date: "2026-09-10",
    dateLabel: "10 September 2026",
  },
  {
    slug: "why-the-full-back-keeps-disappearing",
    category: "Tactics",
    title: "Why the full-back keeps disappearing",
    dek: "A familiar position is being redrawn by the spaces players leave behind.",
    author: "Owen D'Souza",
    date: "2026-08-18",
    dateLabel: "18 August 2026",
  },
  {
    slug: "when-the-press-loses-its-nerve",
    category: "Ideas",
    title: "When the press loses its nerve",
    dek: "One backward step can turn coordinated pressure into eleven separate decisions.",
    author: "Mina Patel",
    date: "2026-08-12",
    dateLabel: "12 August 2026",
  },
  {
    slug: "a-ground-at-the-edge-of-town",
    category: "Places",
    title: "A ground at the edge of town",
    dek: "Where the floodlights meet the ring road, Saturday still gathers a crowd.",
    author: "Rafi Mirza",
    date: "2026-08-30",
    dateLabel: "30 August 2026",
  },
  {
    slug: "the-saturday-walk",
    category: "Culture",
    title: "The Saturday walk",
    dek: "Past the same bakery, under the same railway bridge: how the journey to a ground becomes part of the match.",
    author: "Imogen Price",
    date: "2026-08-06",
    dateLabel: "6 August 2026",
  },
  {
    slug: "songs-after-the-final-whistle",
    category: "Culture",
    title: "Songs after the final whistle",
    dek: "A study of the minutes when the result is settled but the crowd is not ready to leave.",
    author: "Sahil Rao",
    date: "2026-07-29",
    dateLabel: "29 July 2026",
  },
  {
    slug: "the-keepers-private-map",
    category: "Players",
    title: "The keeper's private map",
    dek: "From the far end, the match is read in distances, shoulders, and danger arriving early.",
    author: "Mina Patel",
    date: "2026-07-21",
    dateLabel: "21 July 2026",
  },
  {
    slug: "rooms-beneath-the-old-stand",
    category: "History",
    title: "Rooms beneath the old stand",
    dek: "Boot hooks, tea urns, and the modest architecture that held a century of matchdays.",
    author: "Rafi Mirza",
    date: "2026-07-13",
    dateLabel: "13 July 2026",
  },
  {
    slug: "rain-on-the-five-a-side-court",
    category: "Notebook",
    title: "Rain on the five-a-side court",
    dek: "Six observations from an evening game played beneath the flyover.",
    author: "Leena Thomas",
    date: "2026-07-04",
    dateLabel: "4 July 2026",
  },
  {
    slug: "the-match-seen-from-a-train",
    category: "Match",
    title: "The match seen from a train",
    dek: "For eight seconds, a rectangle of light and twenty-two moving figures become the whole world.",
    author: "Jonah Iyer",
    date: "2026-06-26",
    dateLabel: "26 June 2026",
  },
  {
    slug: "learning-shape-in-the-schoolyard",
    category: "Essay",
    title: "Learning shape in the schoolyard",
    dek: "Before formations had numbers, space was understood by chasing it.",
    author: "Sahil Rao",
    date: "2026-06-17",
    dateLabel: "17 June 2026",
  },
] as const satisfies readonly FieldStory[];
