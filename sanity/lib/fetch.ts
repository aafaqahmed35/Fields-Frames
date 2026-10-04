import "server-only";
import { unstable_rethrow } from "next/navigation";

import { cookies, draftMode } from "next/headers";
import type { QueryParams } from "next-sanity";
import { resolvePerspectiveFromCookies } from "next-sanity/live";

import { studioUrl } from "../env";
import { getSanityClient } from "./client";

type SanityFetchOptions = {
  query: string;
  params?: QueryParams;
  tags?: readonly string[];
  preview?: boolean;
  stega?: boolean;
};

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  preview,
  stega,
}: SanityFetchOptions): Promise<T> {
  const isPreview = preview ?? (await draftMode()).isEnabled;
  const token = process.env.SANITY_API_READ_TOKEN?.trim();

  if (isPreview && !token) {
    throw new Error(
      "Draft preview requires the server-only SANITY_API_READ_TOKEN Viewer credential.",
    );
  }

  const perspective = isPreview
    ? await resolvePerspectiveFromCookies({ cookies: await cookies() })
    : "published";

  try {
    return await getSanityClient()
      .withConfig({
        perspective,
        stega: (stega ?? isPreview) ? { studioUrl } : false,
        token: isPreview ? token : undefined,
        useCdn: !isPreview,
      })
      .fetch<T>(query, params, {
        next: isPreview
          ? { revalidate: 0 }
          : { revalidate: false, tags: [...tags] },
      });
  } catch (error) {
    unstable_rethrow(error);
    // Do not log client errors: URLs can contain preview secrets/query values.
    console.error("[cms.fetch] failed", {
      preview: isPreview,
      tags: [...tags],
    });
    throw new Error("Editorial content is temporarily unavailable.");
  }
}
