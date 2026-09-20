import Link from "next/link";

import { PublicationMark } from "@/components/publication-mark";

import styles from "./publication-shell.module.css";

const navigation = [
  { href: "/football", label: "Field" },
  { href: "/cinema", label: "Cinema" },
  { href: "/essays", label: "Essays" },
];

export function PublicationFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`editorial-container-wide ${styles.footerInner}`}>
        <Link
          className={styles.footerMarkLink}
          href="/"
          aria-label="Mind and Margin, home"
        >
          <PublicationMark className={styles.footerMark} />
        </Link>

        <div className={styles.footerDetails}>
          <p className={styles.descriptor}>
            Football, cinema, and essays on life, culture, and ideas.
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
