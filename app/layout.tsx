import { resolvePublicOrigin } from "@/lib/site-origin";
import { previewRobots, publicationDescription, publicationName } from "@/lib/seo";
import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
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

const rootMetadata: Metadata = {
  metadataBase: new URL(resolvePublicOrigin()),
  title: {
    default: publicationName,
    template: "%s | Mind & Margin",
  },
  description: publicationDescription,
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...rootMetadata,
    robots: (await draftMode()).isEnabled ? previewRobots : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const isPreview = (await draftMode()).isEnabled;

  return (
    <html lang="en" className={`${newsreader.variable} ${sourceSans.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <div className="site-frame">
          <PublicationHeader />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <PublicationFooter />
        </div>
        {isPreview ? <VisualEditing /> : null}
      </body>
    </html>
  );
}
