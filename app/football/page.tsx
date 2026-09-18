import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Field — Football",
  description: "Field is the football editorial world of Field&Frames.",
};

export default function FootballPage() {
  return (
    <div className="page-container football-page">
      <header className="football-lead">
        <p className="section-label">Football</p>
        <h1>FIELD</h1>
        <p className="section-deck">
          Writing about the game as it is played, watched, remembered, and lived.
        </p>
      </header>

      <div className="football-foundation" aria-label="Field editorial foundation">
        <p className="edition-marker">Field notes / Foundation edition</p>
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
