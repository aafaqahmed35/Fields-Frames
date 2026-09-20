import type { Metadata } from "next";

import styles from "./essays.module.css";

export const metadata: Metadata = {
  title: "Essays",
  description:
    "ESSAYS is the home for writing about life, people, culture, technology, and ideas at Mind & Margin.",
};

export default function EssaysPage() {
  return (
    <article className={`page-container ${styles.page}`}>
      <header className={styles.lead}>
        <p className="editorial-label">Life, culture, ideas &amp; other writing</p>
        <h1 className={styles.title}>ESSAYS</h1>
        <p className={`editorial-deck ${styles.standfirst}`}>
          A slower space for following a thought beyond the obvious conclusion.
        </p>
      </header>

      <section className={styles.foundation} aria-labelledby="essays-foundation-title">
        <p className="editorial-label">Foundation / No. 01</p>
        <div>
          <h2 id="essays-foundation-title">Room for the subjects in between.</h2>
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
