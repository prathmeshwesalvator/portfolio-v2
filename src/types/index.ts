import type { ComponentType, SVGProps } from "react";
import type { StaticImageData } from "next/image";

/* -------------------------------------------------------------------------- */
/*  Experience modes                                                          */
/* -------------------------------------------------------------------------- */

export type ViewerMode = "recruiter" | "freelance";

/** Any icon component (Lucide icons and the custom brand icons both satisfy this). */
export type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string }
>;

export interface NavItem {
  /** DOM id of the target section (without the leading #). */
  id: string;
  label: string;
}

export interface CallToAction {
  label: string;
  /** In-page anchor (`#id`), absolute URL, `mailto:` link or a public file path. */
  href: string;
  /** Set for links that leave the site. */
  external?: boolean;
  /** Set for file downloads (value is the suggested file name). */
  download?: string;
}

export interface ModeMeta {
  /** Browser tab + SEO title. */
  title: string;
  description: string;
  /** Matches the experience background, used for <meta name="theme-color">. */
  themeColor: string;
  /** Label used by the mode switch. */
  label: string;
  /** Short explanation for screen readers / tooltips. */
  hint: string;
  /** Polite live-region announcement after switching into this mode. */
  announcement: string;
  /** Canonical path for this experience. */
  canonicalPath: string;
  nav: NavItem[];
  headerCta: CallToAction;
}

/* -------------------------------------------------------------------------- */
/*  Profile                                                                   */
/* -------------------------------------------------------------------------- */

export interface ImageAsset {
  src: StaticImageData;
  alt: string;
}

export interface Profile {
  fullName: string;
  name: string;
  firstName: string;
  initials: string;
  title: string;
  roles: readonly string[];
  location: {
    city: string;
    district: string;
    region: string;
    country: string;
    countryCode: string;
    /** "Dombivli, Thane, Maharashtra, India" */
    label: string;
    /** "Dombivli, Thane · India" */
    short: string;
  };
  email: string;
  links: {
    github: string;
    githubHandle: string;
    linkedin: string;
    linkedinHandle: string;
    resume: string;
    resumeFileName: string;
  };
  current: {
    role: string;
    company: string;
    client: string;
    /** ISO date (yyyy-mm-dd). */
    since: string;
  };
  /** Professional summary (from the latest résumé). */
  summary: string;
  languages: readonly string[];
  interests: readonly string[];
  /** Circular portrait (black corners outside the circle — always render rounded-full). */
  photo: ImageAsset;
  /** Square crop of the same portrait — safe for rounded rectangles. */
  photoSquare: ImageAsset;
}

/* -------------------------------------------------------------------------- */
/*  Experience                                                                */
/* -------------------------------------------------------------------------- */

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  /** End client the work was delivered for (if different from the employer). */
  client?: string;
  companyUrl?: string;
  type: "role" | "internship";
  /** ISO date (yyyy-mm-dd). */
  start: string;
  /** ISO date (yyyy-mm-dd) or null while current. */
  end: string | null;
  /** Human-readable period, e.g. "Feb 2026 — Present". */
  period: string;
  summary?: string;
  highlights: readonly string[];
  stack: readonly string[];
  /** Project ids (see data/projects.ts) delivered in this role. */
  projectIds?: readonly ProjectId[];
  /** Set true to hide an entry without deleting it. */
  hidden?: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Projects                                                                  */
/* -------------------------------------------------------------------------- */

export type ProjectId =
  | "tc-pay"
  | "tourpe"
  | "medtech-360"
  | "ecommerce-platform"
  | "realtime-chat"
  | "blockchain-evoting"
  | "vibe-tribe-travels";

/**
 * professional — delivered for an employer/client (team-owned product)
 * freelance    — client work delivered independently
 * personal     — self-initiated / academic project
 */
export type ProjectKind = "professional" | "freelance" | "personal";

export interface ProjectLink {
  type: "play-store" | "github" | "live";
  label: string;
  href: string;
}

/** Abstract illustration used instead of (confidential) app screenshots. */
export type ProjectVisualVariant =
  | "forex-card"
  | "tour-route"
  | "health-pulse"
  | "commerce-auction"
  | "secure-chat"
  | "ledger-vote"
  | "travel-web";

export interface Project {
  id: ProjectId;
  name: string;
  /** e.g. "Forex & Travel Card Application" */
  tagline: string;
  kind: ProjectKind;
  /** Human label for `kind`, e.g. "Professional contribution". */
  kindLabel: string;
  /** Delivery context, e.g. "Risosu Consultancy · Client: Thomas Cook India". */
  context?: string;
  /** Required for professional work: clarifies shared ownership. */
  ownershipNote?: string;
  /** One- or two-sentence description. */
  summary: string;
  /** Problem / objective (case-study format). */
  objective?: string;
  /** How it was solved (case-study format). */
  solution?: string;
  /** What Prathmesh personally did — only verified statements. */
  contributions?: readonly string[];
  /** Feature highlights of the product itself. */
  highlights?: readonly string[];
  stack: readonly string[];
  links: readonly ProjectLink[];
  visual: ProjectVisualVariant;
  /** Real screenshots — only for public work we are allowed to show. */
  images?: {
    hero: ImageAsset;
    /** Full-page capture for scroll-on-hover previews. */
    fullPage?: ImageAsset;
  };
}

/* -------------------------------------------------------------------------- */
/*  Skills, education, extras                                                 */
/* -------------------------------------------------------------------------- */

export interface SkillCluster {
  title: string;
  items: readonly string[];
}

export interface SkillGroup {
  id: "mobile" | "backend" | "frontend" | "tools";
  title: string;
  /** Factual context label, e.g. "Primary focus". */
  label: string;
  emphasis: "primary" | "secondary" | "supporting";
  description: string;
  clusters: readonly SkillCluster[];
}

export interface EngineeringHighlight {
  id: string;
  title: string;
  description: string;
  /** Short evidence string drawn from the résumé (e.g. "~20% faster startup"). */
  evidence: string;
  icon: IconComponent;
}

export interface EducationItem {
  degree: string;
  specialization: string;
  institution: string;
  university: string;
  period: string;
  startYear: number;
  endYear: number;
  grade: { label: string; value: string; scale: string };
}

export interface AdditionalItem {
  id: string;
  title: string;
  detail: string;
  meta?: string;
  icon: IconComponent;
}

/* -------------------------------------------------------------------------- */
/*  Freelance content                                                         */
/* -------------------------------------------------------------------------- */

export interface Service {
  id: "mobile" | "backend" | "full-stack";
  index: string;
  title: string;
  summary: string;
  deliverables: readonly string[];
  stack: readonly string[];
  icon: IconComponent;
}

export interface ProcessStep {
  index: string;
  title: string;
  description: string;
  icon: IconComponent;
}

export interface WhyItem {
  id: string;
  title: string;
  description: string;
  icon: IconComponent;
}

export interface SelectOption {
  value: string;
  label: string;
}
