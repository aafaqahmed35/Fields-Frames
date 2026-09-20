import Link from "next/link";

import { PublicationMark } from "@/components/publication-mark";

import styles from "./publication-shell.module.css";

const navigation = [
  { href: "/football", label: "Field" },
  { href: "/cinema", label: "Cinema" },
  { href: "/essays", label: "Essays" },
];

export function PublicationHeader() {
  return (
    <header className={styles.header}>
      <div className={`editorial-container-wide ${styles.headerInner}`}>
        <Link className={styles.identity} href="/" aria-label="Mind and Margin, home">
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
