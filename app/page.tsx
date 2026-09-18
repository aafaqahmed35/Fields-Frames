import Link from "next/link";

import {
  sectionDescriptions,
  StoryLabel,
  StoryMeta,
  StoryVisual,
} from "./_homepage/story-elements";
import { homepageStories } from "./_homepage/stories";
import styles from "./home.module.css";

const [
  leadStory,
  windowEssay,
  editingStory,
  secondBallStory,
  cinemaStory,
  unfinishedThought,
  groundStory,
  closeUpStory,
  notebookStory,
  fullBackStory,
] = homepageStories;

const dispatches = [groundStory, closeUpStory, notebookStory, fullBackStory];

const gateways = [
  { section: "FIELD" as const, href: "/football", index: "01" },
  { section: "FRAMES" as const, href: "/films", index: "02" },
  { section: "JOURNAL" as const, href: "/journal", index: "03" },
];

export default function Home() {
  return (
    <div className={styles.homePage}>
      <div className={`editorial-container-wide ${styles.frontMatter}`}>
        <p>Field&amp;Frames / Front page</p>
        <p>Football · Film · Ideas</p>
      </div>

      <div>
        <article className={`editorial-container-wide ${styles.lead}`}>
          <div className={styles.leadCopy}>
            <StoryLabel section={leadStory.section} label={leadStory.label} />
            <h1 className={styles.leadTitle}>{leadStory.title}</h1>
            <p className={styles.leadDek}>{leadStory.dek}</p>
            <StoryMeta {...leadStory} />
          </div>
          <StoryVisual
            story={leadStory}
            className={styles.leadVisual}
            imageClassName={styles.leadImage}
            sizes="(max-width: 900px) 100vw, 61vw"
            priority
          />
        </article>

        <section
          className={`editorial-container ${styles.supporting}`}
          aria-labelledby="supporting-title"
        >
          <div className={styles.sectionHeading}>
            <h2 id="supporting-title">In this edition</h2>
            <span aria-hidden="true">No. 01</span>
          </div>

          <div className={styles.supportingGrid}>
            <article className={styles.imageFeature}>
              <StoryVisual
                story={windowEssay}
                className={styles.windowVisual}
                imageClassName={styles.windowImage}
                sizes="(max-width: 900px) 100vw, 43vw"
              />
              <div className={styles.imageFeatureCopy}>
                <StoryLabel section={windowEssay.section} label={windowEssay.label} />
                <h3>{windowEssay.title}</h3>
                <p>{windowEssay.dek}</p>
                <StoryMeta {...windowEssay} />
              </div>
            </article>

            <div className={styles.supportingColumn}>
              <article className={styles.mediumStory}>
                <StoryLabel section={editingStory.section} label={editingStory.label} />
                <h3>{editingStory.title}</h3>
                <p>{editingStory.dek}</p>
                <StoryMeta {...editingStory} />
              </article>

              <article className={styles.compactStory}>
                <StoryLabel
                  section={secondBallStory.section}
                  label={secondBallStory.label}
                />
                <h3>{secondBallStory.title}</h3>
                <p>{secondBallStory.dek}</p>
                <StoryMeta {...secondBallStory} />
              </article>
            </div>
          </div>
        </section>

        <section className={styles.cinemaFeature} aria-labelledby="cinema-title">
          <div className="editorial-container-wide">
            <article className={styles.cinemaGrid}>
              <div className={styles.cinemaCopy}>
                <StoryLabel
                  section={cinemaStory.section}
                  label={cinemaStory.label}
                  inverse
                />
                <h2 id="cinema-title">{cinemaStory.title}</h2>
                <p>{cinemaStory.dek}</p>
                <StoryMeta {...cinemaStory} inverse />
              </div>
              <StoryVisual
                story={cinemaStory}
                className={styles.cinemaVisual}
                imageClassName={styles.cinemaImage}
                sizes="(max-width: 900px) 100vw, 60vw"
                captionTone="dark"
              />
            </article>
          </div>
        </section>

        <section
          className={`editorial-container ${styles.dispatches}`}
          aria-labelledby="dispatches-title"
        >
          <div className={styles.sectionHeading}>
            <h2 id="dispatches-title">Notes &amp; dispatches</h2>
            <span>Across the publication</span>
          </div>

          <div className={styles.dispatchesGrid}>
            <article className={styles.essayFeature}>
              <StoryLabel
                section={unfinishedThought.section}
                label={unfinishedThought.label}
              />
              <h3>{unfinishedThought.title}</h3>
              <p>{unfinishedThought.dek}</p>
              <StoryMeta {...unfinishedThought} />
            </article>

            <div className={styles.dispatchList}>
              {dispatches.map((story, index) => (
                <article className={styles.dispatch} key={story.slug}>
                  <span className={styles.dispatchIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className={styles.dispatchCopy}>
                    <StoryLabel section={story.section} label={story.label} />
                    <h3>{story.title}</h3>
                    <p>{story.dek}</p>
                    <StoryMeta {...story} />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className={`editorial-container-wide ${styles.gateways}`}
          aria-labelledby="worlds-title"
        >
          <div className={styles.gatewayIntroduction}>
            <p className="editorial-label">Three editorial worlds</p>
            <h2 id="worlds-title">Follow the subject, stay for the point of view.</h2>
          </div>

          <ol className={styles.gatewayList}>
            {gateways.map((gateway) => (
              <li key={gateway.href}>
                <Link className={styles.gateway} href={gateway.href}>
                  <span className={styles.gatewayIndex} aria-hidden="true">
                    {gateway.index}
                  </span>
                  <span className={styles.gatewayIdentity}>
                    <strong>{gateway.section}</strong>
                    <span>{sectionDescriptions[gateway.section]}</span>
                  </span>
                  <span className={styles.gatewayArrow} aria-hidden="true">
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
