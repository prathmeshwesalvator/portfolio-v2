import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionProps {
  /** Section id (anchor target) — use the ids from SECTION_IDS in data/site.ts. */
  id: string;
  /** id of the visible heading inside the section. */
  labelledBy: string;
  children: ReactNode;
  className?: string;
  /** Set false to manage the container yourself (full-bleed layouts). */
  contained?: boolean;
  containerClassName?: string;
}

/**
 * Standard section wrapper: semantic <section>, consistent vertical rhythm,
 * anchor offset for the sticky header, page container.
 */
export function Section({ id, labelledBy, children, className, contained = true, containerClassName }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("relative py-20 sm:py-28 lg:py-32", className)}>
      {contained ? <div className={cn("container-page", containerClassName)}>{children}</div> : children}
    </section>
  );
}
