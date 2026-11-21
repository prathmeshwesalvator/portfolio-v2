"use client";

import type { ExperienceItem } from "@/types";

/** Splits "Feb 2026 — Present" into its two halves (em/en dash or hyphen, spaced). */
function splitPeriod(period: string): readonly [string, string] | null {
  const parts = period.split(/\s+[—–-]\s+/);
  return parts.length === 2 ? [parts[0], parts[1]] : null;
}

interface ExperiencePeriodProps {
  item: Pick<ExperienceItem, "start" | "end" | "period">;
  className?: string;
}

/**
 * Human-readable period backed by machine-readable <time> elements.
 * The visual dash is decorative; screen readers hear "Feb 2026 to Present".
 */
export function ExperiencePeriod({ item, className }: ExperiencePeriodProps) {
  const range = splitPeriod(item.period);

  if (!range) {
    return (
      <p className={className}>
        <time dateTime={item.start}>{item.period}</time>
      </p>
    );
  }

  const [from, to] = range;
  return (
    <p className={className}>
      <time dateTime={item.start}>{from}</time>
      <span aria-hidden="true"> — </span>
      <span className="sr-only"> to </span>
      {item.end ? <time dateTime={item.end}>{to}</time> : <span>{to}</span>}
    </p>
  );
}
