import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frames — Film",
  description: "Frames is the film editorial world of Field&Frames.",
};

export default function FilmsPage() {
  return (
    <div className="page-container films-page">
      <header className="films-lead">
        <div className="films-title-block">
          <p className="section-label">Film</p>
          <h1>FRAMES</h1>
        </div>
        <p className="section-deck">
          Cinema considered one image, one performance, and one lasting idea at a
          time.
        </p>
      </header>

      <section className="films-foundation" aria-labelledby="frames-foundation-title">
        <p className="frame-number" aria-hidden="true">
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
