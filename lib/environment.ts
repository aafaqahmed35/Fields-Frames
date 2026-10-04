import { resolveHttpOrigin, resolvePublicOrigin } from "./site-origin";

export function resolveContentSourceMode(
  env: Partial<NodeJS.ProcessEnv> = process.env,
): "local" | "sanity" {
  const source = env.MIND_MARGIN_CONTENT_SOURCE;
  if (source === "local" || source === "sanity") return source;
  if (source || env.NODE_ENV === "production") {
    throw new Error(
      'MIND_MARGIN_CONTENT_SOURCE must explicitly be "local" or "sanity" in production.',
    );
  }
  return "local";
}

/** Build/runtime gate. Never imported by Studio or any client component. */
export function validateProductionEnvironment(
  env: Partial<NodeJS.ProcessEnv> = process.env,
) {
  const source = resolveContentSourceMode(env);
  const origin = resolvePublicOrigin(env);
  if (!env.NEXT_PUBLIC_SITE_ORIGIN?.trim()) {
    throw new Error(
      "NEXT_PUBLIC_SITE_ORIGIN is required for production Presentation.",
    );
  }
  const presentation = resolveHttpOrigin(env.NEXT_PUBLIC_SITE_ORIGIN.trim());
  const isLocal = (value: string) =>
    ["localhost", "127.0.0.1", "[::1]"].includes(new URL(value).hostname);
  if (!isLocal(origin)) {
    if (source !== "sanity")
      throw new Error("Deployed publication must use Sanity content.");
    if (
      !origin.startsWith("https:") ||
      !presentation.startsWith("https:") ||
      isLocal(presentation)
    ) {
      throw new Error(
        "Deployed canonical and Presentation origins must use HTTPS, without localhost.",
      );
    }
  }
  if (source === "sanity") {
    if (
      !/^[a-z0-9]+$/.test(env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? "") ||
      !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(
        env.NEXT_PUBLIC_SANITY_DATASET?.trim() ?? "",
      )
    ) {
      throw new Error(
        "Sanity production requires valid public project and dataset identifiers.",
      );
    }
    if (!env.SANITY_API_READ_TOKEN?.trim())
      throw new Error(
        "SANITY_API_READ_TOKEN Viewer credential is required for production preview.",
      );
    if ((env.SANITY_REVALIDATE_SECRET?.trim().length ?? 0) < 32)
      throw new Error(
        "SANITY_REVALIDATE_SECRET must contain at least 32 characters.",
      );
  }
  return { source, origin, presentation };
}
