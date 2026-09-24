import { metadata, viewport } from "next-sanity/studio";

import { publicSanityConfig } from "@/sanity/env";
import { MindAndMarginStudio } from "@/sanity/studio";

export const dynamic = "force-static";
export { metadata, viewport };

export default function StudioPage() {
  if (!publicSanityConfig) {
    return (
      <main style={{ fontFamily: "system-ui", margin: "4rem auto", maxWidth: "44rem", padding: "0 1.5rem" }}>
        <h1>Sanity Studio is not configured</h1>
        <p>
          Add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
          <code>NEXT_PUBLIC_SANITY_DATASET</code> to a local environment file,
          then restart the development server.
        </p>
      </main>
    );
  }

  return <MindAndMarginStudio />;
}
