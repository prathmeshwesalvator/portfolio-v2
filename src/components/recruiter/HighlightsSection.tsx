"use client";

import { Check } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { engineeringHighlights } from "@/data/highlights";
import { SECTION_IDS } from "@/data/site";
import type { EngineeringHighlight } from "@/types";

const SECTION_ID = SECTION_IDS.recruiter.highlights;
const TITLE_ID = `${SECTION_ID}-title`;

/** The intro counts the cards, so it stays true if highlights are added or removed. */
const COUNT_WORDS: Readonly<Record<number, string>> = { 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six" };
const countWord = COUNT_WORDS[engineeringHighlights.length];
const DESCRIPTION = `${countWord ? `${countWord} strengths` : "Strengths"} proven in production work on enterprise Flutter apps.`;

/** Recruiter 01 — the four engineering strengths, each backed by a résumé fact. */
export function HighlightsSection() {
  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID}>
      <SectionHeading
        id={TITLE_ID}
        index="01"
        eyebrow="Engineering highlights"
        title={
          <>
            What I bring to a <em>mobile team</em>
          </>
        }
        description={DESCRIPTION}
      />

      <Stagger as="ul" className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:gap-5 xl:grid-cols-4">
        {engineeringHighlights.map((highlight) => (
          <StaggerItem as="li" key={highlight.id} className="flex">
            <HighlightCard highlight={highlight} />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

function HighlightCard({ highlight }: { highlight: EngineeringHighlight }) {
  const Icon = highlight.icon;

  return (
    <article className="flex w-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-soft transition-[translate,box-shadow,border-color] duration-300 ease-out hover:border-line-strong hover:shadow-card motion-safe:hover:-translate-y-0.5">
      <span aria-hidden="true" className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent-text">
        <Icon className="size-5" strokeWidth={1.75} />
      </span>

      {/* In the 4-up row, reserve two lines so every description starts on the same baseline. */}
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-fg xl:min-h-[2lh]">{highlight.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{highlight.description}</p>

      <p className="mt-6 flex items-start gap-2 border-t border-line pt-4 font-mono text-xs leading-5 text-fg">
        <Check aria-hidden="true" className="mt-[3px] size-3.5 shrink-0 text-accent-2" strokeWidth={2.5} />
        <span>
          <span className="sr-only">Evidence: </span>
          {highlight.evidence}
        </span>
      </p>
    </article>
  );
}
