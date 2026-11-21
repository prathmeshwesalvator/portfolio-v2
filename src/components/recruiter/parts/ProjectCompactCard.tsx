"use client";

import { ProjectLinks } from "@/components/projects/ProjectLinks";
import { Chip } from "@/components/shared/Chip";
import type { Project, ProjectKind } from "@/types";

/** Stack items shown before collapsing the rest into a "+N" chip. */
const VISIBLE_STACK = 4;

const KIND_TONE: Record<ProjectKind, "accent" | "success" | "neutral"> = {
  professional: "accent",
  freelance: "success",
  personal: "neutral",
};

/** Compact "More projects" card. Renders no link row when a project has no verified links. */
export function ProjectCompactCard({ project }: { project: Project }) {
  const titleId = `project-${project.id}-title`;
  const shownStack = project.stack.slice(0, VISIBLE_STACK);
  const hiddenStack = project.stack.slice(VISIBLE_STACK);

  return (
    <article
      aria-labelledby={titleId}
      className="flex w-full flex-col gap-5 rounded-2xl border border-line bg-surface p-6 shadow-soft transition-[translate,box-shadow,border-color] duration-300 ease-out-expo hover:border-line-strong hover:shadow-card motion-safe:hover:-translate-y-0.5"
    >
      <div>
        <Chip size="xs" tone={KIND_TONE[project.kind]}>
          {project.kindLabel}
        </Chip>
      </div>

      <div className="flex flex-col gap-3">
        <hgroup className="flex flex-col gap-1">
          <h4 id={titleId} className="text-lg font-semibold tracking-tight text-fg">
            {project.name}
          </h4>
          <p className="text-sm text-muted">{project.tagline}</p>
        </hgroup>
        <p className="text-sm leading-relaxed text-muted">{project.summary}</p>
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <ul aria-label={`${project.name} tech stack`} className="flex flex-wrap gap-1.5">
          {shownStack.map((item) => (
            <li key={item}>
              <Chip size="xs" mono>
                {item}
              </Chip>
            </li>
          ))}
          {hiddenStack.length > 0 ? (
            // Remaining items: visible as a count, read out in full by screen readers.
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
    </article>
  );
}
