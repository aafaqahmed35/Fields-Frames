import Head from "next/head";

// Cold SSG/metadata failures can occur before the App Router boundary renders.
// Keep this static fallback independent of CMS, layout and font fetches.
/* eslint-disable @next/next/no-html-link-for-pages */
export default function ServerError() {
  return (
    <>
      <Head>
        <title>Temporarily unavailable | Mind &amp; Margin</title>
        <meta name="robots" content="noindex, nofollow" />
        <style>{`body { margin: 0; background: #f3f3ef; color: #171614; font-family: Georgia, serif; line-height: 1.6; } a { color: inherit; } button { font: inherit; cursor: pointer; } a:focus-visible, button:focus-visible { outline: 3px solid #932d23; outline-offset: 4px; }`}</style>
      </Head>
      <main
        style={{ maxWidth: "43rem", margin: "4rem auto", padding: "0 1.5rem" }}
      >
        <p>Mind &amp; Margin</p>
        <h1>Reading is temporarily unavailable</h1>
        <p>We couldn’t load this page. Please try again in a moment.</p>
        <form method="get">
          <button type="submit">Try again</button>
        </form>
        <p>
          <a href="/">Return to the front page</a>
        </p>
      </main>
    </>
  );
}
