import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const usesPartitionedCookies = cookieStore.has("sanity-preview-partitioned");

  (await draftMode()).disable();

  for (const name of ["sanity-preview-perspective", "sanity-preview-variant"]) {
    cookieStore.delete(name);
  }

  if (usesPartitionedCookies) {
    for (const name of [
      "__prerender_bypass",
      "sanity-preview-perspective",
      "sanity-preview-variant",
      "sanity-preview-partitioned",
    ]) {
      cookieStore.set({
        name,
        value: "",
        expires: new Date(0),
        httpOnly: true,
        partitioned: true,
        path: "/",
        sameSite: "none",
        secure: true,
      });
    }
  }

  return NextResponse.redirect(new URL("/", request.url), 303);
}
