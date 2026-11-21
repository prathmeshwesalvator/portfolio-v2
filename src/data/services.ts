import {
  Blocks,
  ClipboardCheck,
  Code2,
  Compass,
  Layers,
  MessagesSquare,
  PackageCheck,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Smartphone,
  Workflow,
} from "lucide-react";
import type { ProcessStep, Service, WhyItem } from "@/types";

/**
 * Freelance services — only technologies demonstrated in the résumé or projects.
 * (Node.js / NestJS intentionally excluded: not evidenced.)
 */
export const services: readonly Service[] = [
  {
    id: "mobile",
    index: "01",
    title: "Flutter Mobile App Development",
    summary: "Cross-platform Android and iOS apps from a single, maintainable Flutter codebase.",
    deliverables: [
      "Cross-platform mobile apps",
      "UI implementation from your designs",
      "REST API integration",
      "Firebase integration",
      "Bug fixes and performance optimization",
    ],
    stack: ["Flutter", "Dart", "BLoC", "Firebase", "Drift"],
    icon: Smartphone,
  },
  {
    id: "backend",
    index: "02",
    title: "Backend & API Development",
    summary: "Reliable REST APIs and services that keep your product's data and logic in order.",
    deliverables: [
      "REST API development",
      "Django, Django REST Framework and FastAPI",
      "Database integration — PostgreSQL, SQLite, Redis",
      "Authentication and third-party integrations",
      "Docker-based deployment setup",
    ],
    stack: ["Python", "Django", "DRF", "FastAPI", "PostgreSQL", "Docker"],
    icon: Server,
  },
  {
    id: "full-stack",
    index: "03",
    title: "Full Stack Development",
    summary: "Complete web products — from the database to the interface your customers use.",
    deliverables: [
      "Frontend and backend development",
      "Business websites",
      "Admin dashboards",
      "Web application development",
    ],
    stack: ["React", "Tailwind CSS", "Django", "PostgreSQL"],
    icon: Layers,
  },
];

/** Freelance — How I Work. */
export const processSteps: readonly ProcessStep[] = [
  {
    index: "01",
    title: "Understand",
    description: "We talk through your goals, users and constraints until the problem is clear — before any code.",
    icon: Search,
  },
  {
    index: "02",
    title: "Plan",
    description: "Scope, milestones and technology choices agreed up front, with a realistic timeline.",
    icon: Compass,
  },
  {
    index: "03",
    title: "Build",
    description: "Iterative development with regular check-ins and working builds you can try along the way.",
    icon: Code2,
  },
  {
    index: "04",
    title: "Test",
    description: "Testing across devices, edge cases and failure states — so problems surface before your users find them.",
    icon: ClipboardCheck,
  },
  {
    index: "05",
    title: "Deliver",
    description: "Deployment, a clean handover of source code and documentation, and a walkthrough of how it all fits together.",
    icon: Rocket,
  },
];

/** Freelance — Why Work With Me. No testimonials or invented results. */
export const whyItems: readonly WhyItem[] = [
  {
    id: "production",
    title: "Production application experience",
    description:
      "I build and maintain production Flutter apps for an enterprise travel brand — shipped on Google Play, not just demos.",
    icon: PackageCheck,
  },
  {
    id: "full-picture",
    title: "Mobile and backend understanding",
    description: "Flutter on the front, Django and FastAPI behind it — I understand both sides of the API you are paying for.",
    icon: Workflow,
  },
  {
    id: "architecture",
    title: "Maintainable architecture",
    description: "Clean Architecture, BLoC and SOLID by default, so your product stays easy to extend after launch.",
    icon: Blocks,
  },
  {
    id: "communication",
    title: "Clear communication",
    description: "Plain-language updates, honest timelines, and early flags whenever something needs your decision.",
    icon: MessagesSquare,
  },
  {
    id: "delivery",
    title: "Focus on reliable delivery",
    description: "Offline-first thinking, careful error handling and testing — software that keeps working when conditions aren't perfect.",
    icon: ShieldCheck,
  },
];
