/** Canonical public domain for the site. Used for metadataBase, canonical
 * URLs, Open Graph tags, robots.txt and sitemap.xml. Override with
 * NEXT_PUBLIC_SITE_URL only when serving the same build from another origin
 * (staging, preview). No trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://ojaskaraabuilders.com").replace(/\/+$/, "");

export const SITE_NAME = "Ojaskaraa Builders";

export const SITE_DESCRIPTION =
  "Ojaskaraa Builders — premium residential and commercial construction, architecture, and design in Bharatpur & Kathmandu, Nepal.";

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
