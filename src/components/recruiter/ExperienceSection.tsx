"use client";

import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { visibleExperience } from "@/data/experience";
import { SECTION_IDS } from "@/data/site";
import { cn } from "@/lib/cn";
import type { ExperienceItem } from "@/types";
import { RoleCompact, RoleFeature } from "./parts/ExperienceRole";

const SECTION_ID = SECTION_IDS.recruiter.experience;
const TITLE_ID = `${SECTION_ID}-title`;

const COUNT_WORDS: Readonly<Record<number, string>> = { 1: "1 role", 2: "2 roles", 3: "3 roles", 4: "4 roles" };

/** "2026 — Now" / "2025 — 26" for the year spine (derived from ISO dates, no clock reads). */
function yearSpan(item: ExperienceItem): { from: string; to: string } {
  const from = item.start.slice(0, 4);
  if (!item.end) return { from, to: "Now" };
  const to = item.end.slice(0, 4);
  return { from, to: to === from ? "" : `’${to.slice(2)}` };
}

/** Recruiter · 01 — roles on a year spine; the current role is a full spec sheet. */
export function ExperienceSection() {
  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID}>
      <SectionHeading
        id={TITLE_ID}
        index="01"
        eyebrow="Experience"
        meta={COUNT_WORDS[visibleExperience.length]}
        title={
          <>
            Building in <em>production</em>
          </>
        }
        description="Enterprise Flutter engineering for Thomas Cook India today, built on a Flutter Web internship at Reliance Jio."
      />

      <ol aria-label="Roles, most recent first" className="relative mt-12 flex flex-col gap-6 sm:mt-16 lg:gap-8 lg:pl-36">
        {/* Year spine (lg+): ol padding 144px, spine at 116px, node centred on it. Decorative. */}
        <span aria-hidden="true" className="absolute top-3 bottom-3 left-[116px] hidden w-px bg-line lg:block" />

        {visibleExperience.map((item, index) => {
          const years = yearSpan(item);
          const isCurrent = item.end === null;
          return (
            <li key={item.id} className="relative">
              <div aria-hidden="true" className="absolute top-9 -left-36 hidden w-[6.75rem] pr-6 text-right lg:block">
                <span className="block text-3xl leading-none font-semibold tracking-[-0.04em] text-fg tabular-nums">
                  {years.from}
                </span>
                {years.to ? (
                  <span className={cn("mt-1.5 block font-mono text-xs", isCurrent ? "text-accent-2" : "text-subtle")}>
                    — {years.to}
                  </span>
                ) : null}
              </div>
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-10 -left-[33px] hidden size-[11px] rounded-full border-2 lg:block",
                  isCurrent ? "animate-pulse-dot border-accent-2 bg-accent-2 text-accent-2" : "border-line-strong bg-bg",
                )}
              />
              {index === 0 && isCurrent ? <RoleFeature item={item} /> : <RoleCompact item={item} />}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
