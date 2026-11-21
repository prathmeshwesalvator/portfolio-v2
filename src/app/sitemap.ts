import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

/** Static date (Cache Components forbids reading the clock during prerender). Bump on content updates. */
const LAST_UPDATED = "2026-11-21";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return [
    { url: new URL("/", base).href, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 1 },
    {
      url: new URL("/?viewer=freelance", base).href,
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
