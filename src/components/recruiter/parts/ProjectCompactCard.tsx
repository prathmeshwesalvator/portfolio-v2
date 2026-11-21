"use client";

import { ProjectLinks } from "@/components/projects/ProjectLinks";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { Chip } from "@/components/shared/Chip";
import { cn } from "@/lib/cn";
import type { Project, ProjectKind } from "@/types";

/** Stack items shown before collapsing the rest into a "+N" chip. */
const VISIBLE_STACK = 4;

const KIND_TONE: Record<ProjectKind, "accent" | "success" | "neutral"> = {
  professional: "accent",
  freelance: "success",
  personal: "neutral",
};

/**
 * "Independent builds" card: abstract visual on top (or beside, for the wide
 * card), then the essentials. Renders no link row without verified links.
 */
export function ProjectCompactCard({ project, wide = false }: { project: Project; wide?: boolean }) {
  const titleId = `project-${project.id}-title`;
  const shownStack = project.stack.slice(0, VISIBLE_STACK);
  const hiddenStack = project.stack.slice(VISIBLE_STACK);

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "group/card flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[border-color,translate] duration-500 ease-out-expo hover:border-line-strong motion-safe:hover:-translate-y-0.5",
        wide && "md:grid md:grid-cols-2",
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden border-b border-line",
          wide && "md:aspect-auto md:min-h-72 md:border-r md:border-b-0",
        )}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-out-expo motion-safe:group-hover/card:scale-[1.03]">
          <ProjectVisual variant={project.visual} />
        </div>
        <span className="absolute top-3 left-3">
          <Chip size="xs" tone={KIND_TONE[project.kind]} className="backdrop-blur-sm">
            {project.kindLabel}
          </Chip>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <hgroup className="flex flex-col gap-1">
          <h4 id={titleId} className={cn("font-semibold tracking-[-0.025em] text-fg", wide ? "text-2xl" : "text-xl")}>
            {project.name}
          </h4>
          <p className="text-sm text-muted">{project.tagline}</p>
        </hgroup>
        <p className="text-sm leading-relaxed text-muted">{project.summary}</p>

        <div className="mt-auto flex flex-col gap-4 pt-1">
          <ul aria-label={`${project.name} tech stack`} className="flex flex-wrap gap-1.5">
            {shownStack.map((item) => (
              <li key={item}>
                <Chip size="xs" mono>
                  {item}
                </Chip>
              </li>
            ))}
            {hiddenStack.length > 0 ? (
              <li title={hiddenStack.join(", ")}>
                <Chip size="xs" mono tone="outline">
                  <span aria-hidden="true">+{hiddenStack.length}</span>
                  <span className="sr-only">{hiddenStack.join(", ")}</span>
                </Chip>
              </li>
            ) : null}
          </ul>
          <ProjectLinks project={project} className="border-t border-line pt-4" />
        </div>
      </div>
    </article>
  );
}
