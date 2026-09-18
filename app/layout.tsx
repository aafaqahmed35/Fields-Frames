import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PublicationFooter } from "@/components/publication-footer";
import { PublicationHeader } from "@/components/publication-header";

import "./globals.css";

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
    <html lang="en">
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
