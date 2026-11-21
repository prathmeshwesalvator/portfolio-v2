"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SECTION_IDS } from "@/data/site";
import { programmingLanguages, skillGroups } from "@/data/skills";
import { cn } from "@/lib/cn";
import type { SkillGroup } from "@/types";
import { SkillGroupCard } from "./parts/SkillGroupCard";

const SECTION_ID = SECTION_IDS.recruiter.skills;
const TITLE_ID = `${SECTION_ID}-title`;

/** Bento placement: 1 column on phones, 2 on tablets, a 12-column grid from lg. */
const BENTO_SPAN: Record<SkillGroup["id"], string> = {
  mobile: "md:col-span-2 lg:col-span-12",
  backend: "md:col-span-2 lg:col-span-5",
  frontend: "lg:col-span-4",
  tools: "lg:col-span-3",
};

/** Recruiter · 04 — skills grouped by where they were used. No bars, ratings or years. */
export function SkillsSection() {
  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID} className="border-y border-line bg-surface/60">
      <SectionHeading
        id={TITLE_ID}
        index="04"
        eyebrow="Technical skills"
        title={
          <>
            Depth in mobile, <em>range across the stack</em>
          </>
        }
        description="Grouped by where I've used them — mobile engineering is my primary focus."
      />

      <Stagger className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {skillGroups.map((group) => (
          <StaggerItem key={group.id} className={cn("flex", BENTO_SPAN[group.id])}>
            <SkillGroupCard group={group} />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-10">
        <dl className="flex flex-col gap-2 font-mono text-xs sm:flex-row sm:items-baseline sm:gap-5">
          <dt className="tracking-[0.14em] text-subtle uppercase">Programming languages</dt>
          <dd>
            <ul className="flex flex-wrap items-center gap-y-1 text-muted">
              {programmingLanguages.map((language, index) => (
                <li key={language} className="flex items-center">
                  {index > 0 ? (
                    <span aria-hidden="true" className="px-2 text-subtle">
                      ·
                    </span>
                  ) : null}
                  {language}
                </li>
              ))}
            </ul>
          </dd>
        </dl>
      </Reveal>
    </Section>
  );
}
