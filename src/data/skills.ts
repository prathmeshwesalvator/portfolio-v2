import type { SkillGroup } from "@/types";

/**
 * Grouped by where the skills were actually used — mobile engineering is the
 * primary focus (current role), backend comes from the Wesalvator internship
 * and projects, frontend from projects and freelance work.
 * Source: latest résumé skills section + the brief.
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
    label: "Internship + projects",
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
