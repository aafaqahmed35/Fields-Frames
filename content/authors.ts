export const authors = {
  "Amelia Hart": {
    name: "Amelia Hart",
    bio: "Amelia Hart writes about friendship, unfinished ideas, and the minor negotiations of ordinary life.",
  },
  "Arun Bose": {
    name: "Arun Bose",
    bio: "Arun Bose writes about film sound, projection, and what remains after an image ends.",
  },
  "Imogen Price": {
    name: "Imogen Price",
    bio: "Imogen Price writes about football culture, familiar routes, and the rituals surrounding a match.",
  },
  "Inez George": {
    name: "Inez George",
    bio: "Inez George writes about production design, cinema history, and the rooms built for stories.",
  },
  "Ishaan Malik": {
    name: "Ishaan Malik",
    bio: "Ishaan Malik writes about technology as lived experience, attention, and the uses of unclaimed time.",
  },
  "Jon Bell": {
    name: "Jon Bell",
    bio: "Jon Bell writes about objects, notebooks, and the private archives people make without meaning to.",
  },
  "Jonah Iyer": {
    name: "Jonah Iyer",
    bio: "Jonah Iyer writes across football, cinema, and essays, with an interest in distance and silence.",
  },
  "Leena Thomas": {
    name: "Leena Thomas",
    bio: "Leena Thomas writes about football, moviegoing, and the habits that turn places into memory.",
  },
  "Leila Arun": {
    name: "Leila Arun",
    bio: "Leila Arun writes essays about attention, work, and the overlooked intervals of an ordinary day.",
  },
  "Mara Sen": {
    name: "Mara Sen",
    bio: "Mara Sen writes about editing, performance, and the physical rhythms that shape a scene.",
  },
  "Mara Venn": {
    name: "Mara Venn",
    bio: "Mara Venn writes about memory, correspondence, and the weather carried by remembered rooms.",
  },
  "Mina Patel": {
    name: "Mina Patel",
    bio: "Mina Patel writes about football tactics, pressure, and how players read danger before it arrives.",
  },
  "Nadia Rahman": {
    name: "Nadia Rahman",
    bio: "Nadia Rahman writes about images, audiences, and the social life of rooms built for cinema.",
  },
  "Nikhil Sethi": {
    name: "Nikhil Sethi",
    bio: "Nikhil Sethi writes short observations about cities, waiting, and the sounds of daily life.",
  },
  "Owen D'Souza": {
    name: "Owen D'Souza",
    bio: "Owen D'Souza writes about football tactics, especially the spaces and second actions a broadcast can miss.",
  },
  "Rafi Mirza": {
    name: "Rafi Mirza",
    bio: "Rafi Mirza writes about football grounds, local histories, and the memories gathered around the game.",
  },
  "Sahil Rao": {
    name: "Sahil Rao",
    bio: "Sahil Rao writes about football songs, informal games, and the ways a crowd learns itself.",
  },
  "Sofia Reyes": {
    name: "Sofia Reyes",
    bio: "Sofia Reyes writes about streets, photographs, and the slow revisions of familiar places.",
  },
} as const;

export type AuthorName = keyof typeof authors;

export type Author = {
  id: string;
  name: string;
  slug: string;
  bio: string;
};

export function getAuthor(name: AuthorName): Author {
  const author = authors[name];
  const slug = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return { ...author, id: `author-${slug}`, slug };
}
