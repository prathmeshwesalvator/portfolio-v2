"use client";

import { Download } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { ModeCue } from "@/components/mode/ModeCue";
import { HeroProfileCard } from "@/components/recruiter/parts/HeroProfileCard";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/BrandIcons";
import { ButtonLink } from "@/components/shared/Button";
import { profile } from "@/data/profile";
import { recruiterHero, SECTION_IDS } from "@/data/site";
import { cn } from "@/lib/cn";
import { handleAnchorClick } from "@/lib/scroll";

/**
 * Above-the-fold entrance is pure CSS: it runs before hydration, so the fold
 * never waits on JavaScript. With reduced motion the stagger delay is dropped
 * too, so content appears immediately instead of after a pause.
 */
const RISE = "animate-rise motion-reduce:[animation-delay:0ms]!";

function delay(ms: number): CSSProperties {
  return { animationDelay: `${ms}ms` };
}

/** Brand mark for a social CTA, matched against the verified profile URLs. */
function socialIcon(href: string): ReactNode {
  if (href === profile.links.linkedin) return <LinkedInIcon aria-hidden="true" />;
  if (href === profile.links.github) return <GitHubIcon aria-hidden="true" />;
  return null;
}

/** Recruiter landing: who, what, where now — and the résumé one click away. */
export function RecruiterHero() {
  const { headline, intro, primaryCta, secondaryCtas } = recruiterHero;

  return (
    <section
      id={SECTION_IDS.recruiter.hero}
      aria-labelledby="hero-title"
      className={cn(
        "relative isolate pt-[calc(var(--header-h)+3rem)] pb-16 sm:pt-[calc(var(--header-h)+4.5rem)] sm:pb-24",
        // lg+: fill most of the viewport with the content centred; the bottom padding houses the scroll cue.
        "lg:flex lg:min-h-[min(100svh,64rem)] lg:flex-col lg:justify-center lg:pt-[calc(var(--header-h)+3rem)] lg:pb-28",
      )}
    >
      <HeroBackdrop />

      <div className="container-page">
        {/* Two explicit tracks (fluid copy + fixed card) keep the statement measure predictable. */}
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_26.5rem]">
          <div className="min-w-0">
            <HeroStatus className={RISE} style={delay(0)} />

            {/* The h1 is a modest signature line; the large statement below is a <p>. */}
            <h1
              id="hero-title"
              className={cn(
                RISE,
                "mt-8 flex flex-col gap-0.5 text-lg sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:text-xl",
              )}
              style={delay(80)}
            >
              <span className="font-semibold tracking-tight text-fg">{profile.name}</span>
              <span aria-hidden="true" className="hidden h-px w-6 bg-line-strong sm:block" />
              <span className="sr-only">, </span>
              <span className="text-muted">{profile.title}</span>
            </h1>

            <p
              className={cn(
                RISE,
                "mt-4 text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.035em] text-fg sm:text-6xl lg:text-[3.6rem] xl:text-[4.6rem]",
              )}
              style={delay(160)}
            >
              {headline.lead}{" "}
              <HeroEmphasis text={headline.emphasis} />
            </p>

            <p className={cn(RISE, "mt-6 max-w-xl text-lg leading-relaxed text-muted sm:mt-7")} style={delay(240)}>
              {intro}
            </p>

            <div className={cn(RISE, "mt-8 flex flex-wrap gap-3 sm:mt-9")} style={delay(320)}>
              <ButtonLink
                href={primaryCta.href}
                download={primaryCta.download}
                size="lg"
                leadingIcon={<Download aria-hidden="true" />}
                trailingIcon={
                  <span className="rounded-md bg-primary-fg/15 px-1.5 py-1 font-mono text-[0.625rem] leading-none font-medium tracking-[0.08em]">
                    PDF
                  </span>
                }
                className="w-full sm:w-auto"
              >
                {primaryCta.label}
              </ButtonLink>
              {secondaryCtas.map((cta) => (
                <ButtonLink
                  key={cta.href}
                  href={cta.href}
                  external={cta.external}
                  variant="secondary"
                  size="lg"
                  leadingIcon={socialIcon(cta.href)}
                  // Mobile: the résumé gets its own row, the two profiles share the next one.
                  className="flex-1 sm:flex-none"
                >
                  {cta.label}
                </ButtonLink>
              ))}
            </div>

            <div className={cn(RISE, "mt-7 sm:mt-8")} style={delay(400)}>
              <ModeCue />
            </div>
          </div>

          <HeroProfileCard className={RISE} style={delay(200)} />
        </div>
      </div>

      <HeroScrollCue />
    </section>
  );
}

