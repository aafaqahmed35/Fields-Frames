import { createClient } from "next-sanity";

import {
  requirePublicSanityConfig,
  sanityApiVersion,
} from "../env";

let configuredClient: ReturnType<typeof createClient> | undefined;

export function getSanityClient() {
  if (!configuredClient) {
    const { projectId, dataset } = requirePublicSanityConfig();

    configuredClient = createClient({
      projectId,
      dataset,
      apiVersion: sanityApiVersion,
      perspective: "published",
      token: process.env.SANITY_API_READ_TOKEN,
      useCdn: true,
    });
  }

  return configuredClient;
}
