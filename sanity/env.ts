export const sanityApiVersion = "2026-02-01";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();

export const publicSanityConfig =
  projectId && dataset ? { projectId, dataset } : null;

// Schema extraction and the unconfigured Studio shell need syntactically valid
// values. These sentinels are never used for frontend data requests.
export const studioProjectId = projectId ?? "unconfigured";
export const studioDataset = dataset ?? "production";

export function requirePublicSanityConfig() {
  if (!publicSanityConfig) {
    throw new Error(
      "Sanity content was selected but NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are not both configured.",
    );
  }

  return publicSanityConfig;
}
