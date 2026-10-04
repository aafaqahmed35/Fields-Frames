import Link from "next/link";
import styles from "./failure.module.css";

export default function NotFound() {
  return (
    <section className={`editorial-container ${styles.surface}`}>
      <p className="editorial-label">Mind &amp; Margin / 404</p>
      <h1>This page isn’t available</h1>
      <p>The story may have moved or is no longer published.</p>
      <Link href="/">Return to the front page</Link>
    </section>
  );
}
