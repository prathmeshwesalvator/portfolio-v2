"use client";

import { ArrowDownRight } from "lucide-react";
import type { ReactNode } from "react";
import { Chip, ChipList } from "@/components/shared/Chip";
import { Reveal } from "@/components/shared/Reveal";
import { getProject } from "@/data/projects";
import { cn } from "@/lib/cn";
import { handleAnchorClick } from "@/lib/scroll";
import type { ExperienceItem } from "@/types";
import { CornerTicks, SPEC_LABEL } from "./Blueprint";
import { ExperiencePeriod } from "./ExperiencePeriod";

/** Résumé figures inside highlight sentences ("~25%", "3 production-grade Flutter applications"). */
const METRIC_PATTERN = /(~\d+(?:\.\d+)?%|\b\d+ production-grade Flutter applications)/;

/** Emphasises metrics without rewording: split() with a capture group keeps matches at odd indices. */
function emphasizeMetrics(text: string): ReactNode[] {
  return text.split(METRIC_PATTERN).map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} className="font-semibold text-accent-text">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

/** Numbered, tagged contribution list shared by both role layouts. */
function Contributions({ item, compact = false }: { item: ExperienceItem; compact?: boolean }) {
  return (
    <ol className={cn("flex flex-col", compact ? "gap-5" : "gap-6")}>
      {item.highlights.map((highlight, index) => {
        const tag = item.highlightTags?.[index];
        return (
          <li key={highlight} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
            <span aria-hidden="true" className="pt-0.5 font-mono text-xs text-subtle tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              {tag ? (
                <p className="mb-1.5 font-mono text-[0.6875rem] tracking-[0.14em] text-accent-text uppercase">{tag}</p>
              ) : null}
              <p className="text-[0.95rem] leading-relaxed text-muted">{emphasizeMetrics(highlight)}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/** Spec-sheet field: mono key above a value. */
function SpecField({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className={SPEC_LABEL}>{label}</dt>
      <dd className="mt-1.5 text-lg leading-snug font-semibold tracking-tight text-fg">{children}</dd>
    </div>
  );
}

/** The current role — a large two-column spec sheet. */
export function RoleFeature({ item }: { item: ExperienceItem }) {
  const isCurrent = item.end === null;

  return (
    <Reveal
      as="article"
      aria-labelledby={`role-${item.id}-title`}
      className="relative isolate overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-card"
    >
      <CornerTicks />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 -z-10 size-[28rem] rounded-full bg-accent/[0.08] blur-3xl"
      />

      <div className="grid lg:grid-cols-12">
        <div className="flex flex-col gap-8 border-b border-line p-6 sm:p-10 lg:col-span-5 lg:border-r lg:border-b-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* div, not p: ExperiencePeriod renders its own <p> (p > p is invalid and breaks hydration). */}
            <div className="flex items-center gap-2.5 font-mono text-xs tracking-[0.14em] text-subtle uppercase">
              {isCurrent ? (
                <>
                  <span aria-hidden="true" className="size-2 shrink-0 animate-pulse-dot rounded-full bg-current text-accent-2" />
                  <span className="text-accent-2">Now</span>
                  <span aria-hidden="true">·</span>
                </>
              ) : null}
              <ExperiencePeriod item={item} className="normal-case tracking-normal" />
            </div>
            <Chip size="xs" tone="outline">
              {item.type === "internship" ? "Internship" : "Full-time"}
            </Chip>
          </div>

          <h3
            id={`role-${item.id}-title`}
            className="text-[2.5rem] leading-[0.98] font-semibold tracking-[-0.045em] text-fg sm:text-6xl"
          >
            {item.role}
          </h3>

          {/* Employer and client are clearly separated. */}
          <dl className="grid gap-5 border-y border-line py-6 sm:grid-cols-2">
            <SpecField label="Employer">{item.company}</SpecField>
            {item.client ? (
              <SpecField label="Client" className="sm:border-l sm:border-line sm:pl-5">
                {item.client}
              </SpecField>
            ) : null}
          </dl>

          {item.summary ? <p className="text-[0.95rem] leading-relaxed text-muted">{item.summary}</p> : null}

          {item.projectIds?.length ? (
            <div className="mt-auto">
              <p id={`role-${item.id}-shipped`} className={SPEC_LABEL}>
                Shipped products
              </p>
              <ul aria-labelledby={`role-${item.id}-shipped`} className="mt-3 flex flex-wrap gap-2">
                {item.projectIds.map((projectId) => {
                  const project = getProject(projectId);
                  return (
                    <li key={project.id}>
                      <a
                        href={`#project-${project.id}`}
                        onClick={(event) => handleAnchorClick(event)}
                        className="group/ship inline-flex h-10 items-center gap-2 rounded-full border border-line-strong bg-surface-2 pr-3 pl-4 text-sm font-medium text-fg transition-colors hover:border-accent/60 hover:text-accent-text"
                      >
                        {project.name}
                        <span className="sr-only"> — jump to case study</span>
                        <ArrowDownRight
                          aria-hidden="true"
                          className="size-4 text-subtle transition-transform duration-300 ease-out-expo group-hover/ship:translate-x-0.5 group-hover/ship:translate-y-0.5 group-hover/ship:text-accent-text"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-8 p-6 sm:p-10 lg:col-span-7">
          <h4 className={SPEC_LABEL}>Key contributions</h4>
          <Contributions item={item} />
          <div className="mt-auto border-t border-line pt-6">
            <ChipList items={item.stack} size="xs" mono label={`Tech stack at ${item.company}`} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** Earlier roles — compact, same visual vocabulary. */
export function RoleCompact({ item }: { item: ExperienceItem }) {
  return (
    <Reveal
      as="article"
      aria-labelledby={`role-${item.id}-title`}
      className="relative grid overflow-hidden rounded-[1.75rem] border border-line bg-surface/60 lg:grid-cols-12"
    >
      <div className="flex flex-col gap-5 border-b border-line p-6 sm:p-8 lg:col-span-5 lg:border-r lg:border-b-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ExperiencePeriod item={item} className="font-mono text-xs text-subtle" />
          <Chip size="xs" tone="outline">
            {item.type === "internship" ? "Internship" : "Full-time"}
          </Chip>
        </div>
        <div>
          <h3 id={`role-${item.id}-title`} className="text-2xl leading-tight font-semibold tracking-[-0.03em] text-fg sm:text-3xl">
            {item.role}
          </h3>
          <dl className="mt-4">
            <SpecField label="Company">{item.company}</SpecField>
          </dl>
        </div>
      </div>
      <div className="flex flex-col gap-6 p-6 sm:p-8 lg:col-span-7">
        <Contributions item={item} compact />
        <ChipList items={item.stack} size="xs" mono label={`Tech stack at ${item.company}`} className="mt-auto" />
      </div>
    </Reveal>
  );
}
