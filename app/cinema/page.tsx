import type { Metadata } from "next";
import Image from "next/image";

import { StoryLink } from "@/components/story-link";

import { cinemaStories, type CinemaStory } from "./cinema-stories";
import styles from "./cinema.module.css";

export const metadata: Metadata = {
  title: "CINEMA — Film and Filmmaking",
  description:
    "CINEMA is Mind & Margin's world for film criticism, filmmaking, performance, moviegoing, and the images that stay with us.",
};

function StoryMeta({ story, inverse = false }: { story: CinemaStory; inverse?: boolean }) {
  return (
    <p className={`${styles.meta} ${inverse ? styles.metaInverse : ""}`}>
      <span>{story.author}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={story.date}>{story.dateLabel}</time>
    </p>
  );
}

const [
  leadStory,
  editingStory,
  closeUpStory,
  soundStory,
  performanceStory,
  designStory,
  screenwritingStory,
  lastRowStory,
  neighbourhoodStory,
  projectionStory,
  creditsStory,
  afterimageStory,
] = cinemaStories;

const craftNotes = [closeUpStory, soundStory];
const performanceNotes = [designStory, screenwritingStory];
const audienceNotes = [neighbourhoodStory, projectionStory, creditsStory];

export default function CinemaPage() {
  return (
    <div className={styles.cinemaPage}>
      <section className={styles.opening} aria-labelledby="cinema-title">
        <div className={`editorial-container-wide ${styles.openingInner}`}>
          <div className={styles.openingHeader}>
            <p>Mind &amp; Margin / Cinema</p>
            <p>Criticism · Craft · Moviegoing</p>
          </div>

          {leadStory.image ? (
            <figure className={styles.openingFigure}>
              <Image
                className={styles.openingImage}
                src={leadStory.image.src}
                alt={leadStory.image.alt}
                width={leadStory.image.width}
                height={leadStory.image.height}
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 94vw, 1504px"
                style={{ objectPosition: leadStory.image.focalPoint }}
                priority
              />
              <h1 id="cinema-title">CINEMA</h1>
              <figcaption>{leadStory.image.credit}</figcaption>
            </figure>
          ) : null}

          <article className={styles.leadStory}>
            <div className={styles.leadMarker}>
              <p>{leadStory.category}</p>
              <p>Opening feature</p>
            </div>
            <h2>
              <StoryLink section="CINEMA" slug={leadStory.slug}>
                {leadStory.title}
              </StoryLink>
            </h2>
            <div className={styles.leadDetails}>
              <p>{leadStory.dek}</p>
              <StoryMeta story={leadStory} inverse />
            </div>
          </article>
        </div>
      </section>

      <section
        className={`editorial-container-wide ${styles.craft}`}
        aria-labelledby="craft-title"
      >
        <header className={styles.craftHeader}>
          <p className={styles.sectionLabel}>Craft / Form</p>
          <h2 id="craft-title">The work inside the image.</h2>
          <p>
            Looking closely at the decisions that make a scene breathe, turn, and
            hold.
          </p>
        </header>

        <article className={styles.editingFeature}>
          {editingStory.image ? (
            <figure className={styles.editingFigure}>
              <Image
                className={styles.editingImage}
                src={editingStory.image.src}
                alt={editingStory.image.alt}
                width={editingStory.image.width}
                height={editingStory.image.height}
                sizes="(max-width: 700px) 100vw, (max-width: 1200px) 61vw, 820px"
                style={{ objectPosition: editingStory.image.focalPoint }}
              />
              <figcaption>{editingStory.image.credit}</figcaption>
            </figure>
          ) : null}
          <div className={styles.editingCopy}>
            <p className={styles.storyLabel}>{editingStory.category}</p>
            <h3>
              <StoryLink section="CINEMA" slug={editingStory.slug}>
                {editingStory.title}
              </StoryLink>
            </h3>
            <p className={styles.storyDek}>{editingStory.dek}</p>
            <StoryMeta story={editingStory} />
          </div>
        </article>

        <div className={styles.craftNotes}>
          {craftNotes.map((story, index) => (
            <article className={styles.craftNote} key={story.slug}>
              <p className={styles.noteCue}>{index === 0 ? "Look" : "Listen"}</p>
              <div>
                <p className={styles.storyLabel}>{story.category}</p>
                <h3>
                  <StoryLink section="CINEMA" slug={story.slug}>
                    {story.title}
                  </StoryLink>
                </h3>
                <p className={styles.storyDek}>{story.dek}</p>
                <StoryMeta story={story} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.performance} aria-labelledby="performance-title">
        <div className={`editorial-container-wide ${styles.performanceInner}`}>
          <header className={styles.performanceHeader}>
            <p className={styles.sectionLabel}>Performance / Presence</p>
            <p>What the body knows before the scene explains.</p>
          </header>

          <article className={styles.performanceFeature}>
            {performanceStory.image ? (
              <figure className={styles.performanceFigure}>
                <Image
                  className={styles.performanceImage}
                  src={performanceStory.image.src}
                  alt={performanceStory.image.alt}
                  width={performanceStory.image.width}
                  height={performanceStory.image.height}
                  sizes="(max-width: 700px) 100vw, (max-width: 1200px) 54vw, 720px"
                  style={{ objectPosition: performanceStory.image.focalPoint }}
                />
                <figcaption>{performanceStory.image.credit}</figcaption>
              </figure>
            ) : null}
            <div className={styles.performanceCopy}>
              <p className={styles.storyLabel}>{performanceStory.category}</p>
              <h2 id="performance-title">
                <StoryLink section="CINEMA" slug={performanceStory.slug}>
                  {performanceStory.title}
                </StoryLink>
              </h2>
              <p className={styles.performanceDek}>{performanceStory.dek}</p>
              <StoryMeta story={performanceStory} />
            </div>
          </article>

          <div className={styles.performanceNotes}>
            {performanceNotes.map((story) => (
              <article key={story.slug}>
                <p className={styles.storyLabel}>{story.category}</p>
                <h3>
                  <StoryLink section="CINEMA" slug={story.slug}>
                    {story.title}
                  </StoryLink>
                </h3>
                <p className={styles.storyDek}>{story.dek}</p>
                <StoryMeta story={story} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`editorial-container ${styles.audience}`}
        aria-labelledby="audience-title"
      >
        <header className={styles.audienceHeader}>
          <p className={styles.sectionLabel}>The audience</p>
          <p>Rooms, rituals, strangers, memory.</p>
        </header>

        <article className={styles.audienceFeature}>
          <p className={styles.audienceCategory}>{lastRowStory.category}</p>
          <h2 id="audience-title">
            <StoryLink section="CINEMA" slug={lastRowStory.slug}>
              {lastRowStory.title}
            </StoryLink>
          </h2>
          <p>{lastRowStory.dek}</p>
          <StoryMeta story={lastRowStory} />
        </article>

        <div className={styles.audienceNotes}>
          {audienceNotes.map((story) => (
            <article className={styles.audienceNote} key={story.slug}>
              <p className={styles.storyLabel}>{story.category}</p>
              <h3>
                <StoryLink section="CINEMA" slug={story.slug}>
                  {story.title}
                </StoryLink>
              </h3>
              <p className={styles.storyDek}>{story.dek}</p>
              <StoryMeta story={story} />
            </article>
          ))}
        </div>
      </section>

      <section className={styles.afterimage} aria-labelledby="afterimage-title">
        <article className={`editorial-container ${styles.afterimageStory}`}>
          <p className={styles.afterimageLabel}>Afterimage</p>
          <h2 id="afterimage-title">
            <StoryLink section="CINEMA" slug={afterimageStory.slug}>
              {afterimageStory.title}
            </StoryLink>
          </h2>
          <p className={styles.afterimageDek}>{afterimageStory.dek}</p>
          <StoryMeta story={afterimageStory} />
        </article>
        <div className={styles.closingPause}>
          <span aria-hidden="true" />
          <p>The screen goes dark. The seeing continues.</p>
        </div>
      </section>
    </div>
  );
}
