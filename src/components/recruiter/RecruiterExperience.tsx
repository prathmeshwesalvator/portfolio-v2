"use client";

import { RecruiterContactSection } from "./ContactSection";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";
import { HighlightsSection } from "./HighlightsSection";
import { ProjectsSection } from "./ProjectsSection";
import { RecruiterHero } from "./RecruiterHero";
import { SkillsSection } from "./SkillsSection";

/** Recruiter mode — professional, scannable in seconds. Order is intentional. */
export function RecruiterExperience() {
  return (
    <>
      <RecruiterHero />
      <HighlightsSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <EducationSection />
      <RecruiterContactSection />
    </>
  );
}
