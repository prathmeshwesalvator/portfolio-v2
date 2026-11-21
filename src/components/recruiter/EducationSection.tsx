"use client";

import { GraduationCap } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { additionalInfo, education } from "@/data/education";
import { SECTION_IDS } from "@/data/site";
import type { AdditionalItem } from "@/types";

const SECTION_ID = SECTION_IDS.recruiter.education;
const TITLE_ID = `${SECTION_ID}-title`;
const DEGREE_ID = "education-degree";

const LABEL = "font-mono text-xs tracking-[0.14em] text-subtle uppercase";

/** Recruiter · 05 — degree with a typographic CGPA, plus additional information. */
export function EducationSection() {
  const { grade } = education;

  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID}>
      <SectionHeading
        id={TITLE_ID}
        index="05"
        eyebrow="Education & more"
        title={
          <>
            Foundations, <em>and beyond the code</em>
          </>
        }
      />

      <div className="mt-12 grid gap-5 sm:mt-16 lg:grid-cols-12">
        <Reveal
          as="article"
          aria-labelledby={DEGREE_ID}
          className="flex flex-col gap-10 rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8 lg:col-span-7"
        >
          <div className="flex items-start justify-between gap-4">
            <span
              aria-hidden="true"
              className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-text"
            >
              <GraduationCap className="size-6" strokeWidth={1.75} />
            </span>
            <p className="pt-1 font-mono text-xs text-subtle tabular-nums">
              <time dateTime={String(education.startYear)}>{education.startYear}</time>
              <span aria-hidden="true"> — </span>
              <span className="sr-only"> to </span>
              <time dateTime={String(education.endYear)}>{education.endYear}</time>
            </p>
          </div>

          {/* mt-auto: when the row stretches this card, the details settle at the bottom. */}
          <div className="mt-auto flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h3 id={DEGREE_ID} className="text-2xl font-semibold tracking-tight text-fg">
                {education.degree}
              </h3>
              <p className="mt-2 text-muted">{education.specialization}</p>
              <dl className="mt-6 flex flex-col gap-1 text-[0.9375rem]">
                <dt className="sr-only">Institution</dt>
                <dd className="font-medium text-fg">{education.institution}</dd>
                <dt className="sr-only">University</dt>
                <dd className="text-muted">{education.university}</dd>
              </dl>
            </div>

            <dl className="shrink-0 border-t border-line pt-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-8">
              <dt className={LABEL}>{grade.label}</dt>
              <dd className="mt-2 flex items-baseline gap-1">
                <span className="text-6xl leading-none font-semibold tracking-[-0.04em] text-fg tabular-nums sm:text-7xl">
                  {grade.value}
                </span>
                <span className="text-xl text-muted">
                  <span aria-hidden="true">/</span>
                  <span className="sr-only"> out of </span>
                  {grade.scale}
                </span>
              </dd>
            </dl>
          </div>
        </Reveal>

        <Stagger
          as="ul"
          delay={0.08}
          aria-label="Additional information"
          className="grid gap-4 sm:grid-cols-2 lg:col-span-5"
        >
          {additionalInfo.map((item) => (
            <StaggerItem as="li" key={item.id} className="flex">
              <EducationExtraCard item={item} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

function EducationExtraCard({ item }: { item: AdditionalItem }) {
  const Icon = item.icon;

  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-line bg-surface p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <span aria-hidden="true" className="grid size-9 place-items-center rounded-lg bg-surface-2 text-fg">
          <Icon className="size-[1.125rem]" strokeWidth={1.75} />
        </span>
        {item.meta ? <p className="pt-0.5 font-mono text-xs text-subtle tabular-nums">{item.meta}</p> : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-fg">{item.title}</h3>
        <p className="text-sm leading-relaxed text-muted">{item.detail}</p>
      </div>
    </div>
  );
}
