"use client";

import { useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from "framer-motion";
import { useId, useRef, useState, type PointerEvent } from "react";
import { Stagger } from "@/components/shared/Reveal";
import { cn } from "@/lib/cn";
import type { Project, ProjectId } from "@/types";
import { WorkIndexRow } from "./WorkIndexRow";
import { WORK_PREVIEW_HEIGHT, WORK_PREVIEW_WIDTH, WorkPreviewCard } from "./WorkPreviewCard";

/** Gap between the pointer and the card's left edge. */
const POINTER_OFFSET_X = 28;
const FOLLOW_SPRING = { stiffness: 260, damping: 32, mass: 0.6 };

interface PreviewState {
  index: number;
  visible: boolean;
}

interface WorkIndexProps {
  projects: readonly Project[];
  /** id of the visible heading that names the list. */
  labelledBy: string;
  className?: string;
}

/**
 * Editorial index of further work: single-open accordion rows with a
 * pointer-following preview card on desktop (mouse only; never on touch).
 */
export function WorkIndex({ projects, labelledBy, className }: WorkIndexProps) {
  const idPrefix = useId();
  const areaRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const [openId, setOpenId] = useState<ProjectId | null>(null);
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, FOLLOW_SPRING);
  const springY = useSpring(y, FOLLOW_SPRING);
  // A slight tilt in the direction of travel — physical, but never more than a few degrees.
  const velocityX = useVelocity(springX);
  const tilt = useTransform(velocityX, [-1600, 0, 1600], [-5, 0, 5]);

  const openIndex = openId ? projects.findIndex((project) => project.id === openId) : -1;
  // The open row already shows its visual in the panel — no floating duplicate over it.
  const previewVisible = preview !== null && preview.visible && preview.index !== openIndex;

  /** Positions the card beside the pointer, clamped so it never leaves the list horizontally. */
  function placeCard(event: PointerEvent<HTMLElement>, immediate: boolean) {
    const area = areaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const maxX = Math.max(rect.width - WORK_PREVIEW_WIDTH, 0);
    const nextX = Math.min(Math.max(event.clientX - rect.left + POINTER_OFFSET_X, 0), maxX);
    const nextY = event.clientY - rect.top - WORK_PREVIEW_HEIGHT / 2;
    if (immediate) {
      x.jump(nextX);
      y.jump(nextY);
      springX.jump(nextX);
      springY.jump(nextY);
    } else {
      x.set(nextX);
      y.set(nextY);
    }
  }

  function hide() {
    setPreview((current) => (current && current.visible ? { ...current, visible: false } : current));
  }

  return (
    <div
      ref={areaRef}
      className={cn("relative", className)}
      onPointerMove={(event) => {
        if (event.pointerType === "mouse" && preview?.visible) placeCard(event, false);
      }}
      onPointerLeave={hide}
    >
      <Stagger as="ol" aria-labelledby={labelledBy} stagger={0.06}>
        {projects.map((project, index) => (
          <WorkIndexRow
            key={project.id}
            project={project}
            index={index}
            idPrefix={idPrefix}
            open={openId === project.id}
            reduceMotion={reduceMotion}
            onToggle={() => setOpenId((current) => (current === project.id ? null : project.id))}
            onPointerEnter={(event) => {
              if (event.pointerType !== "mouse") return;
              placeCard(event, !previewVisible);
              setPreview({ index, visible: true });
            }}
            onPointerLeave={hide}
          />
        ))}
      </Stagger>

      {preview ? (
        <WorkPreviewCard
          projects={projects}
          activeIndex={preview.index}
          visible={previewVisible}
          x={reduceMotion ? x : springX}
          y={reduceMotion ? y : springY}
          rotate={reduceMotion ? 0 : tilt}
        />
      ) : null}
    </div>
  );
}
