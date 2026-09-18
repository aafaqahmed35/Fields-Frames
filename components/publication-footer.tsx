import Link from "next/link";

export function PublicationFooter() {
  return (
    <footer className="publication-footer">
      <div className="publication-footer__inner">
        <div>
          <Link className="footer-masthead" href="/">
            Field&amp;Frames
          </Link>
          <p>Football. Film. Everything worth writing about.</p>
        </div>
        <p className="footer-note">An independent digital publication.</p>
      </div>
    </footer>
  );
}
