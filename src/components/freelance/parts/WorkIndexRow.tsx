"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Info, Plus } from "lucide-react";
import type { PointerEvent } from "react";
import { ProjectLinks } from "@/components/projects/ProjectLinks";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { Chip, ChipList } from "@/components/shared/Chip";
import { StaggerItem } from "@/components/shared/Reveal";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO } from "@/lib/motion";
import type { Project } from "@/types";
import { getWorkKind, getWorkList, WorkChecklist, WorkDetail, WorkText } from "./WorkDetails";

interface WorkIndexRowProps {
  project: Project;
  index: number;
  /** Prefix (from useId) for the trigger/panel ids. */
  idPrefix: string;
  open: boolean;
  reduceMotion: boolean;
  onToggle: () => void;
  onPointerEnter: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerLeave: () => void;
}

/** One editorial index row: a full-width accordion trigger + its case-study panel. */
export function WorkIndexRow({
  project,
  index,
  idPrefix,
  open,
  reduceMotion,
  onToggle,
  onPointerEnter,
  onPointerLeave,
}: WorkIndexRowProps) {
  const triggerId = `${idPrefix}-${project.id}-trigger`;
  const panelId = `${idPrefix}-${project.id}-panel`;
  const kind = getWorkKind(project);
  const list = getWorkList(project);
  const number = String(index + 1).padStart(2, "0");

  const kindChip = (
    <Chip tone={kind.tone} size="xs" className="max-w-full">
      <span className="truncate">{kind.label}</span>
    </Chip>
  );

  return (
    <StaggerItem as="li" className="relative border-t border-line last:border-b">
      <h4>
        <button
          id={triggerId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          className={cn(
            "group/row grid min-h-11 w-full cursor-pointer items-center gap-x-3 py-5 text-left",
            "grid-cols-[1.75rem_minmax(0,1fr)_auto] sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-x-4 sm:py-7",
            "md:grid-cols-[3rem_minmax(0,1fr)_auto_auto] lg:grid-cols-[3.5rem_minmax(0,1fr)_15rem_13rem_auto] lg:gap-x-6",
          )}
        >
          {/* Accent hairline that draws across the row on hover and stays while open. */}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-0 -top-px h-px origin-left bg-accent-text/70 transition-transform duration-700 ease-out-expo",
              open ? "scale-x-100" : "scale-x-0 group-hover/row:scale-x-100 group-focus-visible/row:scale-x-100",
            )}
          />

          <span
            aria-hidden="true"
            className={cn(
              "self-start pt-0.5 font-mono text-sm tabular-nums transition-colors duration-300 sm:pt-2.5",
              open ? "text-accent-text" : "text-subtle group-hover/row:text-muted",
            )}
          >
            {number}
          </span>

          <span className="flex min-w-0 flex-col gap-1.5">
            <span
              className={cn(
                "block font-display text-2xl leading-[1.05] font-semibold tracking-[-0.03em] break-words sm:text-4xl",
                "transition-[color,translate] duration-500 ease-out-expo",
                "group-hover/row:translate-x-1.5 group-hover/row:text-accent-text group-focus-visible/row:translate-x-1.5 group-focus-visible/row:text-accent-text",
                open ? "text-accent-text" : "text-fg",
              )}
            >
              {project.name}
            </span>
            <span className="sr-only">, </span>
            <span className="block text-sm leading-snug text-muted">{project.tagline}</span>
            {/* Below md the kind label sits under the tagline instead of in its own column. */}
            <span className="mt-1.5 flex min-w-0 md:hidden">
              <span className="sr-only">, </span>
              {kindChip}
            </span>
          </span>

          <span className="hidden min-w-0 md:flex md:justify-end lg:justify-start">
            <span className="sr-only">, </span>
            {kindChip}
          </span>

          <span
            aria-hidden="true"
            className="hidden flex-wrap gap-x-2 gap-y-1 font-mono text-xs leading-5 text-muted lg:flex"
          >
            {project.stack.slice(0, 3).map((item, itemIndex) => (
              <span key={item} className="inline-flex items-center gap-2">
                {itemIndex > 0 ? <span className="text-subtle/60">/</span> : null}
                {item}
              </span>
            ))}
          </span>

          <span
            aria-hidden="true"
            className={cn(
              "grid size-10 place-items-center rounded-full border transition-colors duration-300",
              open
                ? "border-primary bg-primary text-primary-fg"
                : "border-line text-muted group-hover/row:border-line-strong group-hover/row:text-fg",
            )}
          >
            <Plus
              className={cn("size-4 transition-transform duration-500 ease-out-expo", open && "rotate-45")}
              strokeWidth={2}
            />
          </span>
        </button>
      </h4>

      {/* Stable aria-controls target; the region inside mounts only while open. */}
      <div id={panelId}>
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="panel"
              role="region"
              aria-labelledby={triggerId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_OUT_EXPO }}
              className="overflow-hidden"
            >
              <div className="grid gap-6 pb-8 md:grid-cols-12 md:pl-16 lg:gap-8 lg:pb-10 lg:pl-20">
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-surface-2 md:col-span-4 md:aspect-[4/3] md:self-start">
                  <ProjectVisual variant={project.visual} />
                </div>

                <div className="flex min-w-0 flex-col gap-6 md:col-span-8">
                  {project.objective || project.solution ? (
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                      {project.objective ? (
                        <WorkDetail as="h5" label="Objective">
                          <WorkText>{project.objective}</WorkText>
                        </WorkDetail>
                      ) : null}
                      {project.solution ? (
                        <WorkDetail as="h5" label="Solution">
                          <WorkText>{project.solution}</WorkText>
                        </WorkDetail>
                      ) : null}
                    </div>
                  ) : null}

                  {list ? (
                    <WorkDetail as="h5" label={list.label}>
                      <WorkChecklist items={list.items} className="mt-1 lg:grid lg:grid-cols-2 lg:gap-x-8" />
                    </WorkDetail>
                  ) : null}

                  <ChipList items={project.stack} size="xs" mono label={`${project.name} tech stack`} />

                  {project.ownershipNote ? (
                    <p className="flex gap-2.5 rounded-xl bg-surface-2 p-3 text-sm leading-relaxed text-muted">
                      <Info aria-hidden="true" className="mt-[0.1875rem] size-4 shrink-0" />
                      <span className="min-w-0">{project.ownershipNote}</span>
                    </p>
                  ) : null}

                  <ProjectLinks project={project} />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </StaggerItem>
  );
}
