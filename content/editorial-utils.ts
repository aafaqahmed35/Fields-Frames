import type { EditorialBodyBlock } from "./articles";

const WORDS_PER_MINUTE = 225;
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function formatPublicationDate(value: string): string {
  const match = DATE_ONLY.exec(value);

  if (!match) {
    throw new Error(`Invalid publication date: ${value}`);
  }

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    throw new Error(`Invalid publication date: ${value}`);
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
}

function blockText(block: EditorialBodyBlock): readonly string[] {
  switch (block.type) {
    case "paragraph":
    case "heading":
    case "note":
      return [block.text];
    case "pullQuote":
      return block.attribution
        ? [block.text, block.attribution]
        : [block.text];
    case "list":
      return block.items;
    case "figure":
      return block.image.caption ? [block.image.caption] : [];
    case "divider":
      return [];
  }
}

export function deriveReadingMinutes(
  body: readonly EditorialBodyBlock[],
  opening?: string,
): number {
  const text = [opening ?? "", ...body.flatMap(blockText)].join(" ").trim();
  const words = text ? text.split(/\s+/u).length : 0;

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
