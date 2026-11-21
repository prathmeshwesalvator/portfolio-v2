"use client";

import { ExperienceSummary } from "@/components/recruiter/parts/ExperienceSummary";
import { ExperienceTimelineItem } from "@/components/recruiter/parts/ExperienceTimelineItem";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { visibleExperience } from "@/data/experience";
import { SECTION_IDS } from "@/data/site";
import { cn } from "@/lib/cn";

const SECTION_ID = SECTION_IDS.recruiter.experience;
const TITLE_ID = `${SECTION_ID}-title`;

/** Recruiter 02 — a sticky snapshot of the current role beside the full timeline. */
export function ExperienceSection() {
  const current = visibleExperience.find((item) => item.end === null);

  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID} className="border-y border-line bg-surface/60">
      <SectionHeading
        id={TITLE_ID}
        index="02"
        eyebrow="Experience"
        title={
          <>
            Where I&apos;ve been <em>building</em>
          </>
        }
        description="Enterprise Flutter engineering today, built on internships in Flutter Web and Python backends."
      />

      <div className="mt-12 grid gap-10 sm:mt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        {current ? (
          // The sticky wrapper is static; only the inner card animates, so stickiness never fights a transform.
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <ExperienceSummary item={current} />
            </Reveal>
          </div>
        ) : null}

        <ol aria-label="Roles, most recent first" className={cn("space-y-12 sm:space-y-14", !current && "lg:col-span-2")}>
          {visibleExperience.map((item, index) => (
            <ExperienceTimelineItem key={item.id} item={item} isLast={index === visibleExperience.length - 1} />
          ))}
        </ol>
      </div>
    </Section>
  );
}
