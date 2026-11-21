import type { EngineeringHighlight } from "@/types";

/**
 * Recruiter mode — Engineering Highlights (capability board).
 * Every claim and evidence line maps to the latest résumé; metrics keep the "~".
 * Order = board order: two feature tiles, then six standard tiles.
 */
export const engineeringHighlights: readonly EngineeringHighlight[] = [
  {
    id: "clean-architecture",
    title: "Clean Architecture",
    description:
      "Presentation, domain and data kept behind clear boundaries, with SOLID and DRY applied — so enterprise apps stay testable and easy to extend.",
    evidence: "3 production-grade Flutter apps",
    diagram: "clean-architecture",
    size: "feature",
  },
  {
    id: "offline-first",
    title: "Offline-First Systems",
    description:
      "Drift for local persistence and WorkManager for background sync — expenses are stored offline and synchronize automatically once connectivity returns.",
    evidence: "~25% fewer unnecessary network operations",
    diagram: "offline-first",
    size: "feature",
  },
  {
    id: "bloc",
    title: "BLoC / Cubit",
    description:
      "Event-driven, predictable state — including debounced reactive search built with StreamTransformers.",
    evidence: "Used at Risosu and Reliance Jio",
    diagram: "bloc",
    size: "standard",
  },
  {
    id: "security",
    title: "Secure Data Handling",
    description: "RSA-AES encryption with keys held in Android Keystore and iOS Keychain for secure platform-level communication.",
    evidence: "RSA-AES · Keystore · Keychain",
    diagram: "security",
    size: "standard",
  },
  {
    id: "performance",
    title: "Performance & Reliability",
    description:
      "Optimized initialization and a custom responsive sizing solution, with Firebase Analytics and Crashlytics watching production.",
    evidence: "~20% faster app startup",
    diagram: "performance",
    size: "standard",
  },
  {
    id: "native",
    title: "Native Integrations",
    description: "Android and iOS capabilities bridged into Flutter through Method Channels and Event Channels.",
    evidence: "Method & Event Channels",
    diagram: "native",
    size: "standard",
  },
  {
    id: "deep-linking",
    title: "Deep Linking & App-to-App",
    description: "Cross-app deep linking and app-to-app integration between production apps, for seamless hand-offs between products.",
    evidence: "Cross-app navigation in production",
    diagram: "deep-linking",
    size: "standard",
  },
  {
    id: "api",
    title: "API Integration",
    description: "REST and WebSocket integrations with structured JSON handling, request queuing and retry logic for unreliable networks.",
    evidence: "REST · WebSockets · Retry logic",
    diagram: "api",
    size: "standard",
  },
];
