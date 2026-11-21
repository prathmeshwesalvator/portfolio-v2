"use client";

import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { freelanceFeaturedId, freelanceWorkIds, getProject } from "@/data/projects";
import { SECTION_IDS } from "@/data/site";
import { WorkFeaturedCase } from "./parts/WorkFeaturedCase";
import { WorkIndex } from "./parts/WorkIndex";

const SECTION_ID = SECTION_IDS.freelance.work;
const TITLE_ID = `${SECTION_ID}-title`;
const MORE_TITLE_ID = `${SECTION_ID}-more-title`;

// Static data — resolved once at module scope.
const featuredProject = getProject(freelanceFeaturedId);
const moreWork = freelanceWorkIds.map((id) => getProject(id));

/** Freelance · 02 — featured live case study, then an editorial index of further work. */
export function WorkSection() {
  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID}>
      <SectionHeading
        id={TITLE_ID}
        index="02"
        eyebrow="Selected work"
        title={
          <>
            Real projects, <em>real engineering</em>
          </>
        }
        description="A live client website, plus production and independent projects that show how I build."
      />

      <div className="mt-12 sm:mt-16">
        <WorkFeaturedCase project={featuredProject} />
      </div>

      {moreWork.length > 0 ? (
        <div className="mt-20 sm:mt-28">
          <Reveal className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <div className="flex max-w-xl flex-col gap-2">
              <h3
                id={MORE_TITLE_ID}
                className="font-display text-2xl leading-tight font-semibold tracking-[-0.03em] text-fg sm:text-3xl"
              >
                More work
              </h3>
              <p className="leading-relaxed text-muted">
                Production contributions and independent builds — tap any row for details.
              </p>
            </div>
            <p aria-hidden="true" className="shrink-0 font-mono text-xs tracking-[0.14em] text-subtle uppercase">
              <span className="text-accent-text tabular-nums">{String(moreWork.length).padStart(2, "0")}</span>{" "}
              projects
            </p>
          </Reveal>

          <WorkIndex projects={moreWork} labelledBy={MORE_TITLE_ID} className="mt-8 sm:mt-10" />
        </div>
      ) : null}
    </Section>
  );
}
