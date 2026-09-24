import type { Metadata } from "next";
import Image from "next/image";

import { StoryLink } from "@/components/story-link";
import { resolveCuratedStories } from "@/content/source";

import { fieldStories, type FieldStory } from "./field-stories";
import styles from "./football.module.css";

export const metadata: Metadata = {
  title: "FIELD — Football",
  description:
    "FIELD is Mind & Margin's football world: matches, tactics, places, memory, and the life around the game.",
};

function StoryMeta({ story, inverse = false }: { story: FieldStory; inverse?: boolean }) {
  return (
    <p className={`${styles.meta} ${inverse ? styles.metaInverse : ""}`}>
      <span>{story.author}</span>
      <span aria-hidden="true">/</span>
      <time dateTime={story.date}>{story.dateLabel}</time>
    </p>
  );
}

export default async function FootballPage() {
  const [
    leadStory,
    secondBallStory,
    fullBackStory,
    pressStory,
    groundStory,
    walkStory,
    songsStory,
    keeperStory,
    standStory,
    fiveASideStory,
    trainStory,
    schoolyardStory,
  ] = await resolveCuratedStories<FieldStory>("FIELD", fieldStories);
  const analysisStories = [secondBallStory, fullBackStory, pressStory];
  const cultureStories = [walkStory, songsStory];
  const notebookStories = [
    keeperStory,
    standStory,
    fiveASideStory,
    trainStory,
    schoolyardStory,
  ];

  return (
    <div className={styles.fieldPage}>
      <header className={`editorial-container-wide ${styles.opening}`}>
        <div className={styles.openingLine}>
          <p>Mind &amp; Margin / Football</p>
          <p>Space · Movement · Memory</p>
        </div>
        <div className={styles.openingIdentity}>
          <h1>FIELD</h1>
          <p>
            Football, observed carefully—from the shape of a match to the life
            gathered around it.
          </p>
        </div>
      </header>

      <article className={`editorial-container-wide ${styles.lead}`}>
        <div className={styles.leadHeader}>
          <p className={styles.storyLabel}>{leadStory.category} / Lead story</p>
          <p className={styles.editionMark}>FIELD 001</p>
        </div>

        <div className={styles.leadCopy}>
          <h2>
            <StoryLink section="FIELD" slug={leadStory.slug}>
              {leadStory.title}
            </StoryLink>
          </h2>
          <div className={styles.leadDetails}>
            <p className={styles.leadDek}>{leadStory.dek}</p>
            <StoryMeta story={leadStory} />
          </div>
        </div>

        {leadStory.image ? (
          <figure className={styles.leadFigure}>
            <div className={styles.leadImageFrame}>
              <Image
                className={styles.leadImage}
                src={leadStory.image.src}
                alt={leadStory.image.alt}
                width={leadStory.image.width}
                height={leadStory.image.height}
                sizes="(max-width: 768px) 100vw, (max-width: 1440px) 94vw, 1504px"
                style={{ objectPosition: leadStory.image.focalPoint }}
                priority
              />
            </div>
            <figcaption>
              <span>After rain, before the crowd.</span>
              <span>{leadStory.image.credit}</span>
            </figcaption>
          </figure>
        ) : null}
      </article>

      <section className={styles.analysis} aria-labelledby="analysis-title">
        <div className={`editorial-container ${styles.analysisInner}`}>
          <div className={styles.analysisHeading}>
            <p className={styles.analysisKicker}>Reading the shape</p>
            <h2 id="analysis-title">Tactics, without the noise.</h2>
            <p>
              How space opens, pressure travels, and a match changes before the
              scoreboard notices.
            </p>
          </div>

          <div className={styles.analysisList}>
            {analysisStories.map((story, index) => (
              <article className={styles.analysisStory} key={story.slug}>
                <div className={styles.analysisIndex} aria-hidden="true">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <span>{index === 0 ? "Build" : index === 1 ? "Width" : "Press"}</span>
                </div>
                <div className={styles.analysisCopy}>
                  <p className={styles.storyLabel}>{story.category}</p>
                  <h3>
                    <StoryLink section="FIELD" slug={story.slug}>
                      {story.title}
                    </StoryLink>
                  </h3>
                  <p className={styles.analysisDek}>{story.dek}</p>
                  <StoryMeta story={story} inverse />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className={`editorial-container-wide ${styles.culture}`}
        aria-labelledby="culture-title"
      >
        <div className={styles.cultureIntroduction}>
          <p className={styles.sectionIndex}>02 / Grounds &amp; belonging</p>
          <h2 id="culture-title">The game has a geography.</h2>
          <p>
            Streets, stands, voices, and the long memory of places where people
            return to stand beside one another.
          </p>
        </div>

        <article className={styles.groundFeature}>
          <p className={styles.storyLabel}>{groundStory.category}</p>
          <h3>
            <StoryLink section="FIELD" slug={groundStory.slug}>
              {groundStory.title}
            </StoryLink>
          </h3>
          <p className={styles.groundDek}>{groundStory.dek}</p>
          <StoryMeta story={groundStory} />
        </article>

        <div className={styles.culturePair}>
          {cultureStories.map((story, index) => (
            <article className={styles.cultureStory} key={story.slug}>
              <span className={styles.cultureNumber} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className={styles.storyLabel}>{story.category}</p>
                <h3>
                  <StoryLink section="FIELD" slug={story.slug}>
                    {story.title}
                  </StoryLink>
                </h3>
                <p>{story.dek}</p>
                <StoryMeta story={story} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        className={`editorial-container ${styles.notebook}`}
        aria-labelledby="notebook-title"
      >
        <div className={styles.notebookHeader}>
          <div>
            <p className={styles.sectionIndex}>03 / Field notebook</p>
            <h2 id="notebook-title">Elsewhere in the game</h2>
          </div>
          <p>Players · places · history · moments</p>
        </div>

        <div className={styles.notebookList}>
          {notebookStories.map((story, index) => (
            <article className={styles.notebookStory} key={story.slug}>
              <span className={styles.notebookIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className={styles.notebookCategory}>{story.category}</p>
              <div className={styles.notebookCopy}>
                <h3>
                  <StoryLink section="FIELD" slug={story.slug}>
                    {story.title}
                  </StoryLink>
                </h3>
                <p>{story.dek}</p>
              </div>
              <StoryMeta story={story} />
            </article>
          ))}
        </div>
      </section>

      <footer className={`editorial-container-wide ${styles.fieldEnding}`}>
        <p className={styles.storyLabel}>End line / FIELD 001</p>
        <p className={styles.endingStatement}>
          The game continues <em>away from the ball.</em>
        </p>
        <div className={styles.endingDetails}>
          <p>Football / Mind &amp; Margin</p>
          <p>12 stories in this edition</p>
        </div>
      </footer>
    </div>
  );
}
