import type { CallToAction, ModeMeta, ViewerMode } from "@/types";
import { profile } from "./profile";

/** Section ids — single source of truth shared by navigation and sections. */
export const SECTION_IDS = {
  recruiter: {
    hero: "top",
    highlights: "highlights",
    experience: "experience",
    projects: "projects",
    skills: "skills",
    education: "education",
    contact: "contact",
  },
  freelance: {
    hero: "top",
    services: "services",
    work: "work",
    process: "process",
    why: "why",
    inquiry: "start",
    talk: "lets-talk",
  },
} as const;

const R = SECTION_IDS.recruiter;
const F = SECTION_IDS.freelance;

export const modeMeta: Record<ViewerMode, ModeMeta> = {
  recruiter: {
    title: "Prathmesh More — Flutter Software Engineer",
    description:
      "Flutter Engineer building secure, scalable and reliable mobile applications — production enterprise apps on Clean Architecture, BLoC and offline-first systems. Based in Dombivli, Thane, India.",
    themeColor: "#0d0c0a",
    label: "Recruiter",
    hint: "Hiring? See experience, projects and skills.",
    announcement: "Recruiter view loaded: experience, projects and skills.",
    canonicalPath: "/",
    nav: [
      { id: R.experience, label: "Experience" },
      { id: R.highlights, label: "Expertise" },
      { id: R.projects, label: "Projects" },
      { id: R.skills, label: "Skills" },
      { id: R.contact, label: "Contact" },
    ],
    headerCta: {
      label: "Résumé",
      href: profile.links.resume,
      download: profile.links.resumeFileName,
    },
  },
  freelance: {
    title: "Prathmesh More — Mobile Apps, APIs & Web Products",
    description:
      "Freelance Flutter and full-stack developer: cross-platform mobile apps, REST APIs with Django and FastAPI, and full-stack web products. Have an idea? Let's turn it into a product.",
    themeColor: "#0a0a0c",
    label: "Freelance",
    hint: "Have a project? See services, work and how to start.",
    announcement: "Freelance view loaded: services, work and project inquiry.",
    canonicalPath: "/?viewer=freelance",
    nav: [
      { id: F.services, label: "Services" },
      { id: F.work, label: "Work" },
      { id: F.process, label: "Process" },
      { id: F.why, label: "Why me" },
    ],
    headerCta: {
      label: "Start a project",
      href: `#${F.inquiry}`,
    },
  },
};

/** Shared brand line. */
export const brand = {
  tagline: "One developer. Two experiences.",
  copyrightYear: 2026, // update yearly (no Date() during prerender — see README)
} as const;

/* -------------------------------------------------------------------------- */
/*  Recruiter copy                                                            */
/* -------------------------------------------------------------------------- */

export const recruiterHero = {
  status: `${profile.current.role} at ${profile.current.company}`,
  statusDetail: `Client: ${profile.current.client}`,
  /** Rendered as: Engineering mobile experiences <em>that scale.</em> */
  headline: {
    lead: "Engineering mobile experiences",
    emphasis: "that scale.",
  },
  positioning: "Flutter Engineer focused on building secure, scalable and reliable mobile applications.",
  intro:
    "I build and maintain production-grade enterprise apps with Flutter, BLoC and Clean Architecture — offline-first, encrypted where it matters, and integrated deeply with Android and iOS.",
  location: profile.location.short,
  timezone: "IST · UTC+5:30",
  primaryCta: { label: "View projects", href: `#${R.projects}` } satisfies CallToAction,
  resumeCta: {
    label: "Download résumé",
    href: profile.links.resume,
    download: profile.links.resumeFileName,
  } satisfies CallToAction,
  /** Verified résumé figures only — keep the "~". */
  metrics: [
    { value: "3", label: "production-grade Flutter apps", source: "Risosu Consultancy" },
    { value: "~20%", label: "faster app startup", source: "Startup optimization" },
    { value: "~25%", label: "fewer unnecessary network operations", source: "Offline-first sync" },
    { value: "9.0", suffix: "/10", label: "CGPA · B.E. CSE (AI & ML)", source: "University of Mumbai" },
  ],
} as const;

export const recruiterContact = {
  eyebrow: "Contact",
  /** Rendered as: Let's build something <em>meaningful.</em> */
  title: { lead: "Let's build something", emphasis: "meaningful." },
  description:
    "Hiring for a mobile team? Email is the quickest way to reach me — and my résumé, LinkedIn and GitHub are all one click away.",
  primaryCta: { label: "Email me", href: `mailto:${profile.email}` } satisfies CallToAction,
} as const;

/* -------------------------------------------------------------------------- */
/*  Freelance copy                                                            */
/* -------------------------------------------------------------------------- */

export const freelanceHero = {
  eyebrow: "Freelance · Mobile apps · APIs · Web products",
  headline: {
    question: "Have an idea?",
    answerLead: "Let's turn it into a",
    answerEmphasis: "product.",
  },
  intro:
    "I build cross-platform mobile apps with Flutter, the backend systems and APIs that power them, and full-stack web products — engineered to stay reliable long after launch.",
  primaryCta: { label: "Start a Project", href: `#${F.inquiry}` } satisfies CallToAction,
  secondaryCta: { label: "Explore My Work", href: `#${F.work}` } satisfies CallToAction,
  stack: ["Flutter", "Dart", "Firebase", "Django", "FastAPI", "PostgreSQL", "Redis", "Docker", "React", "Tailwind CSS"],
} as const;

export const freelanceInquiry = {
  eyebrow: "Start a project",
  title: "Let's Build Your Project",
  description:
    "Tell me what you're building. Share as much or as little as you have — a rough idea is a perfectly good place to start.",
  nextSteps: [
    "I read your brief and the goals behind it.",
    "I reply with questions or a time to talk it through.",
    "You get a clear scope, plan and estimate.",
  ],
} as const;

export const freelanceClosing = {
  eyebrow: "Let's talk",
  question: "Got a project in mind?",
  answer: "Let's talk.",
  description:
    "Email me a line about your idea — or use the brief above. Either way you get a reply from me, not a sales team.",
} as const;

/** Cross-mode prompts ("you're in X view — switch to Y"). */
export const modeCue: Record<ViewerMode, { text: string; action: string }> = {
  recruiter: { text: "Have a project in mind?", action: "See the freelance view" },
  freelance: { text: "Hiring for a team?", action: "See the recruiter view" },
};
