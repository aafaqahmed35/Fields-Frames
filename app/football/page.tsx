import type { Metadata } from "next";

import styles from "./football.module.css";

export const metadata: Metadata = {
  title: "Field — Football",
  description: "Field is the football editorial world of Field&Frames.",
};

export default function FootballPage() {
  return (
    <div className="page-container">
      <header className={styles.lead}>
        <p className={`editorial-label ${styles.label}`}>Football</p>
        <h1 className={styles.title}>FIELD</h1>
        <p className={`editorial-deck ${styles.deck}`}>
          Writing about the game as it is played, watched, remembered, and lived.
        </p>
      </header>

      <div className={styles.foundation} aria-label="Field editorial foundation">
        <p className="editorial-label">Field notes / Foundation edition</p>
        <div>
          <h2>A place for the whole game.</h2>
          <p>
            Match writing, profiles, tactics, history, supporter culture, and the
            stories beyond the touchline will live here.
          </p>
        </div>
      </div>
    </div>
  );
}
