"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { additionalInfo, education } from "@/data/education";
import { SECTION_IDS } from "@/data/site";
import { CornerTicks, SPEC_LABEL } from "./parts/Blueprint";

const SECTION_ID = SECTION_IDS.recruiter.education;
const TITLE_ID = `${SECTION_ID}-title`;
const DEGREE_ID = "education-degree";

/** Recruiter · 05 — concise: the degree as a spec sheet with a typographic CGPA, plus extras. */
export function EducationSection() {
  const { grade } = education;

  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID}>
      <SectionHeading
        id={TITLE_ID}
        index="05"
        eyebrow="Education"
        meta={education.period}
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
          className="relative grid overflow-hidden rounded-[1.75rem] border border-line bg-surface sm:grid-cols-[minmax(0,1fr)_auto] lg:col-span-8"
        >
          <CornerTicks />
          <div className="flex flex-col gap-6 p-6 sm:p-10">
            <p className={SPEC_LABEL}>
              <time dateTime={String(education.startYear)}>{education.startYear}</time>
              <span aria-hidden="true"> — </span>
              <span className="sr-only"> to </span>
              <time dateTime={String(education.endYear)}>{education.endYear}</time>
            </p>
            <div>
              <h3 id={DEGREE_ID} className="text-2xl leading-tight font-semibold tracking-[-0.03em] text-fg sm:text-3xl">
                {education.degree}
              </h3>
              <p className="mt-2 font-serif text-xl text-accent-text italic">{education.specialization}</p>
            </div>
            <dl className="mt-auto flex flex-col gap-1 border-t border-line pt-5 text-[0.9375rem]">
              <dt className="sr-only">Institution</dt>
              <dd className="font-medium text-fg">{education.institution}</dd>
              <dt className="sr-only">University</dt>
              <dd className="text-muted">{education.university}</dd>
            </dl>
          </div>

          <dl className="flex flex-col justify-center border-t border-line bg-bg/40 p-6 sm:border-t-0 sm:border-l sm:p-10">
            <dt className={SPEC_LABEL}>{grade.label}</dt>
            <dd className="mt-3 flex items-baseline gap-1.5">
              <span className="text-7xl leading-none font-semibold tracking-[-0.06em] text-fg tabular-nums sm:text-8xl">
                {grade.value}
              </span>
              <span className="text-xl text-subtle">
                <span aria-hidden="true">/</span>
                <span className="sr-only"> out of </span>
                {grade.scale}
              </span>
            </dd>
          </dl>
        </Reveal>

        <Stagger as="ul" delay={0.08} aria-label="Additional information" className="flex flex-col gap-3 lg:col-span-4">
          {additionalInfo.map((item) => {
            const Icon = item.icon;
            return (
              <StaggerItem
                as="li"
                key={item.id}
                className="flex flex-1 gap-4 rounded-2xl border border-line bg-surface/60 p-5"
              >
                <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-accent-text">
                  <Icon className="size-[1.125rem]" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="text-sm font-semibold text-fg">{item.title}</h3>
                    {item.meta ? <p className="font-mono text-xs text-subtle tabular-nums">{item.meta}</p> : null}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{item.detail}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
