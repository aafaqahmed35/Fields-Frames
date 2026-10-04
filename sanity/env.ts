import { resolveHttpOrigin } from "../lib/site-origin";

export const sanityApiVersion = "2026-02-01";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
const configuredSiteOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim();

function resolveSiteOrigin(value: string | undefined) {
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SITE_ORIGIN is required for production Presentation.");
  }
  return resolveHttpOrigin(value || "http://localhost:3000");
}

if (projectId && !/^[a-z0-9]+$/.test(projectId)) {
  throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is invalid.");
}
if (dataset && !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(dataset)) {
  throw new Error("NEXT_PUBLIC_SANITY_DATASET is invalid.");
}

export const publicSanityConfig =
  projectId && dataset ? { projectId, dataset } : null;

// Schema extraction and the unconfigured Studio shell need syntactically valid
// values. These sentinels are never used for frontend data requests.
export const studioProjectId = projectId ?? "unconfigured";
export const studioDataset = dataset ?? "production";
export const siteOrigin = resolveSiteOrigin(configuredSiteOrigin);
export const studioUrl = `${siteOrigin}/studio`;

export function requirePublicSanityConfig() {
  if (!publicSanityConfig) {
    throw new Error(
      "Sanity content was selected but NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET are not both configured.",
    );
  }

  return publicSanityConfig;
}
