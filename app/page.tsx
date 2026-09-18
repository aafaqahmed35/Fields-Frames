import Link from "next/link";

import { PublicationMark } from "@/components/publication-mark";

import styles from "./home.module.css";

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
    <div className={`page-container ${styles.homePage}`}>
      <section className={styles.introduction} aria-labelledby="publication-title">
        <p className="editorial-label">Independent editorial publication</p>
        <h1 className={styles.title} id="publication-title">
          <PublicationMark className={styles.homeMark} />
        </h1>
        <p className={`editorial-deck ${styles.tagline}`}>
          Football. Film. <span>Everything worth writing about.</span>
        </p>
      </section>

      <section aria-labelledby="section-directory-title">
        <h2 className="sr-only" id="section-directory-title">
          Explore the publication
        </h2>
        <ol className={styles.directoryList}>
          {sections.map((section) => (
            <li className={styles.directoryItem} key={section.href}>
              <Link className={styles.sectionEntry} href={section.href}>
                <span className={styles.entryIndex} aria-hidden="true">
                  {section.index}
                </span>
                <span className={styles.entryIdentity}>
                  <strong className={styles.entryName}>{section.name}</strong>
                  <span className={styles.entrySubject}>{section.subject}</span>
                </span>
                <span className={styles.entryDescription}>{section.description}</span>
                <span className={styles.entryArrow} aria-hidden="true">
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
