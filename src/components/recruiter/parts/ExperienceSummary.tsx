"use client";

import { Download } from "lucide-react";
import { ArrowLink } from "@/components/shared/ArrowLink";
import { profile } from "@/data/profile";
import type { ExperienceItem } from "@/types";
import { ExperiencePeriod } from "./ExperiencePeriod";

interface ExperienceMetric {
  value: string;
  label: string;
}

/**
 * Résumé metrics, keyed by experience id so they can never attach to the wrong
 * role. Quoted from the risosu highlights in data/experience.ts — keep the "~".
 */
const ROLE_METRICS: Readonly<Partial<Record<string, readonly ExperienceMetric[]>>> = {
  risosu: [
    { value: "3", label: "production-grade Flutter apps" },
    { value: "~20%", label: "faster startup" },
    { value: "~25%", label: "fewer unnecessary network operations" },
  ],
};

/**
 * Snapshot of the current role. Role details stay compact so the numbers lead —
 * the timeline beside it carries the full story.
 */
export function ExperienceSummary({ item }: { item: ExperienceItem }) {
  const metrics = ROLE_METRICS[item.id];
  const metricsLabelId = `${item.id}-impact-label`;

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-soft sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="flex items-center gap-2.5 font-mono text-xs tracking-[0.14em] text-subtle uppercase">
          <span aria-hidden="true" className="size-2 shrink-0 animate-pulse-dot rounded-full bg-current text-accent-2" />
          Now
        </p>
        <ExperiencePeriod item={item} className="font-mono text-xs text-subtle" />
      </div>

      <p className="mt-5 text-lg font-semibold tracking-tight text-fg">{item.role}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        <span className="font-medium text-fg">{item.company}</span>
        {item.client ? (
          <>
            <span aria-hidden="true"> · </span>
            <span className="sr-only">, </span>
            Client: {item.client}
          </>
        ) : null}
      </p>

      {metrics ? (
        <div className="mt-6 border-t border-line pt-6">
          <p id={metricsLabelId} className="font-mono text-[0.6875rem] tracking-[0.14em] text-subtle uppercase">
            Impact
          </p>
          {/* Rows on phones and in the narrow sticky column; three columns on tablets. */}
          <ul
            aria-labelledby={metricsLabelId}
            className="mt-4 grid gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-1 lg:gap-4"
          >
            {metrics.map((metric) => (
              <li
                key={metric.label}
                className="flex items-baseline gap-4 sm:flex-col sm:gap-1.5 lg:flex-row lg:gap-4"
              >
                <span className="w-[4.75rem] shrink-0 text-3xl font-semibold tracking-tight text-fg tabular-nums sm:w-auto lg:w-[4.75rem]">
                  {metric.value}
                </span>
                <span className="text-sm leading-snug text-muted">{metric.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 border-t border-line pt-5">
        <ArrowLink
          href={profile.links.resume}
          download={profile.links.resumeFileName}
          plain
          leadingIcon={<Download aria-hidden="true" className="text-muted" />}
          className="text-sm"
        >
          Download full résumé <span className="font-normal text-subtle">(PDF)</span>
        </ArrowLink>
      </div>
    </div>
  );
}
