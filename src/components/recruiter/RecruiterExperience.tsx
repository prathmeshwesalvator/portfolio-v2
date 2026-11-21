"use client";

import { RecruiterContactSection } from "./ContactSection";
import { EducationSection } from "./EducationSection";
import { ExperienceSection } from "./ExperienceSection";
import { HighlightsSection } from "./HighlightsSection";
import { ProjectsSection } from "./ProjectsSection";
import { RecruiterHero } from "./RecruiterHero";
import { SkillsSection } from "./SkillsSection";

/**
 * Recruiter mode — engineering editorial. Order follows how hiring managers read:
 * who and where now → proven experience → capabilities → work up close → skills → education → contact.
 */
export function RecruiterExperience() {
  return (
    <>
      <RecruiterHero />
      <ExperienceSection />
      <HighlightsSection />
      <ProjectsSection />
      <SkillsSection />
      <EducationSection />
      <RecruiterContactSection />
    </>
  );
}
