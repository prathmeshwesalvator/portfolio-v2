"use client";

import { InquirySection } from "@/components/contact/InquirySection";
import { FreelanceClosingSection } from "./ClosingSection";
import { FreelanceHero } from "./FreelanceHero";
import { ProcessSection } from "./ProcessSection";
import { ServicesSection } from "./ServicesSection";
import { WhySection } from "./WhySection";
import { WorkSection } from "./WorkSection";

/** Freelance mode — creative, conversion-focused. Ends on the brief, then a memorable "Let's talk." */
export function FreelanceExperience() {
  return (
    <>
      <FreelanceHero />
      <ServicesSection />
      <WorkSection />
      <ProcessSection />
      <WhySection />
      <InquirySection />
      <FreelanceClosingSection />
    </>
  );
}
