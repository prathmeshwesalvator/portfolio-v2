"use client";

import { Check } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { engineeringHighlights } from "@/data/highlights";
import { SECTION_IDS } from "@/data/site";
import { useMotionPause } from "@/hooks/useMotionPause";
import { cn } from "@/lib/cn";
import type { CapabilityDiagramKind, EngineeringHighlight } from "@/types";
import { CornerTicks, FigureLabel } from "./parts/Blueprint";
import { CapabilityDiagram } from "./parts/CapabilityDiagram";

const SECTION_ID = SECTION_IDS.recruiter.highlights;
const TITLE_ID = `${SECTION_ID}-title`;

const COUNT_WORDS: Readonly<Record<number, string>> = { 6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten" };
const countWord = COUNT_WORDS[engineeringHighlights.length] ?? String(engineeringHighlights.length);

/** Figure captions — what each diagram shows. */
const FIGURE_CAPTION: Record<CapabilityDiagramKind, string> = {
  "clean-architecture": "Layers & dependencies",
  "offline-first": "Offline → background sync",
  bloc: "Event → state",
  security: "Encryption flow",
  performance: "Startup, before / after",
  native: "Platform bridge",
  "deep-linking": "Cross-app hand-off",
  api: "Request lifecycle",
};

/**
 * Recruiter · 02 — a capability board: each strength is a small engineering
 * figure plus one résumé-backed evidence line. Two feature tiles animate while
 * visible; the six standard tiles animate on hover/focus to keep the page calm.
 */
export function HighlightsSection() {
  const boardRef = useMotionPause<HTMLDivElement>();

  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID} className="border-y border-line bg-surface/40">
      <SectionHeading
        id={TITLE_ID}
        index="02"
        eyebrow="Engineering highlights"
        meta={`${engineeringHighlights.length} capabilities`}
        title={
          <>
            What I bring to a <em>mobile team</em>
          </>
        }
        description={`${countWord} capabilities proven on production enterprise Flutter apps — each one backed by a fact from my résumé.`}
      />

      <div ref={boardRef} className="mt-12 sm:mt-16">
      <Stagger as="ul" stagger={0.06} className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {engineeringHighlights.map((highlight, index) => (
          <StaggerItem
            as="li"
            key={highlight.id}
            className={cn("flex", highlight.size === "feature" ? "lg:col-span-6" : "lg:col-span-4")}
          >
            <CapabilityTile highlight={highlight} index={index} />
          </StaggerItem>
        ))}
      </Stagger>
      </div>
    </Section>
  );
}

function CapabilityTile({ highlight, index }: { highlight: EngineeringHighlight; index: number }) {
  const feature = highlight.size === "feature";
  const titleId = `capability-${highlight.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      data-loop-host=""
      className="group/cap relative flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[border-color,translate] duration-500 ease-out-expo hover:border-line-strong motion-safe:hover:-translate-y-0.5"
    >
      {/* Standard tiles: loops run only while hovered (globals.css), so the board stays calm. */}
      <div
        data-loop={feature ? undefined : "hover"}
        className={cn("relative overflow-hidden border-b border-line bg-bg/50", feature ? "h-52 sm:h-60" : "h-44")}
      >
        <div aria-hidden="true" className="absolute inset-0 bg-blueprint opacity-25 mask-fade-radial" />
        <CornerTicks size="sm" />
        <FigureLabel index={String(index + 1).padStart(2, "0")} className="absolute top-4 left-5">
          {FIGURE_CAPTION[highlight.diagram]}
        </FigureLabel>
        <CapabilityDiagram
          kind={highlight.diagram}
          className={cn(
            "absolute inset-x-5 bottom-4 transition-transform duration-700 ease-out-expo motion-safe:group-hover/cap:scale-[1.02]",
            feature ? "top-11" : "top-10",
          )}
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3
          id={titleId}
          className={cn("font-semibold tracking-[-0.025em] text-fg", feature ? "text-2xl sm:text-[1.75rem]" : "text-xl")}
        >
          {highlight.title}
        </h3>
        <p className={cn("mt-2 mb-5 leading-relaxed text-muted", feature ? "max-w-xl text-[0.95rem]" : "text-sm")}>
          {highlight.description}
        </p>
        <p className="mt-auto flex items-start gap-2 border-t border-line pt-4 font-mono text-xs leading-5 text-fg">
          <Check aria-hidden="true" className="mt-[3px] size-3.5 shrink-0 text-accent-2" strokeWidth={2.5} />
          <span>
            <span className="sr-only">Evidence: </span>
            {highlight.evidence}
          </span>
        </p>
      </div>
    </article>
  );
}
