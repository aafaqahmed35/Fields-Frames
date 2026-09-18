import type { Metadata } from "next";

import styles from "./journal.module.css";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Journal is the home for essays, culture, ideas, and other long-form writing from Field&Frames.",
};

export default function JournalPage() {
  return (
    <article className={`page-container ${styles.page}`}>
      <header className={styles.lead}>
        <p className="editorial-label">Essays, culture, ideas &amp; other writing</p>
        <h1 className={styles.title}>JOURNAL</h1>
        <p className={`editorial-deck ${styles.standfirst}`}>
          A slower space for following a thought beyond the obvious conclusion.
        </p>
      </header>

      <section className={styles.foundation} aria-labelledby="journal-foundation-title">
        <p className="editorial-label">Foundation / No. 01</p>
        <div>
          <h2 id="journal-foundation-title">Room for the subjects in between.</h2>
          <p>
            This is where long-form essays and cultural writing will live—work that
            does not belong to a scoreline or a screen, but belongs in the
            publication.
          </p>
        </div>
      </section>
    </article>
  );
}
