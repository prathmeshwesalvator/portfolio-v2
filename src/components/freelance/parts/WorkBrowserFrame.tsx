"use client";

import { ArrowDown, ArrowUp, Lock, MousePointer2 } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { cn } from "@/lib/cn";
import type { Project } from "@/types";

/**
 * auto — hover-driven (fine pointers with motion allowed)
 * full — pinned to the bottom of the page by the toggle
 * top  — pinned to the top by the toggle; hover stays suppressed until the pointer leaves
 */
type PreviewState = "auto" | "full" | "top";

/**
 * Browser-framed, full-page screenshot that scrolls itself on hover.
 *
 * The scroll distance is `calc(-100% + 100cqh)`: -100% of the screenshot's own
 * height plus the viewport's height. The viewport is a size container, so `cqh`
 * always equals its current height — the browser keeps it exact on every resize
 * with no ResizeObserver, no layout reads and no re-renders.
 *
 * Enter scrolls slowly (6s) so the page can be read; leaving returns in 1.2s
 * (a transition always uses the duration of the state it is heading to).
 * Touch, keyboard and reduced-motion visitors get the explicit toggle instead —
 * under reduced motion the global CSS rule turns that into an instant jump.
 */
export function WorkBrowserFrame({ project, className }: { project: Project; className?: string }) {
  const viewportId = useId();
  const [preview, setPreview] = useState<PreviewState>("auto");

  const shot = project.images?.fullPage ?? project.images?.hero;
  const live = project.links.find((link) => link.type === "live");
  const host = live ? live.href.replace(/^https?:\/\//, "").replace(/\/+$/, "") : null;
  const isFull = preview === "full";

  return (
    <div className={cn("flex min-w-0 flex-col", className)}>
      {/* Browser chrome — decorative; the real link is the "Visit live site" action. */}
      <div aria-hidden="true" className="flex items-center gap-3 px-1 pb-3 sm:gap-4 sm:px-1.5 sm:pb-4">
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-fg/15" />
          <span className="size-2.5 rounded-full bg-fg/15" />
          <span className="size-2.5 rounded-full bg-fg/15" />
        </span>
        {host ? (
          <span className="mx-auto flex h-8 max-w-sm min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full border border-line bg-surface px-3 font-mono text-xs text-muted">
            <Lock className="size-3 shrink-0 text-subtle" strokeWidth={2.25} />
            <span className="truncate">{host}</span>
          </span>
        ) : (
          <span className="flex-1" />
        )}
        {live ? (
          <span className="flex shrink-0 items-center gap-2 font-mono text-[0.6875rem] tracking-[0.14em] text-accent-2 uppercase">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-current" />
            <span className="hidden sm:inline">Live</span>
          </span>
        ) : null}
      </div>

      {/* Viewport */}
      <div
        id={viewportId}
        onPointerLeave={() => setPreview((current) => (current === "top" ? "auto" : current))}
        className="group/frame relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-bg [container-type:size] lg:aspect-auto lg:min-h-[22rem] lg:flex-1"
      >
        {shot ? (
          <div
            className={cn(
              "absolute inset-x-0 top-0 transition-transform ease-in-out",
              isFull ? "translate-y-[calc(-100%_+_100cqh)] duration-[5000ms]" : "duration-[1200ms]",
              preview === "auto" &&
                "motion-safe:[@media(hover:hover)_and_(pointer:fine)]:group-hover/frame:translate-y-[calc(-100%_+_100cqh)] motion-safe:[@media(hover:hover)_and_(pointer:fine)]:group-hover/frame:duration-[6000ms]",
            )}
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              sizes="(min-width: 1024px) 680px, 95vw"
              placeholder="blur"
              className="block h-auto w-full"
            />
          </div>
        ) : (
          <ProjectVisual variant={project.visual} />
        )}

        {shot ? (
          <>
            {/* Soft scrim so the controls stay legible over any part of the page. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-bg/55 to-transparent"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5 sm:p-3.5">
              <span
                aria-hidden="true"
                className="hidden h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-xs font-medium text-muted shadow-float transition-opacity duration-300 group-hover/frame:opacity-0 motion-safe:[@media(hover:hover)_and_(pointer:fine)]:inline-flex"
              >
                <MousePointer2 className="size-3.5" strokeWidth={2} />
                Hover to scroll
              </span>
              <button
                type="button"
                aria-controls={viewportId}
                onClick={() => setPreview(isFull ? "top" : "full")}
                className="pointer-events-auto ml-auto inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 text-xs font-medium text-fg shadow-float transition-colors duration-200 hover:border-line-strong hover:text-accent-text"
              >
                {isFull ? (
                  <ArrowUp aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
                ) : (
                  <ArrowDown aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
                )}
                {isFull ? "Back to top of page" : "Preview full page"}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
