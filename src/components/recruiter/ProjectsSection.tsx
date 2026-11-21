"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getProject, recruiterFeaturedIds, recruiterMoreIds } from "@/data/projects";
import { SECTION_IDS } from "@/data/site";
import { cn } from "@/lib/cn";
import { ProjectChapter } from "./parts/ProjectChapter";
import { ProjectCompactCard } from "./parts/ProjectCompactCard";

const SECTION_ID = SECTION_IDS.recruiter.projects;
const TITLE_ID = `${SECTION_ID}-title`;
const MORE_TITLE_ID = "more-projects-title";

// Static data — resolved once at module scope.
const featuredProjects = recruiterFeaturedIds.map((id) => getProject(id));
const moreProjects = recruiterMoreIds.map((id) => getProject(id));

/** Recruiter · 03 — the centrepiece: two production chapters, then independent builds. */
export function ProjectsSection() {
  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID}>
      <SectionHeading
        id={TITLE_ID}
        index="03"
        eyebrow="Featured projects"
        meta={`${featuredProjects.length + moreProjects.length} projects`}
        title={
          <>
            Production work, <em>up close</em>
          </>
        }
        description="Two enterprise apps I contribute to as part of the Risosu Consultancy team for Thomas Cook India — followed by independent builds across mobile, backend and web."
      />

      <div className="mt-16 flex flex-col gap-28 sm:mt-20 lg:gap-36">
        {featuredProjects.map((project, index) => (
          <ProjectChapter key={project.id} project={project} number={index + 1} reverse={index % 2 === 1} />
        ))}
      </div>

      {moreProjects.length > 0 ? (
        <div className="mt-28 sm:mt-36">
          <Reveal className="flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <div className="max-w-xl">
              <h3 id={MORE_TITLE_ID} className="text-3xl font-semibold tracking-[-0.035em] text-fg sm:text-4xl">
                Independent <em className="font-serif font-normal text-accent-text italic">builds</em>
              </h3>
              <p className="mt-2 leading-relaxed text-muted">
                Personal and freelance projects — healthcare, commerce, real-time messaging, blockchain and the web.
              </p>
            </div>
            <span aria-hidden="true" className="shrink-0 font-mono text-xs tracking-[0.16em] text-subtle uppercase">
              <span className="text-accent-text tabular-nums">{String(moreProjects.length).padStart(2, "0")}</span>{" "}
              builds
            </span>
          </Reveal>

          <Stagger as="ul" aria-labelledby={MORE_TITLE_ID} className="mt-8 grid gap-4 sm:mt-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {moreProjects.map((project, index) => (
              <StaggerItem
                as="li"
                key={project.id}
                className={cn("flex", index === 0 && "md:col-span-2 lg:col-span-2")}
              >
                <ProjectCompactCard project={project} wide={index === 0} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      ) : null}
    </Section>
  );
}
