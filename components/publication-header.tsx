import Link from "next/link";

import { PublicationMark } from "@/components/publication-mark";

import styles from "./publication-shell.module.css";

const navigation = [
  { href: "/football", label: "Football" },
  { href: "/films", label: "Films" },
  { href: "/journal", label: "Journal" },
];

export function PublicationHeader() {
  return (
    <header className={styles.header}>
      <div className={`editorial-container-wide ${styles.headerInner}`}>
        <Link className={styles.identity} href="/" aria-label="Field and Frames, home">
          <PublicationMark className={styles.headerMark} />
        </Link>

        <nav className={styles.navigation} aria-label="Primary navigation">
          <ul className={styles.navigationList}>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link className={styles.navigationLink} href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
