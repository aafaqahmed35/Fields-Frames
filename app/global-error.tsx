"use client";

// A full document reload recovers a failed root layout.
/* eslint-disable @next/next/no-html-link-for-pages */

export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#f3f3ef",
          color: "#171614",
          fontFamily: "Georgia, serif",
        }}
      >
        <title>Temporarily unavailable | Mind &amp; Margin</title>
        <meta name="robots" content="noindex, nofollow" />
        <main
          style={{
            maxWidth: "43rem",
            margin: "4rem auto",
            padding: "0 1.5rem",
          }}
        >
          <h1>Mind &amp; Margin is temporarily unavailable</h1>
          <p>Please try again in a moment.</p>
          <button onClick={retry}>Try again</button>{" "}
          <a href="/">Return to the front page</a>
        </main>
      </body>
    </html>
  );
}
