"use client";

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Stagger, StaggerItem } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { processSteps } from "@/data/services";
import { SECTION_IDS } from "@/data/site";
import { cn } from "@/lib/cn";

const SECTION_ID = SECTION_IDS.freelance.process;
const TITLE_ID = `${SECTION_ID}-title`;
const STEP_COUNT = processSteps.length;
/** Matches Tailwind's `lg` breakpoint — horizontal track from here up. */
const LG_QUERY = "(min-width: 64rem)";

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/** Number of nodes the drawn line has reached (node positions are fractions of the track). */
function countReached(progress: number, fractions: readonly number[]): number {
  if (progress <= 0.001) return 0;
  return fractions.filter((fraction) => progress >= fraction - 0.004).length;
}

/**
 * Freelance · 03 — five steps on a scroll-drawn track.
 * lg+: horizontal track over a 5-column grid. Below lg: vertical timeline with a left rail.
 * One <ol> serves both layouts; the track runs from the first node to the last.
 */
export function ProcessSection() {
  const trackAreaRef = useRef<HTMLDivElement>(null);
  /** Node centres as fractions (0–1) of the track — written by the ResizeObserver, read on scroll. */
  const fractionsRef = useRef<number[]>([]);
  const reduceMotion = useReducedMotion();
  const [reached, setReached] = useState(0);

  // Progress follows the steps themselves (not the whole section), so the line is drawn
  // while it is on screen and its tip stays within the 60–75% band of the viewport.
  const { scrollYProgress } = useScroll({ target: trackAreaRef, offset: ["start 0.75", "end 0.6"] });
  // Revealed with clip-path (not scale) so the gradient stays anchored: violet at
  // "Understand", emerald at "Deliver".
  const clipX = useTransform(scrollYProgress, (value) => `inset(0 ${(1 - clamp01(value)) * 100}% 0 0)`);
  const clipY = useTransform(scrollYProgress, (value) => `inset(0 0 ${(1 - clamp01(value)) * 100}% 0)`);

  // React bails out when the count is unchanged, so state only updates when a node is crossed.
  const syncReached = useCallback((progress: number) => {
    setReached(countReached(progress, fractionsRef.current));
  }, []);

  useMotionValueEvent(scrollYProgress, "change", syncReached);

  // Measure node centres (layout offsets — unaffected by reveal transforms) and size the track.
  useEffect(() => {
    const area = trackAreaRef.current;
    if (!area) return;

    const measure = () => {
      const items = Array.from(area.querySelectorAll<HTMLElement>("ol > li"));
      if (items.length === 0) return;
      const horizontal = window.matchMedia(LG_QUERY).matches;
      const centres = items.map((item) => {
        const node = item.querySelector<HTMLElement>("[data-process-node]");
        if (!node) return horizontal ? item.offsetLeft : item.offsetTop;
        return horizontal
          ? item.offsetLeft + node.offsetLeft + node.offsetWidth / 2
          : item.offsetTop + node.offsetTop + node.offsetHeight / 2;
      });
      const start = centres[0];
      const length = Math.max(centres[centres.length - 1] - start, 1);

      area.style.setProperty("--track-start", `${start}px`);
      area.style.setProperty("--track-length", `${length}px`);
      fractionsRef.current = centres.map((centre) => (centre - start) / length);
      syncReached(scrollYProgress.get());
    };

    // Fires once on observe, then on every resize/breakpoint change.
    const observer = new ResizeObserver(measure);
    observer.observe(area);
    return () => observer.disconnect();
  }, [scrollYProgress, syncReached]);

  const reachedCount = reduceMotion ? STEP_COUNT : reached;

  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID} className="border-y border-line bg-surface/40">
      <SectionHeading
        id={TITLE_ID}
        index="03"
        eyebrow="How I work"
        title={
          <>
            A clear path from <em>idea to launch</em>
          </>
        }
        description="Five steps, no black boxes — you always know where your project stands."
      />

      <div ref={trackAreaRef} className="relative mt-14 sm:mt-16 lg:mt-20">
        {/* Track: vertical rail below lg, horizontal line from lg. Decorative. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute w-px",
            "top-[var(--track-start,1.5rem)] left-[5.5px] h-[var(--track-length,0px)]",
            "lg:top-[5.5px] lg:left-[var(--track-start,6px)] lg:h-px lg:w-[var(--track-length,0px)]",
          )}
        >
          <span className="absolute inset-0 bg-line" />
          <motion.span
            style={{ clipPath: reduceMotion ? "none" : clipY }}
            className="absolute inset-0 bg-linear-to-b from-accent-text to-accent-2 lg:hidden"
          />
          <motion.span
            style={{ clipPath: reduceMotion ? "none" : clipX }}
            className="absolute inset-0 hidden bg-linear-to-r from-accent-text to-accent-2 lg:block"
          />
        </div>

        <Stagger as="ol" stagger={0.09} className="grid gap-y-12 lg:grid-cols-5 lg:gap-x-6 lg:gap-y-0">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            const isReached = index < reachedCount;
            const isFinal = index === STEP_COUNT - 1;
            return (
              <StaggerItem as="li" key={step.index} className="relative min-w-0 pl-10 lg:pt-12 lg:pl-0">
                <span
                  data-process-node=""
                  aria-hidden="true"
                  className={cn(
                    "absolute top-[1.125rem] left-0 size-3 rounded-full border transition-[background-color,border-color,box-shadow] duration-500 lg:top-0",
                    !isReached && "border-line-strong bg-bg",
                    isReached &&
                      (isFinal
                        ? "border-accent-2 bg-accent-2 shadow-[0_0_0_4px_var(--accent-2-soft)]"
                        : "border-accent bg-accent shadow-[0_0_0_4px_var(--accent-soft)]"),
                  )}
                />

                <div className="flex items-center gap-4 lg:justify-between">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "font-display text-5xl leading-none font-semibold tracking-[-0.04em] tabular-nums transition-colors duration-700",
                      isReached ? "text-fg" : "text-fg/15",
                    )}
                  >
                    {step.index}
                  </span>
                  <span
                    aria-hidden="true"
                    className="grid size-11 shrink-0 place-items-center rounded-2xl bg-accent-soft text-accent-text"
                  >
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-fg">{step.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{step.description}</p>
                <p
                  className={cn(
                    "mt-4 inline-flex max-w-full items-start gap-2 rounded-xl border px-3 py-1.5 font-mono text-[0.6875rem] leading-snug transition-colors duration-700",
                    isReached ? "border-line-strong bg-surface text-fg" : "border-line text-muted",
                  )}
                >
                  <span className={cn("shrink-0", isFinal ? "text-accent-2" : "text-accent-text")}>
                    <span aria-hidden="true">→</span>
                    <span className="sr-only">You get:</span>
                  </span>
                  <span className="min-w-0">{step.output}</span>
                </p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </Section>
  );
}
