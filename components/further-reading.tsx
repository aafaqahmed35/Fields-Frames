import Link from "next/link";
import { getArticleSummaries } from "@/content/source";
import {
  sectionRoutes,
  type EditorialSection,
  type StorySummary,
} from "@/content/story";
import styles from "./further-reading.module.css";

export async function FurtherReading({
  section,
  curated,
}: {
  section: EditorialSection;
  curated: readonly StorySummary[];
}) {
  const curatedSlugs = new Set(curated.map((story) => story.slug));
  const stories = (await getArticleSummaries(section)).filter(
    (story) => !curatedSlugs.has(story.slug),
  );
  if (!stories.length) return null;
  return (
    <section
      className={`editorial-container ${styles.reading}`}
      aria-labelledby="further-reading-title"
    >
      <p className="editorial-label">Continue in {section}</p>
      <h2 id="further-reading-title">Further reading</h2>
      {stories.map((story) => (
        <article key={story.slug}>
          <p className="editorial-label">{story.category}</p>
          <h3>
            <Link
              className="editorial-story-link"
              href={`${sectionRoutes[section]}/${story.slug}`}
            >
              {story.title}
            </Link>
          </h3>
          <p>{story.dek}</p>
          <p>
            {story.author} ·{" "}
            <time dateTime={story.date}>{story.dateLabel}</time>
          </p>
        </article>
      ))}
    </section>
  );
}
