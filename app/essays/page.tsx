import type { Metadata } from "next";
import Image from "next/image";

import { StoryLink } from "@/components/story-link";

import { essayStories, type EssayStory } from "./essay-stories";
import styles from "./essays.module.css";

export const metadata: Metadata = {
  title: "ESSAYS — Life, Culture, and Ideas",
  description:
    "ESSAYS is Mind & Margin's world for attentive writing about ordinary life, memory, culture, technology, places, and ideas.",
};

function StoryMeta({ story }: { story: EssayStory }) {
  return (
    <p className={styles.meta}>
      <span>By {story.author}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={story.date}>{story.dateLabel}</time>
      <span aria-hidden="true">·</span>
      <span>{story.readingMinutes} min read</span>
    </p>
  );
}

const [
  leadStory,
  rememberedRoomsStory,
  earlyStory,
  objectsStory,
  streetStory,
  friendshipStory,
  tasteStory,
  inboxStory,
  workStory,
  notebookStory,
  unfinishedStory,
  photographsStory,
  headphonesStory,
  afternoonStory,
] = essayStories;

const closeAttentionStories = [rememberedRoomsStory, earlyStory, objectsStory];
const systemsNotes = [inboxStory, workStory];
const marginStories = [
  notebookStory,
  unfinishedStory,
  photographsStory,
  headphonesStory,
];

