"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getProject, recruiterFeaturedIds, recruiterMoreIds } from "@/data/projects";
import { SECTION_IDS } from "@/data/site";
import { ProjectCompactCard } from "./parts/ProjectCompactCard";
import { ProjectShowcase } from "./parts/ProjectShowcase";

const SECTION_ID = SECTION_IDS.recruiter.projects;
const TITLE_ID = `${SECTION_ID}-title`;
const MORE_TITLE_ID = "more-projects-title";

// Static data — resolved once at module scope.
const featuredProjects = recruiterFeaturedIds.map((id) => getProject(id));
const moreProjects = recruiterMoreIds.map((id) => getProject(id));

/** Recruiter · 03 — featured showcases followed by a compact grid of other work. */
export function ProjectsSection() {
  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID}>
      <SectionHeading
        id={TITLE_ID}
        index="03"
        eyebrow="Featured projects"
        title={
          <>
            Selected <em>work</em>
          </>
        }
        description="Production apps I've contributed to professionally, alongside independent projects across mobile, backend and web."
      />

      <div className="mt-12 space-y-8 sm:mt-16 lg:space-y-10">
        {featuredProjects.map((project, index) => (
          <ProjectShowcase key={project.id} project={project} reverse={index % 2 === 1} />
        ))}
      </div>

      {moreProjects.length > 0 ? (
        <div className="mt-20 sm:mt-28">
          <Reveal className="flex items-center gap-4">
            <h3 id={MORE_TITLE_ID} className="text-xl font-semibold tracking-tight text-fg sm:text-2xl">
              More projects
            </h3>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
            <span aria-hidden="true" className="font-mono text-xs text-subtle tabular-nums">
              {String(moreProjects.length).padStart(2, "0")}
            </span>
          </Reveal>

          <Stagger as="ul" aria-labelledby={MORE_TITLE_ID} className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2">
            {moreProjects.map((project) => (
              <StaggerItem as="li" key={project.id} className="flex">
                <ProjectCompactCard project={project} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      ) : null}
    </Section>
  );
}
