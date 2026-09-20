import type { Metadata } from "next";

import styles from "./cinema.module.css";

export const metadata: Metadata = {
  title: "Cinema",
  description: "CINEMA is the film and filmmaking editorial world of Mind & Margin.",
};

export default function CinemaPage() {
  return (
    <div className="page-container">
      <header className={styles.lead}>
        <div>
          <p className="editorial-label">Film</p>
          <h1 className={styles.title}>CINEMA</h1>
        </div>
        <p className={`editorial-deck ${styles.deck}`}>
          Cinema considered one image, one performance, and one lasting idea at a
          time.
        </p>
      </header>

      <section className={styles.foundation} aria-labelledby="cinema-foundation-title">
        <p className={`editorial-label ${styles.frameNumber}`} aria-hidden="true">
          01 / 24
        </p>
        <div>
          <h2 id="cinema-foundation-title">A space for looking closely.</h2>
          <p>
            Essays, criticism, conversations, and observations on the art and craft
            of moving images will take shape here.
          </p>
        </div>
      </section>
    </div>
  );
}
