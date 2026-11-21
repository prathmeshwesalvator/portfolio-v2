import type { ExperienceItem } from "@/types";

/**
 * Source of truth: latest résumé (Aug 2026). Dates are exact résumé dates.
 * Metrics (~25%, ~20%, "3 production-grade apps") are quoted from the résumé.
 */
export const experience: readonly ExperienceItem[] = [
  {
    id: "risosu",
    role: "Flutter Developer",
    company: "Risosu Consultancy",
    client: "Thomas Cook India",
    type: "role",
    start: "2026-02-16",
    end: null,
    period: "Feb 2026 — Present",
    summary:
      "Building and maintaining production Flutter applications for Thomas Cook India's enterprise mobile products.",
    highlights: [
      "Built and maintained 3 production-grade Flutter applications using BLoC, Clean Architecture, SOLID and DRY — improving scalability and maintainability across enterprise systems.",
      "Implemented Offline-First architecture with Drift and WorkManager: reliable offline expense storage and background synchronization, reducing unnecessary network operations by ~25%.",
      "Optimized app startup and UI responsiveness — ~20% faster startup through optimized initialization and a custom responsive sizing solution.",
      "Implemented RSA-AES encryption with Android Keystore and iOS Keychain, and integrated native Android/iOS functionality through Method Channels and Event Channels.",
      "Implemented app-to-app integration, deep linking, Firebase Analytics and Crashlytics — improving cross-app navigation and production monitoring.",
    ],
    stack: [
      "Flutter",
      "Dart",
      "BLoC",
      "Clean Architecture",
      "Drift",
      "WorkManager",
      "RSA-AES",
      "Method Channels",
      "Firebase",
    ],
    projectIds: ["tc-pay", "tourpe"],
  },
  {
    id: "jio",
    role: "Flutter Developer Intern",
    company: "Reliance Jio Platform Limited",
    type: "internship",
    start: "2025-09-17",
    end: "2026-02-15",
    period: "Sep 2025 — Feb 2026",
    highlights: [
      "Developed Flutter Web applications and reusable components/packages, focused on modular, cross-platform development.",
      "Implemented debounced reactive search using StreamTransformers, with BLoC/Cubit for reactive state management.",
    ],
    stack: ["Flutter Web", "Dart", "BLoC / Cubit", "StreamTransformers"],
  },
  {
    id: "wesalvator",
    role: "Python Django Intern",
    company: "Wesalvator",
    companyUrl: "https://wesalvator.com/",
    type: "internship",
    start: "2025-04-25",
    end: "2025-08-07",
    period: "Apr 2025 — Aug 2025",
    highlights: [
      "Developed Django and FastAPI microservices and REST-based backend services for a scalable application architecture.",
      "Worked with rate limiting, load balancing and Docker for reliable service deployment and backend scalability.",
    ],
    stack: ["Python", "Django", "FastAPI", "REST APIs", "Docker", "Microservices"],
    // Listed on the latest résumé. Set `hidden: true` to remove it from the site.
    hidden: false,
  },
];

export const visibleExperience = experience.filter((item) => !item.hidden);
