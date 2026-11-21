import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Recruiter "engineering drawing" primitives — the details that separate the
 * recruiter language (spec sheets, figures, registration marks) from the
 * freelance bento/spotlight language. All decorative.
 */

/** Four L-shaped registration marks in the corners of a `relative` parent. */
export function CornerTicks({ className, size = "md" }: { className?: string; size?: "sm" | "md" }) {
  const box = size === "sm" ? "size-2.5" : "size-3.5";
  const base = cn("pointer-events-none absolute border-line-strong", box);
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <span className={cn(base, "top-2 left-2 border-t border-l")} />
      <span className={cn(base, "top-2 right-2 border-t border-r")} />
      <span className={cn(base, "bottom-2 left-2 border-b border-l")} />
      <span className={cn(base, "right-2 bottom-2 border-r border-b")} />
    </span>
  );
}

/** Mono figure caption, e.g. "FIG. 01 — Anatomy of a Flutter app". */
export function FigureLabel({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return (
    <p
      aria-hidden="true"
      className={cn("flex items-center gap-2 font-mono text-[0.625rem] tracking-[0.16em] text-subtle uppercase", className)}
    >
      {index ? <span className="text-accent-text">FIG. {index}</span> : null}
      {index ? <span className="h-px w-4 bg-line-strong" /> : null}
      <span className="truncate">{children}</span>
    </p>
  );
}

/** Small mono label used for spec-sheet keys ("Employer", "Client", "Stack"). */
export const SPEC_LABEL = "font-mono text-[0.6875rem] tracking-[0.16em] text-subtle uppercase";
