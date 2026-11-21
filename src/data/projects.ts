import type { Project, ProjectId } from "@/types";
import vibeTribeHero from "@/assets/projects/vibe-tribe-hero.webp";
import vibeTribeFull from "@/assets/projects/vibe-tribe-full.webp";

/**
 * Project content. Rules followed here:
 *  - Employer/client products are marked `professional` with an ownership note.
 *  - No confidential screenshots: professional work uses abstract visuals.
 *  - Only links verified on 21 Nov 2026 are rendered. Dead links are kept in
 *    comments so they are easy to restore once the repositories are public again.
 */
export const projects: readonly Project[] = [
  {
    id: "tc-pay",
    name: "TC Pay",
    tagline: "Forex & Travel Card Application",
    kind: "professional",
    kindLabel: "Professional contribution",
    context: "Risosu Consultancy · Client: Thomas Cook India",
    ownershipNote:
      "Team-built product owned by Thomas Cook India. I contributed the modules and features listed here as a Flutter developer at Risosu Consultancy.",
    summary: "Production forex and travel card application for Thomas Cook India, live on Google Play.",
    objective: "A production forex and travel card application with secure, connected mobile experiences.",
    solution:
      "Flutter modules built with BLoC, protected by RSA-AES encryption, connected to other apps through cross-app deep linking, and monitored with Firebase.",
    challenge:
      "Handling sensitive forex and card data securely, while letting users move seamlessly between this app and other apps.",
    outcome: "Live on Google Play",
    contributions: [
      "Developed the Edge Points and Offers & Rewards modules",
      "Implemented secure RSA-AES encryption",
      "Implemented cross-app deep linking",
      "Built responsive UI",
      "Contributed to the NFC module integration",
    ],
    stack: ["Flutter", "BLoC", "RSA-AES", "Firebase", "Deep Linking", "NFC"],
    links: [
      {
        type: "play-store",
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.thomascook.forexapp",
      },
    ],
    visual: "forex-card",
  },
  {
    id: "tourpe",
    name: "TourPe",
    tagline: "Enterprise Tour Management Application",
    kind: "professional",
    kindLabel: "Professional contribution",
    context: "Risosu Consultancy · Client: Thomas Cook India",
    ownershipNote:
      "Team-built product owned by Thomas Cook India. I contributed the modules and features listed here as a Flutter developer at Risosu Consultancy.",
    summary:
      "Enterprise tour expense management app that keeps working offline and syncs automatically once connectivity returns.",
    objective: "Enterprise tour expense management that stays reliable with or without connectivity.",
    solution:
      "An offline-first Flutter architecture: expenses persist locally with Drift and synchronize in the background with WorkManager, with Android Flavors for multi-environment builds.",
    challenge:
      "Expenses recorded on tour — often without reliable connectivity — must never be lost, and must sync automatically once the device is back online.",
    outcome: "Live on Google Play",
    contributions: [
      "Developed Trip Wallet 2.0",
      "Worked on the On Tour Sell and TMPF modules",
      "Implemented offline-first expense management",
      "Used Drift for local persistence",
      "Implemented background synchronization with WorkManager",
    ],
    highlights: ["Offline expense storage", "Automatic sync after reconnecting", "Multi-environment builds"],
    stack: ["Flutter", "BLoC", "Drift", "WorkManager", "Android Flavors"],
    links: [
      {
        type: "play-store",
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.tcso.tmapp",
      },
    ],
    visual: "tour-route",
  },
  {
    id: "medtech-360",
    name: "MedTech 360",
    tagline: "Centralized Healthcare Platform",
    kind: "personal",
    kindLabel: "Personal project",
    summary:
      "Healthcare platform bringing patient–doctor workflows, appointments and SOS alerts together — with AI-assisted pneumonia detection and blockchain-verified diagnostic reports.",
    objective: "Centralize healthcare workflows — patients, doctors, appointments and emergency alerts — in one platform.",
    solution:
      "A Flutter app backed by Django REST Framework and Firebase, with a trained machine-learning model for AI-assisted pneumonia detection and blockchain-based verification of diagnostic reports.",
    highlights: [
      "Patient–doctor workflows and appointments",
      "SOS alerts and authentication",
      "AI-assisted pneumonia detection (trained ML model)",
      "Blockchain-based diagnostic report verification",
    ],
    stack: ["Flutter", "Django", "DRF", "Firebase", "Blockchain", "Machine Learning"],
    links: [
      {
        type: "github",
        label: "Source on GitHub",
        href: "https://github.com/prathmeshwesalvator/medisync360_fe",
      },
    ],
    visual: "health-pulse",
  },
  {
    id: "ecommerce-platform",
    name: "E-Commerce Platform",
    tagline: "Recommendations & Live Auctions",
    kind: "personal",
    kindLabel: "Personal project",
    summary:
      "Full-stack shopping platform with product recommendations, live auctions and real-time updates over WebSockets.",
    objective: "An online store that recommends relevant products and runs live auctions for premium items.",
    solution:
      "A React frontend on a Django REST API, with Django Channels and Redis pushing real-time WebSocket updates, Celery handling background tasks, and PostgreSQL for data.",
    highlights: [
      "Product recommendations",
      "Live auction functionality",
      "Real-time WebSocket updates",
      "Background task processing",
    ],
    stack: ["React", "Django", "DRF", "Celery", "Redis", "Django Channels", "PostgreSQL"],
    // Repository link from the brief returned 404 on 21 Nov 2026:
    // https://github.com/prathmeshmore655/Full-stack-project-
    links: [],
    visual: "commerce-auction",
  },
  {
    id: "realtime-chat",
    name: "Real-Time Chat",
    tagline: "Secure Real-Time Messaging",
    kind: "personal",
    kindLabel: "Personal project",
    summary:
      "Real-time chat application with QR contact adding, file sharing, two-factor authentication and end-to-end encryption.",
    objective: "Private, real-time messaging that is quick to start and secure by design.",
    solution:
      "A React client with Django Channels over Redis for real-time delivery, JWT authentication with two-factor auth, end-to-end encryption, and Docker for containerized deployment.",
    highlights: ["QR code contact adding", "File sharing", "Two-factor authentication", "End-to-end encryption"],
    stack: ["React", "Django Channels", "Redis", "JWT", "Docker"],
    // Repository link from the brief returned 404 on 21 Nov 2026:
    // https://github.com/prathmeshmore655/Technical-Round-Task
    links: [],
    visual: "secure-chat",
  },
  {
    id: "blockchain-evoting",
    name: "Blockchain E-Voting",
    tagline: "Decentralized Voting System",
    kind: "personal",
    kindLabel: "Personal project",
    summary:
      "Decentralized voting platform on Ethereum smart contracts with a Django backend, built for tamper-proof, transparent elections.",
    objective: "Make elections tamper-proof and transparent.",
    solution:
      "Solidity smart contracts on Ethereum (Ganache for local development) with a Django REST Framework backend.",
    highlights: ["Smart-contract vote ledger", "Tamper-proof results", "Transparent verification"],
    stack: ["Ethereum", "Solidity", "Ganache", "Django", "DRF"],
    // Repository link from the brief returned 404 on 21 Nov 2026 (both accounts):
    // https://github.com/prathmeshwesalvator/Blockchain-based-E-Voting-System
    links: [],
    visual: "ledger-vote",
  },
  {
    id: "vibe-tribe-travels",
    name: "Vibe Tribe Travels",
    tagline: "Travel Website for a Tourism Business",
    kind: "freelance",
    kindLabel: "Freelance client project",
    context: "Freelance · Client project",
    summary:
      "Responsive travel website for a tourism business, with structured service and destination pages, reusable components and a consistent cross-device UI.",
    objective:
      "Present a tourism business's services and destinations through a clear, structured website that works on every device.",
    solution:
      "A React site built from reusable components, with structured service and destination pages and responsive Bootstrap layouts, deployed on Vercel.",
    contributions: [
      "Developed the website as a freelance client project",
      "Structured service and destination pages",
      "Built reusable React components",
      "Implemented responsive, cross-device UI",
      "Deployed the site on Vercel",
    ],
    stack: ["React", "HTML", "CSS", "Bootstrap"],
    links: [
      { type: "live", label: "Visit live site", href: "https://vibe-tribe-travels.vercel.app/" },
      { type: "github", label: "Source on GitHub", href: "https://github.com/prathmeshwesalvator/Vibe-Tribe-Travels" },
    ],
    visual: "travel-web",
    images: {
      hero: {
        src: vibeTribeHero,
        alt: "Vibe Tribe Travels homepage: hero card reading “Vibe Tribe Travels — Where Fun Meet Travel” with Get Started and Contact Us buttons.",
      },
      fullPage: {
        src: vibeTribeFull,
        alt: "Full-page capture of the Vibe Tribe Travels website: hero, about section, featured destinations grid and services.",
      },
    },
  },
];

export function getProject(id: ProjectId): Project {
  const project = projects.find((item) => item.id === id);
  if (!project) {
    throw new Error(`Unknown project id: ${id}`);
  }
  return project;
}

/** Recruiter mode — featured project chapters, in order. */
export const recruiterFeaturedIds: readonly ProjectId[] = ["tc-pay", "tourpe"];

/** Recruiter mode — "independent builds" grid (the first item gets the wide card). */
export const recruiterMoreIds: readonly ProjectId[] = [
  "medtech-360",
  "ecommerce-platform",
  "realtime-chat",
  "blockchain-evoting",
  "vibe-tribe-travels",
];

/** Freelance mode — the featured case study. */
export const freelanceFeaturedId: ProjectId = "vibe-tribe-travels";

/**
 * Freelance mode — other work shown as engineering capability, in order.
 * Only projects that strengthen the freelance positioning (production mobile
 * apps and full-stack products); the blockchain prototype stays in Recruiter mode.
 */
export const freelanceWorkIds: readonly ProjectId[] = [
  "tc-pay",
  "tourpe",
  "medtech-360",
  "ecommerce-platform",
  "realtime-chat",
];
