"use client";

import { InquirySection } from "@/components/contact/InquirySection";
import { FreelanceHero } from "./FreelanceHero";
import { ProcessSection } from "./ProcessSection";
import { ServicesSection } from "./ServicesSection";
import { WhySection } from "./WhySection";
import { WorkSection } from "./WorkSection";

/** Freelance mode — creative, conversion-focused. Order is intentional. */
export function FreelanceExperience() {
  return (
    <>
      <FreelanceHero />
      <ServicesSection />
      <WorkSection />
      <ProcessSection />
      <WhySection />
      <InquirySection />
    </>
  );
}
