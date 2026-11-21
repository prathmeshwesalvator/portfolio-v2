/**
 * Absolute site URL used for metadata (canonical URLs, Open Graph, sitemap).
 *
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL           — set this once the custom domain is known
 *   2. VERCEL_PROJECT_PRODUCTION_URL  — provided automatically by Vercel
 *   3. http://localhost:3000          — local development
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    try {
      return new URL(explicit);
    } catch {
      // fall through to the next option on a malformed value
    }
  }

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) {
    return new URL(`https://${vercelHost}`);
  }

  return new URL("http://localhost:3000");
}
