"use client";

import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { ModeCue } from "@/components/mode/ModeCue";
import { ButtonLink } from "@/components/shared/Button";
import { freelanceHero, SECTION_IDS } from "@/data/site";
import { cn } from "@/lib/cn";
import { HeroComposer } from "./HeroComposer";

/** CSS-only entrance for above-the-fold content (runs before hydration). */
const RISE = "animate-rise motion-reduce:[animation-delay:0ms]!";

function delay(ms: number): CSSProperties {
  return { animationDelay: `${ms}ms` };
}

/** Freelance landing: what I build, for whom, and how to start — in one glance. */
export function FreelanceHero() {
  const { eyebrow, headline, intro, primaryCta, secondaryCta } = freelanceHero;

  return (
    <section
      id={SECTION_IDS.freelance.hero}
      aria-labelledby="hero-title"
      className={cn(
        "relative isolate overflow-hidden pt-[calc(var(--header-h)+3rem)] pb-16 sm:pt-[calc(var(--header-h)+4rem)] sm:pb-20",
        "lg:flex lg:min-h-[min(100svh,68rem)] lg:flex-col lg:justify-center lg:pt-[calc(var(--header-h)+2.5rem)]",
      )}
    >
      {/* The only texture: a faint hairline grid, faded radially. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-fade-radial opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
      </div>

      <div className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-7">
            <p
              className={cn(RISE, "flex items-center gap-3 font-mono text-xs tracking-[0.16em] text-muted uppercase")}
              style={delay(0)}
            >
              <span aria-hidden="true" className="size-2 shrink-0 animate-pulse-dot rounded-full bg-current text-accent-2" />
              <span>{eyebrow}</span>
            </p>

            <h1
              id="hero-title"
              className={cn(
                RISE,
                "mt-7 font-display text-[3.1rem] leading-[0.92] font-semibold tracking-[-0.045em] text-fg sm:text-7xl lg:text-[5.6rem] xl:text-[6.5rem]",
              )}
              style={delay(80)}
            >
              <span className="block text-muted">{headline.question}</span>{" "}
              <span className="mt-1 block">
                {headline.answerLead}{" "}
                <span className="relative inline-block text-accent-text">
                  {headline.answerEmphasis}
                  <HeroScribble />
                </span>
              </span>
            </h1>

            <p
              className={cn(RISE, "mt-8 max-w-xl text-lg leading-relaxed text-muted sm:text-xl")}
              style={delay(180)}
            >
              {intro}
            </p>

            <div className={cn(RISE, "mt-9 flex flex-wrap gap-3")} style={delay(260)}>
              <ButtonLink
                href={primaryCta.href}
                size="lg"
                className="group w-full sm:w-auto"
                trailingIcon={
                  <ArrowRight
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1"
                  />
                }
              >
                {primaryCta.label}
              </ButtonLink>
              <ButtonLink href={secondaryCta.href} variant="secondary" size="lg" className="w-full sm:w-auto">
                {secondaryCta.label}
              </ButtonLink>
            </div>

            <div className={cn(RISE, "mt-8")} style={delay(340)}>
              <ModeCue />
            </div>
          </div>

          <div className={cn(RISE, "min-w-0 lg:col-span-5")} style={delay(220)}>
            <HeroComposer />
          </div>
        </div>

        <div className={cn(RISE, "mt-16 lg:mt-20")} style={delay(420)}>
          <StackMarquee items={freelanceHero.stack} />
        </div>
      </div>
    </section>
  );
}

/** Hand-drawn stroke under "product." — drawn once with CSS (@starting-style); static with reduced motion. */
function HeroScribble() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 240 20"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -bottom-[0.12em] left-0 h-[0.2em] w-full overflow-visible text-accent-2"
    >
      <path
        d="M4 13C52 6 104 4.5 152 6.5c30 1.2 58 3.8 84 7.5"
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={3.2}
        strokeLinecap="round"
        className="[stroke-dasharray:1] transition-[stroke-dashoffset] delay-[700ms] duration-[1200ms] ease-out-expo starting:[stroke-dashoffset:1] motion-reduce:delay-0"
      />
    </svg>
  );
}

/**
 * Selected stack as a slow marquee (pauses on hover). The first list is the
 * accessible one; the duplicate exists only to make the loop seamless.
 * Reduced motion: no animation, the list simply wraps.
 */
function StackMarquee({ items }: { items: readonly string[] }) {
  const renderItems = () =>
    items.map((item) => (
      <li key={item} className="flex items-center gap-4 pr-4 font-mono text-sm whitespace-nowrap text-muted">
        <span>{item}</span>
        <span aria-hidden="true" className="size-1 rotate-45 bg-line-strong motion-reduce:hidden" />
      </li>
    ));

  return (
    <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:gap-8">
      <p className="shrink-0 font-mono text-xs tracking-[0.16em] text-subtle uppercase">Stack</p>
      <div className="group relative min-w-0 flex-1 overflow-hidden mask-fade-x motion-reduce:[mask-image:none]">
        <div
          className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:w-auto motion-reduce:animate-none"
          style={{ "--marquee-duration": "42s" } as CSSProperties}
        >
          <ul
            aria-label="Technologies"
            className="flex shrink-0 items-center motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:gap-y-2"
          >
            {renderItems()}
          </ul>
          <ul aria-hidden="true" className="flex shrink-0 items-center motion-reduce:hidden">
            {renderItems()}
          </ul>
        </div>
      </div>
    </div>
  );
}
