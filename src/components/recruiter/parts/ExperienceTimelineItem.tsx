"use client";

import type { ReactNode } from "react";
import { ArrowLink } from "@/components/shared/ArrowLink";
import { Chip, ChipList } from "@/components/shared/Chip";
import { Reveal } from "@/components/shared/Reveal";
import { getProject } from "@/data/projects";
import { cn } from "@/lib/cn";
import type { ExperienceItem } from "@/types";
import { ExperiencePeriod } from "./ExperiencePeriod";

/** Résumé figures inside highlight sentences ("~25%", "3 production-grade Flutter applications"). */
const METRIC_PATTERN = /(~\d+(?:\.\d+)?%|\b\d+ production-grade Flutter applications)/;

/** Emphasises metrics without rewording: split() with a capture group keeps matches at odd indices. */
function emphasizeMetrics(text: string): ReactNode[] {
  return text.split(METRIC_PATTERN).map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-medium text-fg">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

/** Grows a text link's hit area to 40px tall without moving layout or enlarging the focus ring. */
const HIT_AREA = "relative after:absolute after:inset-x-0 after:-inset-y-2.5";

interface ExperienceTimelineItemProps {
  item: ExperienceItem;
  isLast: boolean;
}

export function ExperienceTimelineItem({ item, isLast }: ExperienceTimelineItemProps) {
  const isCurrent = item.end === null;
  const projectsLabelId = `${item.id}-projects-label`;

  return (
    <Reveal as="li" className="relative pl-8 sm:pl-10">
      {/* Rail: from this node down to the next one, bridging the list gap (space-y-12/14 + node offset). */}
      {isLast ? null : (
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-2 -bottom-14 left-[7px] w-px sm:-bottom-16",
            isCurrent ? "bg-linear-to-b from-accent-2/40 to-line" : "bg-line",
          )}
        />
      )}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1.5 left-0 size-[15px] rounded-full border-2 sm:top-2",
          isCurrent ? "animate-pulse-dot border-accent-2 bg-accent-2 text-accent-2" : "border-line-strong bg-surface",
        )}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold tracking-tight text-fg sm:text-2xl">{item.role}</h3>
          <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">
            {item.companyUrl ? (
              <ArrowLink href={item.companyUrl} external>
                {item.company}
              </ArrowLink>
            ) : (
              <span className="font-medium text-fg">{item.company}</span>
            )}
            {item.client ? (
              <>
                <span aria-hidden="true"> · </span>
                <span className="sr-only">, </span>
                Client: {item.client}
              </>
            ) : null}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 sm:flex-col sm:items-end sm:pt-1">
          <ExperiencePeriod item={item} className="font-mono text-[0.8125rem] whitespace-nowrap text-subtle" />
          {isCurrent ? (
            <Chip tone="success" size="xs">
              Current
            </Chip>
          ) : item.type === "internship" ? (
            <Chip tone="outline" size="xs">
              Internship
            </Chip>
          ) : null}
        </div>
      </div>

      {item.summary ? (
        <p className="mt-4 max-w-[38rem] text-[0.95rem] leading-relaxed text-fg">{item.summary}</p>
      ) : null}

      <ul className="mt-5 max-w-[38rem] space-y-3">
        {item.highlights.map((highlight) => (
          <li key={highlight} className="flex gap-3 text-[0.95rem] leading-relaxed text-muted">
            {/* 6px accent dash, centred on the first line (line-height 1.625 → 0.8125em). */}
            <span aria-hidden="true" className="mt-[calc(0.8125em-1px)] h-0.5 w-1.5 shrink-0 rounded-full bg-accent-text" />
            <span className="min-w-0">{emphasizeMetrics(highlight)}</span>
          </li>
        ))}
      </ul>

      <ChipList items={item.stack} mono size="xs" label={`Tech stack at ${item.company}`} className="mt-6" />

      {item.projectIds?.length ? (
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-line bg-surface px-4 py-3">
          <p id={projectsLabelId} className="font-mono text-[0.6875rem] tracking-[0.14em] text-subtle uppercase">
            Key projects
          </p>
          <ul aria-labelledby={projectsLabelId} className="flex flex-wrap gap-x-5 gap-y-2">
            {item.projectIds.map((projectId) => {
              const project = getProject(projectId);
              return (
                <li key={project.id}>
                  {/* In-page anchor to the matching case study in the Projects section. */}
                  <ArrowLink href={`#project-${project.id}`} className={cn("text-sm", HIT_AREA)}>
                    {project.name}
                  </ArrowLink>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </Reveal>
  );
}
