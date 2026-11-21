import { Lock, Plug, Smartphone, WifiOff } from "lucide-react";
import type { EngineeringHighlight } from "@/types";

/** Recruiter mode — Engineering Highlights. Every claim maps to the latest résumé. */
export const engineeringHighlights: readonly EngineeringHighlight[] = [
  {
    id: "production",
    title: "Production Mobile Applications",
    description:
      "Built and maintained production-grade Flutter apps for enterprise products — including TC Pay and TourPe on Google Play — with optimized startup and responsive UI.",
    evidence: "3 production apps · ~20% faster startup",
    icon: Smartphone,
  },
  {
    id: "offline-first",
    title: "Offline-First Architecture",
    description:
      "Local persistence with Drift and background synchronization with WorkManager, so expense data is stored offline and syncs automatically once connectivity returns.",
    evidence: "~25% fewer unnecessary network operations",
    icon: WifiOff,
  },
  {
    id: "security",
    title: "Secure Mobile Engineering",
    description:
      "RSA-AES encryption with cryptographic keys managed through Android Keystore and iOS Keychain for secure platform-level communication.",
    evidence: "RSA-AES · Keystore · Keychain",
    icon: Lock,
  },
  {
    id: "native",
    title: "Native Platform Integration",
    description:
      "Native Android/iOS functionality through Method Channels and Event Channels, plus app-to-app integration and cross-app deep linking between production apps.",
    evidence: "Method & Event Channels · Deep linking",
    icon: Plug,
  },
];
