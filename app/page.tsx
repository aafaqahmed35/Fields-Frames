import Link from "next/link";

const sections = [
  {
    href: "/football",
    index: "01",
    name: "FIELD",
    subject: "Football",
    description: "The matches, people, places, and ideas that shape the game.",
  },
  {
    href: "/films",
    index: "02",
    name: "FRAMES",
    subject: "Film",
    description: "Cinema, craft, performance, and the images that stay with us.",
  },
  {
    href: "/journal",
    index: "03",
    name: "JOURNAL",
    subject: "Essays, culture, ideas & other writing",
    description: "Long-form work for subjects that deserve time and room.",
  },
];

export default function Home() {
  return (
    <div className="page-container home-page">
      <section className="home-introduction" aria-labelledby="publication-title">
        <p className="eyebrow">Independent editorial publication</p>
        <h1 id="publication-title">Field&amp;Frames</h1>
        <p className="home-tagline">
          Football. Film. <span>Everything worth writing about.</span>
        </p>
      </section>

      <section className="section-directory" aria-labelledby="section-directory-title">
        <h2 className="sr-only" id="section-directory-title">
          Explore the publication
        </h2>
        <ol>
          {sections.map((section) => (
            <li key={section.href}>
              <Link className="section-entry" href={section.href}>
                <span className="section-entry__index" aria-hidden="true">
                  {section.index}
                </span>
                <span className="section-entry__identity">
                  <strong>{section.name}</strong>
                  <span>{section.subject}</span>
                </span>
                <span className="section-entry__description">{section.description}</span>
                <span className="section-entry__arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
