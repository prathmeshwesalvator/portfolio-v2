"use client";

import { ArrowRight } from "lucide-react";
import { modeCue } from "@/data/site";
import { cn } from "@/lib/cn";
import { originFromElement, useMode } from "./ModeProvider";

/**
 * "Have a project in mind? See the freelance view →" — a gentle cross-link to
 * the other experience. Place it once per hero.
 */
export function ModeCue({ className }: { className?: string }) {
  const { mode, switchMode } = useMode();
  const target = mode === "recruiter" ? "freelance" : "recruiter";
  const cue = modeCue[mode];

  return (
    <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted", className)}>
      <span>{cue.text}</span>
      <button
        type="button"
        onClick={(event) => switchMode(target, { origin: originFromElement(event.currentTarget) })}
        className="group/cue inline-flex items-center gap-1 font-medium text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent-text hover:decoration-current"
      >
        {cue.action}
        <ArrowRight aria-hidden="true" className="size-3.5 transition-transform duration-200 group-hover/cue:translate-x-0.5" />
      </button>
    </p>
  );
}
