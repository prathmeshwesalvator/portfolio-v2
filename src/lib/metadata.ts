import type { Metadata, Viewport } from "next";
import { profile } from "@/data/profile";
import { modeMeta } from "@/data/site";
import type { ViewerMode } from "@/types";

const SITE_NAME = "Prathmesh More";

/** Full per-experience metadata (page-level metadata replaces nested objects, so build them whole). */
export function buildModeMetadata(mode: ViewerMode): Metadata {
  const meta = modeMeta[mode];
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonicalPath },
    openGraph: {
      type: "profile",
      siteName: SITE_NAME,
      locale: "en_IN",
      url: meta.canonicalPath,
      title: meta.title,
      description: meta.description,
      firstName: "Prathmesh",
      lastName: "More",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export function buildModeViewport(mode: ViewerMode): Viewport {
  return {
    themeColor: modeMeta[mode].themeColor,
    // Both experiences are dark (warm graphite / cool near-black).
    colorScheme: "dark",
  };
}

/** schema.org Person — rendered once in the root layout. */
export function buildPersonJsonLd(siteUrl: URL): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.fullName,
    alternateName: profile.name,
    jobTitle: profile.title,
    url: siteUrl.href,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location.city,
      addressRegion: profile.location.region,
      addressCountry: profile.location.countryCode,
    },
    worksFor: { "@type": "Organization", name: profile.current.company },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Smt. Indira Gandhi College of Engineering" },
    knowsAbout: [
      "Flutter",
      "Dart",
      "Mobile application development",
      "Offline-first architecture",
      "Clean Architecture",
      "Django",
      "FastAPI",
      "React",
    ],
    sameAs: [profile.links.github, profile.links.linkedin],
  };
  // Escape "<" so the JSON can never close the surrounding <script> tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
