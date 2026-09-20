import Image from "next/image";

import type { HomepageStory, StorySection } from "./stories";
import styles from "./story-elements.module.css";

type StoryLabelProps = Pick<HomepageStory, "section" | "label"> & {
  inverse?: boolean;
};

export function StoryLabel({ section, label, inverse = false }: StoryLabelProps) {
  return (
    <p
      className={`${styles.label}${inverse ? ` ${styles.labelInverse}` : ""}`}
      data-section={section.toLowerCase()}
    >
      <span>{section}</span>
      <span aria-hidden="true">/</span>
      {label}
    </p>
  );
}

type StoryMetaProps = Pick<HomepageStory, "author" | "date" | "dateLabel"> & {
  inverse?: boolean;
};

export function StoryMeta({
  author,
  date,
  dateLabel,
  inverse = false,
}: StoryMetaProps) {
  return (
    <p className={`${styles.meta}${inverse ? ` ${styles.metaInverse}` : ""}`}>
      <span>By {author}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={date}>{dateLabel}</time>
    </p>
  );
}

type StoryVisualProps = {
  story: HomepageStory;
  className?: string;
  imageClassName?: string;
  sizes: string;
  priority?: boolean;
  captionTone?: "light" | "dark";
};

export function StoryVisual({
  story,
  className,
  imageClassName,
  sizes,
  priority = false,
  captionTone = "light",
}: StoryVisualProps) {
  if (!story.image) {
    return null;
  }

  return (
    <figure className={`${styles.figure}${className ? ` ${className}` : ""}`}>
      <div className={`${styles.imageFrame}${imageClassName ? ` ${imageClassName}` : ""}`}>
        <Image
          alt={story.image.alt}
          fill
          priority={priority}
          sizes={sizes}
          src={story.image.src}
          style={{ objectPosition: story.image.focalPoint }}
        />
      </div>
      <figcaption
        className={`${styles.caption}${
          captionTone === "dark" ? ` ${styles.captionDark}` : ""
        }`}
      >
        {story.image.credit}
      </figcaption>
    </figure>
  );
}

export const sectionDescriptions: Record<StorySection, string> = {
  FIELD: "Football",
  CINEMA: "Film and filmmaking",
  ESSAYS: "Life, culture, ideas & other writing",
};