export default function EssaysPage() {
  return (
    <div className={styles.essaysPage}>
      <header className={`editorial-container-wide ${styles.opening}`}>
        <div className={styles.openingTopline}>
          <p>Mind &amp; Margin / Essays</p>
          <p>Life · Culture · Ideas</p>
        </div>
        <div className={styles.openingStatement}>
          <h1>ESSAYS</h1>
          <p>
            Writing that begins with what is near, then follows the thought
            beyond its obvious border.
          </p>
        </div>
        <p className={styles.issueLine}>Notes on attention and ordinary life / 001</p>
      </header>

      <article className={`editorial-container ${styles.lead}`}>
        <aside className={styles.leadMargin} aria-label="Lead essay details">
          <p>Opening essay</p>
          <dl>
            <div>
              <dt>Filed under</dt>
              <dd>{leadStory.category}</dd>
            </div>
            <div>
              <dt>Form</dt>
              <dd>{leadStory.form}</dd>
            </div>
            <div>
              <dt>Reading time</dt>
              <dd>{leadStory.readingMinutes} minutes</dd>
            </div>
          </dl>
        </aside>
        <div className={styles.leadCopy}>
          <h2>
            <StoryLink section="ESSAYS" slug={leadStory.slug}>
              {leadStory.title}
            </StoryLink>
          </h2>
          <p className={styles.leadDek}>{leadStory.dek}</p>
          {leadStory.excerpt ? (
            <p className={styles.leadExcerpt}>{leadStory.excerpt}</p>
          ) : null}
          <StoryMeta story={leadStory} />
        </div>
      </article>

      <section
        className={`editorial-container-wide ${styles.attention}`}
        aria-labelledby="attention-title"
      >
        <header className={styles.movementHeader}>
          <p className={styles.movementIndex}>I / Close attention</p>
          <h2 id="attention-title">The evidence of small things</h2>
          <p>Rooms, objects, intervals—the material a day leaves in plain sight.</p>
        </header>

        <div className={styles.attentionStories}>
          {closeAttentionStories.map((story, index) => (
            <article
              className={`${styles.attentionStory} ${
                index === 0 ? styles.attentionStoryMajor : ""
              }`}
              key={story.slug}
            >
              <p className={styles.storyCue}>
                <span>{story.category}</span>
                <span>{story.form}</span>
              </p>
              <h3>
                <StoryLink section="ESSAYS" slug={story.slug}>
                  {story.title}
                </StoryLink>
              </h3>
              <p className={styles.storyDek}>{story.dek}</p>
              <StoryMeta story={story} />
            </article>
          ))}
        </div>
      </section>

      <section className={styles.streetPause} aria-labelledby="street-title">
        <div className={`editorial-container-wide ${styles.streetInner}`}>
          {streetStory.image ? (
            <figure className={styles.streetFigure}>
              <Image
                className={styles.streetImage}
                src={streetStory.image.src}
                alt={streetStory.image.alt}
                width={streetStory.image.width}
                height={streetStory.image.height}
                sizes="(max-width: 767px) 100vw, (max-width: 1200px) 48vw, 640px"
                style={{ objectPosition: streetStory.image.focalPoint }}
              />
              <figcaption>
                <span>Passing through, paying attention.</span>
                <span>{streetStory.image.credit}</span>
              </figcaption>
            </figure>
          ) : null}

          <div className={styles.streetWords}>
            <p className={styles.movementIndex}>II / Place and relation</p>
            <article className={styles.streetFeature}>
              <p className={styles.storyCue}>
                <span>{streetStory.category}</span>
                <span>{streetStory.form}</span>
              </p>
              <h2 id="street-title">
                <StoryLink section="ESSAYS" slug={streetStory.slug}>
                  {streetStory.title}
                </StoryLink>
              </h2>
              <p className={styles.streetDek}>{streetStory.dek}</p>
              <StoryMeta story={streetStory} />
            </article>

            <article className={styles.friendshipStory}>
              <p className={styles.storyCue}>
                <span>{friendshipStory.category}</span>
                <span>{friendshipStory.form}</span>
              </p>
              <h3>
                <StoryLink section="ESSAYS" slug={friendshipStory.slug}>
                  {friendshipStory.title}
                </StoryLink>
              </h3>
              <p>{friendshipStory.dek}</p>
              <StoryMeta story={friendshipStory} />
            </article>
          </div>
        </div>
      </section>

      <section
        className={`editorial-container ${styles.systems}`}
        aria-labelledby="systems-title"
      >
        <header className={styles.systemsHeader}>
          <p className={styles.movementIndex}>III / Systems, lived</p>
          <p>Technology enters ordinary life quietly, then rearranges the furniture.</p>
        </header>

        <article className={styles.systemsFeature}>
          <div className={styles.systemsFeatureHeading}>
            <p className={styles.storyCue}>
              <span>{tasteStory.category}</span>
              <span>{tasteStory.form}</span>
            </p>
            <h2 id="systems-title">
              <StoryLink section="ESSAYS" slug={tasteStory.slug}>
                {tasteStory.title}
              </StoryLink>
            </h2>
          </div>
          <div className={styles.systemsFeatureDetails}>
            <p>{tasteStory.dek}</p>
            <StoryMeta story={tasteStory} />
          </div>
        </article>

        <div className={styles.systemsNotes}>
          {systemsNotes.map((story, index) => (
            <article key={story.slug}>
              <p className={styles.noteNumber} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className={styles.storyCue}>
                <span>{story.category}</span>
                <span>{story.form}</span>
              </p>
              <h3>
                <StoryLink section="ESSAYS" slug={story.slug}>
                  {story.title}
                </StoryLink>
              </h3>
              <p className={styles.storyDek}>{story.dek}</p>
              <StoryMeta story={story} />
            </article>
          ))}
        </div>
      </section>

      <section className={styles.margin} aria-labelledby="margin-title">
        <div className={`editorial-container-wide ${styles.marginInner}`}>
          <header className={styles.marginHeader}>
            <p className={styles.movementIndex}>IV / In the margin</p>
            <h2 id="margin-title">Four notes to carry forward</h2>
            <p>Brief pieces, open questions, things seen on the way elsewhere.</p>
          </header>

          <div className={styles.marginList}>
            {marginStories.map((story, index) => (
              <article className={styles.marginStory} key={story.slug}>
                <p className={styles.marginNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className={styles.marginCategory}>{story.category}</p>
                <div className={styles.marginCopy}>
                  <h3>
                    <StoryLink section="ESSAYS" slug={story.slug}>
                      {story.title}
                    </StoryLink>
                  </h3>
                  <p>{story.dek}</p>
                </div>
                <StoryMeta story={story} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className={`editorial-container ${styles.ending}`}>
        <p className={styles.movementIndex}>V / Before leaving</p>
        <article className={styles.endingStory}>
          <p className={styles.storyCue}>
            <span>{afternoonStory.category}</span>
            <span>{afternoonStory.form}</span>
          </p>
          <h2>
            <StoryLink section="ESSAYS" slug={afternoonStory.slug}>
              {afternoonStory.title}
            </StoryLink>
          </h2>
          <div>
            <p className={styles.endingDek}>{afternoonStory.dek}</p>
            <StoryMeta story={afternoonStory} />
          </div>
        </article>
        <div className={styles.continuation}>
          <p>Fourteen pieces / ESSAYS 001</p>
          <p>The page ends. The thought need not.</p>
        </div>
      </footer>
    </div>
  );
}
