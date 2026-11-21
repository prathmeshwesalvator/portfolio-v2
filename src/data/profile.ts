import type { Profile } from "@/types";
import portrait from "@/assets/profile/prathmesh-more.webp";
import portraitSquare from "@/assets/profile/prathmesh-more-square.webp";

/**
 * Source of truth: latest résumé (Aug 2026) + the brief.
 * Phone number intentionally omitted (data minimisation) — email + LinkedIn are
 * the public contact channels.
 */
export const profile: Profile = {
  fullName: "Prathmesh Sharad More",
  name: "Prathmesh More",
  firstName: "Prathmesh",
  initials: "PM",
  title: "Flutter Software Engineer",
  roles: ["Flutter Software Engineer", "Mobile Application Developer", "Full Stack Developer"],
  location: {
    city: "Dombivli",
    district: "Thane",
    region: "Maharashtra",
    country: "India",
    countryCode: "IN",
    label: "Dombivli, Thane, Maharashtra, India",
    short: "Dombivli, Thane · India",
  },
  email: "prathmeshmore655@gmail.com",
  links: {
    github: "https://github.com/prathmeshwesalvator",
    githubHandle: "prathmeshwesalvator",
    linkedin: "https://www.linkedin.com/in/prathmesh-more-b5b387281/",
    linkedinHandle: "prathmesh-more",
    resume: "/resume/Prathmesh-More-Resume.pdf",
    resumeFileName: "Prathmesh-More-Resume.pdf",
  },
  current: {
    role: "Flutter Developer",
    company: "Risosu Consultancy",
    client: "Thomas Cook India",
    since: "2026-02-16",
  },
  summary:
    "Flutter Software Engineer with hands-on experience building and maintaining production-grade enterprise applications using Flutter, Dart, BLoC, Clean Architecture and Offline-First architecture. Experienced in secure mobile development, local data persistence, background synchronization, native Android/iOS integration, cross-app deep linking, Firebase Analytics & Crashlytics, and responsive UI development.",
  languages: ["English", "Hindi", "Marathi"],
  interests: ["Cricket", "Swimming"],
  photo: {
    src: portrait,
    alt: "Portrait of Prathmesh More",
  },
  photoSquare: {
    src: portraitSquare,
    alt: "Portrait of Prathmesh More",
  },
};
