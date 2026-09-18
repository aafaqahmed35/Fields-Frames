import type { Metadata } from "next";

import styles from "./films.module.css";

export const metadata: Metadata = {
  title: "Frames — Film",
  description: "Frames is the film editorial world of Field&Frames.",
};

export default function FilmsPage() {
  return (
    <div className="page-container">
      <header className={styles.lead}>
        <div>
          <p className="editorial-label">Film</p>
          <h1 className={styles.title}>FRAMES</h1>
        </div>
        <p className={`editorial-deck ${styles.deck}`}>
          Cinema considered one image, one performance, and one lasting idea at a
          time.
        </p>
      </header>

      <section className={styles.foundation} aria-labelledby="frames-foundation-title">
        <p className={`editorial-label ${styles.frameNumber}`} aria-hidden="true">
          01 / 24
        </p>
        <div>
          <h2 id="frames-foundation-title">A space for looking closely.</h2>
          <p>
            Essays, criticism, conversations, and observations on the art and craft
            of moving images will take shape here.
          </p>
        </div>
      </section>
    </div>
  );
}
