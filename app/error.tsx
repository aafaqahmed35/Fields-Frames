"use client";

import Link from "next/link";
import styles from "./failure.module.css";

export default function ErrorPage({ retry }: { retry: () => void }) {
  return (
    <section className={`editorial-container ${styles.surface}`}>
      <p className="editorial-label">Mind &amp; Margin</p>
      <h1>Reading is temporarily unavailable</h1>
      <p>We couldn’t load this page. Please try again in a moment.</p>
      <div className={styles.actions}>
        <button onClick={retry}>Try again</button>
        <Link href="/">Return to the front page</Link>
      </div>
    </section>
  );
}
