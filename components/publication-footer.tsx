import Link from "next/link";

import { PublicationMark } from "@/components/publication-mark";

import styles from "./publication-shell.module.css";

const navigation = [
  { href: "/football", label: "Football" },
  { href: "/films", label: "Films" },
  { href: "/journal", label: "Journal" },
];

export function PublicationFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`editorial-container-wide ${styles.footerInner}`}>
        <Link
          className={styles.footerMarkLink}
          href="/"
          aria-label="Field and Frames, home"
        >
          <PublicationMark className={styles.footerMark} />
        </Link>

        <div className={styles.footerDetails}>
          <p className={styles.descriptor}>
            Football. Film. Everything worth writing about.
          </p>

          <nav className={styles.footerNavigation} aria-label="Footer navigation">
            <ul className={styles.footerNavigationList}>
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link className={styles.footerNavigationLink} href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className={styles.identityNote}>An independent digital publication.</p>
        </div>
      </div>
    </footer>
  );
}
