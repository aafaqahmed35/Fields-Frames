/** Public URL identity; independent from Presentation's local frontend origin. */
export function resolvePublicOrigin(
  env: Partial<NodeJS.ProcessEnv> = process.env,
): string {
  const value = env.SITE_ORIGIN?.trim();
  if (!value && env.NODE_ENV === "production") {
    throw new Error(
      "SITE_ORIGIN is required for production metadata. Set the real public origin (or explicitly localhost for local production-mode QA).",
    );
  }
  const configured =
    value || env.NEXT_PUBLIC_SITE_ORIGIN?.trim() || "http://localhost:3000";
  let url: URL;
  try {
    url = new URL(configured);
  } catch {
    throw new Error("Site origin must be a valid HTTP(S) origin.");
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "Site origin must be an HTTP(S) origin without credentials, path, query, or fragment.",
    );
  }
  return url.origin;
}

export function publicUrl(
  path: string,
  origin = resolvePublicOrigin(),
): string {
  if (!path.startsWith("/") || path.startsWith("//") || /[?#\\]/.test(path)) {
    throw new Error(
      "Public URL requires an absolute site path without query or fragment.",
    );
  }
  const url = new URL(path === "/" ? "/" : path.replace(/\/+$/, ""), origin);
  return url.pathname === "/" ? url.origin : url.href;
}
