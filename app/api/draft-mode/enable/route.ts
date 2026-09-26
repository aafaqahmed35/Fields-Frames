import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { getSanityClient } from "@/sanity/lib/client";

export async function GET(request: Request) {
  const token = process.env.SANITY_API_READ_TOKEN?.trim();

  if (!token) {
    return Response.json(
      { error: "Draft preview is not configured." },
      { status: 503 },
    );
  }

  const handler = defineEnableDraftMode({
    client: getSanityClient().withConfig({ token, useCdn: false }),
  });

  return handler.GET(request);
}
