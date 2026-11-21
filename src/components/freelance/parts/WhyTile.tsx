"use client";

import type { PointerEvent, ReactNode } from "react";
import { StaggerItem } from "@/components/shared/Reveal";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/types";

const SPOTLIGHT = "radial-gradient(24rem circle at var(--x, 50%) var(--y, 0%), var(--accent-soft), transparent 40%)";

/** Writes the pointer position to --x/--y on the tile itself — no React re-render per move. */
function trackPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const tile = event.currentTarget;
  const rect = tile.getBoundingClientRect();
  tile.style.setProperty("--x", `${event.clientX - rect.left}px`);
  tile.style.setProperty("--y", `${event.clientY - rect.top}px`);
}

/** Bento tile (<li>) with a pointer-following accent spotlight on fine pointers. */
export function WhyTile({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <StaggerItem
      as="li"
      onPointerMove={trackPointer}
      className={cn(
        "group/why relative isolate flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-line bg-surface p-6 sm:p-7",
        "shadow-[inset_0_1px_0_0_rgb(255_255_255/0.05)] transition-colors duration-300 hover:border-line-strong",
        className,
      )}
    >
      <span
        aria-hidden="true"
        style={{ backgroundImage: SPOTLIGHT }}
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 [@media(hover:hover)_and_(pointer:fine)]:group-hover/why:opacity-100"
      />
      {children}
    </StaggerItem>
  );
}

/** Tinted icon tile with a small hover micro-motion. */
export function WhyIcon({ icon: Icon }: { icon: IconComponent }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-text transition-transform duration-500 ease-out-expo group-hover/why:-translate-y-0.5 group-hover/why:-rotate-6"
    >
      <Icon className="size-5" strokeWidth={1.75} />
    </span>
  );
}
