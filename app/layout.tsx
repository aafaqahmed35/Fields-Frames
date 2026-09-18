import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";

import { PublicationFooter } from "@/components/publication-footer";
import { PublicationHeader } from "@/components/publication-header";

import "./globals.css";
import "./styles/typography.css";
import "./styles/layout.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Field&Frames",
    template: "%s | Field&Frames",
  },
  description:
    "An independent publication about football, film, culture, ideas, and everything worth writing about.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${sourceSans.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <div className="site-frame">
          <PublicationHeader />
          <main id="main-content">{children}</main>
          <PublicationFooter />
        </div>
      </body>
    </html>
  );
}
