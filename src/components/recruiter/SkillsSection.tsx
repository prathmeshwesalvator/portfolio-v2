"use client";

import { Fragment } from "react";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SECTION_IDS } from "@/data/site";
import { programmingLanguages, skillMatrix, webStack } from "@/data/skills";
import { cn } from "@/lib/cn";

const SECTION_ID = SECTION_IDS.recruiter.skills;
const TITLE_ID = `${SECTION_ID}-title`;

/**
 * Recruiter · 04 — a typographic skills matrix. Importance is shown by type
 * size, not by bars or ratings: core skills are set large, the rest small.
 */
export function SkillsSection() {
  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID} className="border-y border-line bg-surface/40">
      <SectionHeading
        id={TITLE_ID}
        index="04"
        eyebrow="Technical skills"
        meta={`${skillMatrix.length} categories`}
        title={
          <>
            Depth in mobile, <em>range across the stack</em>
          </>
        }
        description="Core skills set large, supporting skills small — mobile engineering is my primary focus."
      />

      <Stagger as="ol" stagger={0.07} className="mt-12 border-t border-line sm:mt-16">
        {skillMatrix.map((category, index) => {
          const titleId = `skills-${category.id}-title`;
          const primary = index === 0;
          return (
            <StaggerItem
              as="li"
              key={category.id}
              aria-labelledby={titleId}
              className="group/skill grid gap-5 border-b border-line py-8 sm:py-10 lg:grid-cols-12 lg:gap-10"
            >
              <div className="flex gap-4 lg:col-span-4">
                <span
                  aria-hidden="true"
                  className="pt-1.5 font-mono text-xs text-subtle tabular-nums transition-colors group-hover/skill:text-accent-text"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 id={titleId} className="text-2xl font-semibold tracking-[-0.03em] text-fg">
                    {category.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-1.5 font-mono text-[0.6875rem] tracking-[0.14em] uppercase",
                      primary ? "text-accent-2" : "text-subtle",
                    )}
                  >
                    {category.context}
                  </p>
                </div>
              </div>

              <div className="min-w-0 pl-8 lg:col-span-8 lg:pl-0">
                <ul
                  aria-label={`${category.title}: core skills`}
                  className="flex flex-wrap items-center gap-x-6 gap-y-2"
                >
                  {category.core.map((skill) => (
                    <li
                      key={skill}
                      className={cn(
                        "flex items-center gap-3 leading-tight font-semibold tracking-[-0.03em] text-fg",
                        primary ? "text-3xl sm:text-4xl" : "text-2xl sm:text-[1.75rem]",
                      )}
                    >
                      <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-accent" />
                      {skill}
                    </li>
                  ))}
                </ul>
                <ul
                  aria-label={`${category.title}: also`}
                  className="mt-4 flex flex-wrap items-center gap-y-1.5 text-[0.9375rem] text-muted"
                >
                  {category.more.map((skill, skillIndex) => (
                    <li key={skill} className="flex items-center">
                      {skillIndex > 0 ? (
                        <span aria-hidden="true" className="px-2.5 text-line-strong">
                          /
                        </span>
                      ) : null}
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      <Reveal className="mt-8">
        <dl className="grid gap-3 font-mono text-xs sm:grid-cols-[auto_1fr] sm:gap-x-6">
          {[
            { label: "Languages", items: programmingLanguages },
            { label: "Web (projects & freelance)", items: webStack },
          ].map((row) => (
            <Fragment key={row.label}>
              <dt className="tracking-[0.14em] text-subtle uppercase">{row.label}</dt>
              <dd className="text-muted">{row.items.join(" · ")}</dd>
            </Fragment>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
