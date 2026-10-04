import { isValidArticleSlug } from "../content/editorial-routing";

/** Accept only publication paths; preserve Presentation query/hash state. */
export function isSafePreviewPath(value: string): boolean {
  if (
    value.length > 2048 ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\x00-\x20]/.test(value)
  )
    return false;
  const url = new URL(value, "http://localhost");
  if (url.origin !== "http://localhost") return false;
  if (["/", "/football", "/cinema", "/essays"].includes(url.pathname))
    return true;
  const match = /^\/(football|cinema|essays)\/([^/]+)$/.exec(url.pathname);
  return Boolean(match && isValidArticleSlug(match[2]));
}
