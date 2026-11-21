"use client";

import { Briefcase, Check, Info } from "lucide-react";
import { ProjectLinks } from "@/components/projects/ProjectLinks";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { Chip, ChipList } from "@/components/shared/Chip";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/cn";
import type { Project } from "@/types";

interface ProjectShowcaseProps {
  project: Project;
  /** Places the visual on the right from `lg` up (alternating rhythm down the page). */
  reverse?: boolean;
}

/** Verified personal contributions take priority over product-level highlights. */
function getShowcaseList(project: Project): { heading: string; items: readonly string[] } | null {
  if (project.contributions?.length) return { heading: "My contributions", items: project.contributions };
  if (project.highlights?.length) return { heading: "Highlights", items: project.highlights };
  return null;
}

/**
 * Featured project: a two-panel showcase — abstract visual + case summary.
 * The article id (`project-<id>`) is an anchor target used by the Experience timeline.
 */
export function ProjectShowcase({ project, reverse = false }: ProjectShowcaseProps) {
  const articleId = `project-${project.id}`;
  const titleId = `${articleId}-title`;
  const isProfessional = project.kind === "professional";
  const list = getShowcaseList(project);
  const hasLinks = project.links.length > 0;

  return (
    <Reveal
      as="article"
      id={articleId}
      aria-labelledby={titleId}
      className="group/project grid overflow-hidden rounded-3xl border border-line bg-surface shadow-soft transition-shadow duration-700 ease-out-expo hover:shadow-card lg:grid-cols-2"
    >
      {/* Visual panel — decorative art, never a real screen of the product. */}
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden border-b border-line bg-surface-2 sm:aspect-[16/10] lg:aspect-auto lg:min-h-[26rem] lg:border-b-0",
          reverse ? "lg:order-last lg:border-l" : "lg:border-r",
        )}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-out-expo motion-safe:group-hover/project:scale-[1.02]">
          <ProjectVisual variant={project.visual} />
        </div>
        {isProfessional ? (
          // Visual label only: the kind chip in the content panel announces the same text.
          <span
            aria-hidden="true"
            className="absolute top-4 left-4 inline-flex h-7 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 text-xs font-medium text-fg shadow-soft sm:top-6 sm:left-6"
          >
            <Briefcase className="size-3.5 text-accent-text" strokeWidth={2} />
            {project.kindLabel}
          </span>
        ) : null}
      </div>

      {/* Content panel */}
      <div className="flex min-w-0 flex-col gap-7 p-6 sm:p-10 xl:p-12">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <Chip tone={isProfessional ? "accent" : "neutral"}>{project.kindLabel}</Chip>
            {project.context ? <p className="min-w-0 font-mono text-xs text-subtle">{project.context}</p> : null}
          </div>

          <hgroup className="flex flex-col gap-1.5">
            <h3 id={titleId} className="text-3xl font-semibold tracking-tight text-fg">
              {project.name}
            </h3>
            <p className="text-lg text-muted">{project.tagline}</p>
          </hgroup>

          <p className="leading-relaxed text-muted">{project.summary}</p>
        </div>

        {list ? (
          <div>
            <h4 className="font-mono text-xs tracking-[0.14em] text-subtle uppercase">{list.heading}</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {list.items.map((item) => (
                <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-fg">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-2-soft text-accent-2"
                  >
                    <Check className="size-3" strokeWidth={2.75} />
                  </span>
                  <span className="min-w-0">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <ChipList items={project.stack} size="xs" mono label={`${project.name} tech stack`} />

        {project.ownershipNote || hasLinks ? (
          <footer className="mt-auto flex flex-col gap-5">
            {project.ownershipNote ? (
              <p className="flex gap-2.5 rounded-xl bg-surface-2 p-3 text-sm leading-relaxed text-muted">
                <Info aria-hidden="true" className="mt-[0.1875rem] size-4 shrink-0" />
                <span className="min-w-0">{project.ownershipNote}</span>
              </p>
            ) : null}
            {hasLinks ? (
              <div className="border-t border-line pt-5">
                <ProjectLinks project={project} />
              </div>
            ) : null}
          </footer>
        ) : null}
      </div>
    </Reveal>
  );
}
