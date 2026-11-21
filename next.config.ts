import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Content Security Policy (production only — `next dev` needs eval for HMR).
 * Next.js injects inline bootstrap scripts, so `'unsafe-inline'` is required for
 * statically prerendered pages without nonces. Everything else is locked to
 * same-origin, plus the optional EmailJS endpoint used by the inquiry form.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://api.emailjs.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  ...(isProduction ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy }] : []),
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    // Pin the workspace root to this project (a stray lockfile higher up the tree
    // would otherwise be considered as the root).
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  /**
   * Both visitor experiences are statically prerendered:
   *   /                    → Recruiter experience (default, also for invalid ?viewer values)
   *   /?viewer=freelance   → internally served by the /freelance route
   * The client keeps the URL in sync (?viewer=recruiter|freelance) without reloads.
   */
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "query", key: "viewer", value: "freelance" }],
          destination: "/freelance",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },

  /** The internal /freelance path should never be the public URL. */
  async redirects() {
    return [
      {
        source: "/freelance",
        destination: "/?viewer=freelance",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
