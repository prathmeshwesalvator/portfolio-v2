import type { SkillCategory, SkillGroup } from "@/types";

/**
 * Recruiter mode — skills matrix in the five categories from the brief.
 * `core` skills are set large, `more` small, so importance is visible at a
 * glance. Source: latest résumé skills section + projects already on the site.
 */
export const skillMatrix: readonly SkillCategory[] = [
  {
    id: "mobile",
    title: "Mobile Engineering",
    context: "Daily work · primary focus",
    core: ["Flutter", "Dart", "Android", "iOS"],
    more: [
      "Flutter Web",
      "Responsive UI",
      "Method & Event Channels",
      "Deep Linking",
      "App-to-App Integration",
      "Push Notifications",
      "RSA-AES Encryption",
      "Keystore · Keychain",
      "Biometric Authentication",
    ],
  },
  {
    id: "architecture",
    title: "Architecture & State",
    context: "How I structure apps",
    core: ["Clean Architecture", "BLoC / Cubit", "Offline-First"],
    more: ["SOLID · DRY · KISS", "Design Patterns", "Background Sync", "Request Queuing", "Retry Logic", "Unit Testing"],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    context: "Integrations + projects",
    core: ["REST APIs", "Django", "FastAPI"],
    more: ["Django REST Framework", "WebSockets", "JSON", "Microservices", "Python"],
  },
  {
    id: "data",
    title: "Databases & Storage",
    context: "Local-first + server-side",
    core: ["Drift", "PostgreSQL"],
    more: ["SQLite", "Local Persistence", "WorkManager", "Redis"],
  },
  {
    id: "tools",
    title: "Tools & Platforms",
    context: "Everyday workflow",
    core: ["Git", "Firebase", "Android Studio"],
    more: ["GitHub", "VS Code", "Postman", "Docker", "Firebase Analytics", "Firebase Crashlytics"],
  },
];

/** Web stack — shown as a footnote in Recruiter mode (used in projects + freelance work). */
export const webStack = ["React", "JavaScript", "Tailwind CSS", "Bootstrap"] as const;

/**
 * Grouped by where the skills were actually used — used by the terminal easter
 * egg. Mobile engineering is the primary focus (current role); backend comes
 * from projects, frontend from projects and freelance work.
 */
export const skillGroups: readonly SkillGroup[] = [
  {
    id: "mobile",
    title: "Mobile Engineering",
    label: "Primary focus",
    emphasis: "primary",
    description:
      "Daily work: production Flutter apps for enterprise products — from architecture and state management to native integration and security.",
    clusters: [
      { title: "Core", items: ["Flutter", "Dart", "Flutter Web", "Android", "iOS", "Responsive UI"] },
      {
        title: "Architecture & state",
        items: ["BLoC / Cubit", "Clean Architecture", "SOLID · DRY · KISS", "Design Patterns"],
      },
      {
        title: "Data & offline",
        items: [
          "Offline-First Architecture",
          "Drift",
          "Local Persistence",
          "WorkManager",
          "Background Sync",
          "Request Queuing",
          "Retry Logic",
        ],
      },
      {
        title: "Platform & integration",
        items: [
          "REST APIs",
          "WebSockets",
          "Deep Linking",
          "App-to-App Integration",
          "Method Channels",
          "Event Channels",
          "Push Notifications",
        ],
      },
      {
        title: "Security",
        items: ["RSA-AES Encryption", "Android Keystore", "iOS Keychain", "Authentication", "Biometric Authentication"],
      },
      { title: "Quality & monitoring", items: ["Firebase Analytics", "Firebase Crashlytics", "Unit Testing"] },
    ],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    label: "Projects",
    emphasis: "secondary",
    description: "Django and FastAPI services, REST APIs and the data layer behind them.",
    clusters: [
      { title: "Languages & frameworks", items: ["Python", "Django", "Django REST Framework", "FastAPI"] },
      { title: "Architecture & ops", items: ["Microservices", "Docker", "Redis"] },
      { title: "Databases", items: ["PostgreSQL", "SQLite"] },
    ],
  },
  {
    id: "frontend",
    title: "Web Frontend",
    label: "Projects + freelance",
    emphasis: "supporting",
    description: "Responsive websites and web apps, including client work.",
    clusters: [{ title: "Stack", items: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Bootstrap"] }],
  },
  {
    id: "tools",
    title: "Tools",
    label: "Everyday tooling",
    emphasis: "supporting",
    description: "The workflow behind the work.",
    clusters: [{ title: "Tools", items: ["Git", "GitHub", "VS Code", "Android Studio", "Postman"] }],
  },
];

/** Programming languages (résumé). */
export const programmingLanguages = ["Dart", "Python", "JavaScript", "HTML", "CSS"] as const;
