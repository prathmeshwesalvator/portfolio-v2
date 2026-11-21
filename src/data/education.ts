import { Languages, Medal, Volleyball } from "lucide-react";
import type { AdditionalItem, EducationItem } from "@/types";

export const education: EducationItem = {
  degree: "B.E. Computer Science & Engineering",
  specialization: "Artificial Intelligence & Machine Learning",
  institution: "Smt. Indira Gandhi College of Engineering",
  university: "University of Mumbai",
  period: "2022 — 2026",
  startYear: 2022,
  endYear: 2026,
  grade: { label: "CGPA", value: "9.0", scale: "10" },
};

/**
 * Recruiter mode — Additional information.
 * NCC comes from the previous portfolio (not on the latest résumé) and is kept
 * at the owner's request. The "Advanced Excel (Microsoft)" certification is NOT
 * on the latest résumé, so it is unpublished until verified — to restore it, add:
 *   { id: "certification", title: "Certification",
 *     detail: "Advanced Excel (Microsoft) — data analysis, formulas, pivot tables and dashboards.", icon: Award }
 */
export const additionalInfo: readonly AdditionalItem[] = [
  {
    id: "ncc",
    title: "National Cadet Corps (NCC)",
    detail: "Served as CQMS (Company Quarter Master Sergeant) — leadership, discipline and teamwork through NCC training.",
    meta: "2017 — 2020",
    icon: Medal,
  },
  {
    id: "languages",
    title: "Languages",
    detail: "English · Hindi · Marathi",
    icon: Languages,
  },
  {
    id: "interests",
    title: "Interests",
    detail: "Cricket · Swimming",
    icon: Volleyball,
  },
];
