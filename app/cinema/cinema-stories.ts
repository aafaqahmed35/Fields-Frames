import type { StorySummary } from "@/content/story";

export type CinemaCategory =
  | "Design"
  | "Editing"
  | "Essay"
  | "History"
  | "Image"
  | "Moviegoing"
  | "Notebook"
  | "Performance"
  | "Places"
  | "Screenwriting"
  | "Sound";

export type CinemaStory = StorySummary<CinemaCategory>;

// Canonical CINEMA summaries. Article bodies are explicitly registered elsewhere.
export const cinemaStories = [
  {
    slug: "the-room-before-the-picture-begins",
    category: "Moviegoing",
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
    slug: "cutting-on-the-breath",
    category: "Editing",
    title: "Cutting on the breath",
    dek: "The invisible rhythms that let an edit feel less like a decision and more like an instinct.",
    author: "Mara Sen",
    date: "2026-09-12",
    dateLabel: "12 September 2026",
    image: {
      src: "/images/editorial/cinema-editing-room.jpg",
      width: 1536,
      height: 1024,
      alt: "An empty editing desk at night with a blank monitor, headphones, notes, and warm task light",
      credit: "Original visual study for Mind & Margin",
      focalPoint: "56% 50%",
    },
  },
  {
    slug: "the-close-up-is-a-promise",
    category: "Image",
    title: "The close-up is a promise, not an answer",
    dek: "A face fills the frame. What the camera withholds matters just as much.",
    author: "Nadia Rahman",
    date: "2026-08-26",
    dateLabel: "26 August 2026",
  },
  {
    slug: "when-room-tone-disappears",
    category: "Sound",
    title: "When room tone disappears",
    dek: "The near-silence beneath a scene is carrying more of the story than we think.",
    author: "Arun Bose",
    date: "2026-08-19",
    dateLabel: "19 August 2026",
  },
  {
    slug: "the-gesture-after-the-line",
    category: "Performance",
    title: "The gesture after the line",
    dek: "A hand lowers, a shoulder turns, and the character continues after the dialogue has finished.",
    author: "Mara Sen",
    date: "2026-08-11",
    dateLabel: "11 August 2026",
    image: {
      src: "/images/editorial/cinema-rehearsal-room.jpg",
      width: 1024,
      height: 1536,
      alt: "An anonymous performer standing between takes in a quiet rehearsal room",
      credit: "Original visual study for Mind & Margin",
      focalPoint: "50% 48%",
    },
  },
  {
    slug: "when-the-walls-enter-the-scene",
    category: "Design",
    title: "When the walls enter the scene",
    dek: "Production design begins long before we notice the room looking back at its characters.",
    author: "Inez George",
    date: "2026-08-02",
    dateLabel: "2 August 2026",
  },
  {
    slug: "a-scene-written-around-silence",
    category: "Screenwriting",
    title: "A scene written around silence",
    dek: "What remains on the page when the most important sentence is never spoken.",
    author: "Jonah Iyer",
    date: "2026-07-25",
    dateLabel: "25 July 2026",
  },
  {
    slug: "the-last-row-on-a-tuesday-afternoon",
    category: "Essay",
    title: "The last row on a Tuesday afternoon",
    dek: "On nearly empty screenings, shared solitude, and the peculiar comfort of surrendering an afternoon to the dark.",
    author: "Leena Thomas",
    date: "2026-07-16",
    dateLabel: "16 July 2026",
  },
  {
    slug: "who-keeps-the-neighbourhood-screen-alive",
    category: "Places",
    title: "Who keeps the neighbourhood screen alive?",
    dek: "The projectionists, ushers, programmers, and regulars who make a small cinema more than a room.",
    author: "Nadia Rahman",
    date: "2026-07-07",
    dateLabel: "7 July 2026",
  },
  {
    slug: "light-in-the-projection-booth",
    category: "History",
    title: "Light in the projection booth",
    dek: "A history of cinema told through heat, dust, changeovers, and the person watching from behind the audience.",
    author: "Inez George",
    date: "2026-06-29",
    dateLabel: "29 June 2026",
  },
  {
    slug: "credits-after-everyone-leaves",
    category: "Notebook",
    title: "Credits after everyone leaves",
    dek: "Notes on names, music, and the small interval before the house lights return.",
    author: "Arun Bose",
    date: "2026-06-20",
    dateLabel: "20 June 2026",
  },
  {
    slug: "the-films-we-carry-into-the-street",
    category: "Essay",
    title: "The films we carry into the street",
    dek: "Some images end at the frame. Others alter the weather of the walk home.",
    author: "Leena Thomas",
    date: "2026-06-12",
    dateLabel: "12 June 2026",
  },
] as const satisfies readonly CinemaStory[];
