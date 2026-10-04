import { unstable_rethrow } from "next/navigation";
import { isSafePreviewPath } from "@/lib/preview";
import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { getSanityClient } from "@/sanity/lib/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (
    request.url.length > 8192 ||
    !isSafePreviewPath(url.searchParams.get("sanity-preview-pathname") ?? "/")
  ) {
    return Response.json({ error: "Invalid preview path." }, { status: 400 });
  }
  const secret = url.searchParams.get("sanity-preview-secret");
  if (!secret || secret.length > 256) {
    return Response.json({ error: "Invalid preview secret." }, { status: 401 });
  }
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

  try {
    return await handler.GET(request);
  } catch (error) {
    unstable_rethrow(error);
    console.error("[preview.enable] validation unavailable");
    return Response.json(
      { error: "Preview is temporarily unavailable." },
      { status: 502 },
    );
  }
}
