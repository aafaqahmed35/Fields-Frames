import styles from "./publication-mark.module.css";

type PublicationMarkProps = {
  className?: string;
};

export function PublicationMark({ className }: PublicationMarkProps) {
  const classes = className ? `${styles.mark} ${className}` : styles.mark;

  return (
    <span className={classes}>
      MIND <span className={styles.ampersand}>&amp;</span> MARGIN
    </span>
  );
}
