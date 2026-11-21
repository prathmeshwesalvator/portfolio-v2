"use client";

import { motion, type MotionValue } from "framer-motion";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { EASE_OUT_EXPO } from "@/lib/motion";
import type { Project } from "@/types";

/** Card footprint (w-64 · aspect 4/3) — the index uses it to position and clamp the card. */
export const WORK_PREVIEW_WIDTH = 256;
export const WORK_PREVIEW_HEIGHT = 192;

interface WorkPreviewCardProps {
  projects: readonly Project[];
  activeIndex: number;
  visible: boolean;
  x: MotionValue<number>;
  y: MotionValue<number>;
  rotate: MotionValue<number> | number;
}

/**
 * Pointer-following preview for the work index (fine pointers only, purely decorative).
 * All visuals sit in one vertical strip that slides to the hovered row, so moving
 * between rows reads as a single continuous motion instead of a hard swap.
 */
export function WorkPreviewCard({ projects, activeIndex, visible, x, y, rotate }: WorkPreviewCardProps) {
  return (
    <motion.div
      aria-hidden="true"
      style={{ x, y, rotate }}
      className="pointer-events-none absolute top-0 left-0 z-20 hidden w-64 [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.92 }}
        transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
        className="aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface-2 shadow-float"
      >
        <motion.div
          initial={false}
          animate={{ y: `${-activeIndex * 100}%` }}
          transition={{ duration: 0.65, ease: EASE_OUT_EXPO }}
          className="flex h-full flex-col"
        >
          {projects.map((project) => (
            <div key={project.id} className="relative h-full w-full shrink-0">
              <ProjectVisual variant={project.visual} />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