/**
 * "Currently" status pill. One line where it fits (sm–md, xl+); two calm lines
 * on phones and in the narrower lg column, without a dangling separator.
 * The 17px radius equals half the single-line height (a true pill) and reads as
 * a soft rounded rectangle when the text wraps.
 */
function HeroStatus({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <p
      className={cn(
        "inline-flex max-w-full items-start gap-2.5 rounded-[17px] border border-line bg-surface px-3 py-1.5 text-sm leading-5 shadow-soft",
        className,
      )}
      style={style}
    >
      <span aria-hidden="true" className="mt-1.5 size-2 shrink-0 animate-pulse-dot rounded-full bg-current text-accent-2" />
      <span className="min-w-0">
        <span className="mr-1 font-mono text-[0.6875rem] tracking-[0.14em] text-subtle uppercase max-sm:sr-only">
          Currently
        </span>{" "}
        <span className="font-medium text-fg">{recruiterHero.status}</span>
        <span className="sr-only">, </span>
        <span className="text-muted max-sm:block lg:block xl:inline">
          <span aria-hidden="true" className="max-sm:hidden lg:hidden xl:inline">
            {" · "}
          </span>
          {recruiterHero.statusDetail}
        </span>
      </span>
    </p>
  );
}

/**
 * Serif-italic accent phrase. Only its final word carries the hand-drawn stroke:
 * a single word never wraps, so the stroke sits on one line at every width.
 */
function HeroEmphasis({ text }: { text: string }) {
  const lastSpace = text.lastIndexOf(" ");
  const head = text.slice(0, lastSpace + 1); // keeps the trailing space; "" for a single word
  const tail = text.slice(lastSpace + 1);

  return (
    <em className="font-serif text-[1.06em] font-normal tracking-[-0.01em] italic">
      {head}
      <span className="relative inline-block">
        {tail}
        <HeroUnderline />
      </span>
    </em>
  );
}

/**
 * Accent stroke "drawn" once: a CSS transition from @starting-style (Tailwind
 * `starting:`), so it needs no JS and no extra keyframes. Browsers without
 * @starting-style simply show the finished stroke; reduced motion shows it at once.
 */
function HeroUnderline() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 220 16"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -bottom-[0.22em] left-0 h-[0.32em] w-full overflow-visible text-accent-text"
    >
      <path
        d="M3 11.6C38 6.4 81 3.7 124 4.1c34 .3 63 2.4 93 5.8"
        pathLength={1}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        className="[stroke-dasharray:1] transition-[stroke-dashoffset] delay-[1000ms] duration-[1400ms] ease-out-expo starting:[stroke-dashoffset:1] motion-reduce:delay-0"
      />
    </svg>
  );
}

/** The only texture: a faint hairline grid, faded radially, kept to the upper right. */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-[70%] h-[48rem] w-[48rem] -translate-x-1/2 bg-grid mask-fade-radial opacity-50 lg:left-[72%] lg:h-[56rem] lg:w-[64rem]" />
    </div>
  );
}

/** lg+ only: quiet cue aligned to the page container's left edge. */
function HeroScrollCue() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden pb-7 lg:block">
      <div className="container-page">
        <a
          href={`#${SECTION_IDS.recruiter.highlights}`}
          onClick={(event) => handleAnchorClick(event)}
          aria-label="Scroll to engineering highlights"
          className="group pointer-events-auto inline-flex animate-fade items-center gap-3 py-1 pr-2 motion-reduce:[animation-delay:0ms]!"
          style={delay(900)}
        >
          <span aria-hidden="true" className="relative h-10 w-px overflow-hidden bg-line-strong">
            <span className="absolute inset-0 animate-scroll-cue bg-fg/60" />
          </span>
          <span
            aria-hidden="true"
            className="font-mono text-[0.6875rem] tracking-[0.16em] text-subtle uppercase transition-colors group-hover:text-fg"
          >
            Scroll
          </span>
        </a>
      </div>
    </div>
  );
}
