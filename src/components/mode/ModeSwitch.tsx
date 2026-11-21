"use client";

import { Briefcase, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { modeMeta } from "@/data/site";
import { cn } from "@/lib/cn";
import { snappySpring } from "@/lib/motion";
import { VIEWER_MODES } from "@/lib/viewer";
import type { IconComponent, ViewerMode } from "@/types";
import { originFromElement, useMode } from "./ModeProvider";

const MODE_ICONS: Record<ViewerMode, IconComponent> = {
  recruiter: Briefcase,
  freelance: Sparkles,
};

interface ModeSwitchProps {
  size?: "sm" | "md";
  className?: string;
  /** Unique per rendered instance (shared-layout pill animation). */
  layoutId?: string;
  /** Called right before switching (e.g. to close the mobile menu first). */
  onSelect?: (mode: ViewerMode) => void;
}

/**
 * Segmented control: [ Recruiter ] [ Freelance ].
 * Toggle buttons with aria-pressed inside a labelled group.
 */
export function ModeSwitch({ size = "md", className, layoutId = "mode-switch-pill", onSelect }: ModeSwitchProps) {
  const { mode, switchMode } = useMode();

  return (
    <div
      role="group"
      aria-label="Choose portfolio view"
      className={cn(
        "relative inline-flex items-center rounded-full border border-line bg-surface-2 p-1 shadow-soft",
        className,
      )}
    >
      {VIEWER_MODES.map((option) => {
        const active = option === mode;
        const Icon = MODE_ICONS[option];
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            title={modeMeta[option].hint}
            onClick={(event) => {
              const origin = originFromElement(event.currentTarget);
              if (option !== mode) onSelect?.(option);
              switchMode(option, { origin });
            }}
            className={cn(
              "relative z-0 inline-flex items-center gap-1.5 rounded-full font-medium transition-colors duration-200",
              size === "sm" ? "h-8 px-2.5 text-[0.8125rem]" : "h-9 px-4 text-sm",
              active ? "text-primary-fg" : "text-muted hover:text-fg",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                transition={snappySpring}
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-full bg-primary shadow-soft"
              />
            )}
            <Icon aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
            <span>{modeMeta[option].label}</span>
          </button>
        );
      })}
    </div>
  );
}
