"use client";

import { ArrowDown, ArrowRight, Clock, Download, MapPin } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { ModeCue } from "@/components/mode/ModeCue";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/BrandIcons";
import { ButtonLink } from "@/components/shared/Button";
import { profile } from "@/data/profile";
import { recruiterHero, SECTION_IDS } from "@/data/site";
import { cn } from "@/lib/cn";
import { handleAnchorClick } from "@/lib/scroll";
import { HeroBlueprint } from "./parts/HeroBlueprint";

/**
 * Above-the-fold entrance is pure CSS: it runs before hydration, so the fold
 * never waits on JavaScript. With reduced motion the stagger delay is dropped.
 */
const RISE = "animate-rise motion-reduce:[animation-delay:0ms]!";

function delay(ms: number): CSSProperties {
  return { animationDelay: `${ms}ms` };
}

/**
 * Recruiter landing — an editorial composition, deliberately different from the
 * freelance split hero: a full-width statement headline, then positioning + CTAs
 * beside an interactive architecture figure, then a strip of verified résumé figures.
 */
export function RecruiterHero() {
  const { headline, positioning, intro, primaryCta, resumeCta } = recruiterHero;

  return (
    <section
      id={SECTION_IDS.recruiter.hero}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-[calc(var(--header-h)+2.5rem)] pb-16 sm:pt-[calc(var(--header-h)+4rem)] sm:pb-20 lg:pb-24"
    >
      <HeroBackdrop />

      <div className="container-page">
        <HeroStatus className={RISE} style={delay(0)} />

        {/* One h1: the signature line (name + title) and the statement headline. */}
        <h1 id="hero-title" className="mt-8 sm:mt-10">
          <span
            className={cn(
              RISE,
              "flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-[0.16em] text-muted uppercase sm:text-[0.8125rem]",
            )}
            style={delay(60)}
          >
            <span className="text-fg">{profile.name}</span>
            <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
            <span className="sr-only">, </span>
            <span>{profile.title}</span>
          </span>
          <span
            className={cn(
              RISE,
              // Balanced wrap: four short lines on phones, two lines from tablets up.
              "mt-5 block text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.94] font-semibold tracking-[-0.05em] text-fg sm:mt-6",
            )}
            style={delay(120)}
          >
            <span className="sr-only">: </span>
            {headline.lead} <HeroEmphasis text={headline.emphasis} />
          </span>
        </h1>

        <div className="mt-12 grid gap-12 sm:mt-14 lg:mt-16 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-14">
          <div className="min-w-0 lg:col-span-5 lg:pt-2">
            <p
              className={cn(RISE, "max-w-xl text-xl leading-snug font-medium tracking-[-0.01em] text-fg sm:text-2xl")}
              style={delay(200)}
            >
              {positioning}
            </p>
            <p className={cn(RISE, "mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg")} style={delay(260)}>
              {intro}
            </p>

            <div className={cn(RISE, "mt-8 flex flex-wrap gap-3")} style={delay(320)}>
              <ButtonLink
                href={primaryCta.href}
                size="lg"
                className="group/cta w-full sm:w-auto"
                trailingIcon={
                  <ArrowRight
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-out-expo group-hover/cta:translate-x-1"
                  />
                }
              >
                {primaryCta.label}
              </ButtonLink>
              <ButtonLink
                href={resumeCta.href}
                download={resumeCta.download}
                variant="secondary"
                size="lg"
                className="group/dl w-full sm:w-auto"
                leadingIcon={
                  <Download
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-out-expo group-hover/dl:translate-y-0.5"
                  />
                }
                trailingIcon={
                  <span className="rounded-md border border-line-strong px-1.5 py-1 font-mono text-[0.625rem] leading-none tracking-[0.08em] text-muted">
                    PDF
                  </span>
                }
              >
                {resumeCta.label}
              </ButtonLink>
            </div>

            <div
              className={cn(RISE, "mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-6")}
              style={delay(380)}
            >
              <SocialLink href={profile.links.linkedin} label="LinkedIn" icon={<LinkedInIcon aria-hidden="true" />} />
              <SocialLink href={profile.links.github} label="GitHub" icon={<GitHubIcon aria-hidden="true" />} />
              <p className="flex w-full flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-xs text-subtle sm:w-auto">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin aria-hidden="true" className="size-3.5 text-accent-text" />
                  <span className="sr-only">Based in </span>
                  {recruiterHero.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock aria-hidden="true" className="size-3.5" />
                  <span className="sr-only">Time zone: </span>
                  {recruiterHero.timezone}
                </span>
              </p>
            </div>

            <div className={cn(RISE, "mt-7")} style={delay(440)}>
              <ModeCue />
            </div>
          </div>

          <div className={cn(RISE, "min-w-0 lg:col-span-7")} style={delay(240)}>
            <HeroBlueprint />
          </div>
        </div>

        <MetricsStrip className={cn(RISE, "mt-14 sm:mt-16 lg:mt-20")} style={delay(520)} />
      </div>
    </section>
  );
}

/** "Currently" status — accurate employment line (no "available" claims). */
function HeroStatus({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <p
      className={cn(
        "inline-flex max-w-full items-start gap-2.5 rounded-[17px] border border-line bg-surface/80 px-3 py-1.5 text-sm leading-5 backdrop-blur-sm",
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
        <span className="text-muted max-sm:block">
          <span aria-hidden="true" className="max-sm:hidden">
            {" · "}
          </span>
          {recruiterHero.statusDetail}
        </span>
      </span>
    </p>
  );
}

/** Serif-italic amber accent; only the final word carries the drawn stroke (never wraps). */
function HeroEmphasis({ text }: { text: string }) {
  const lastSpace = text.lastIndexOf(" ");
  const head = text.slice(0, lastSpace + 1);
  const tail = text.slice(lastSpace + 1);

  return (
    <em className="font-serif text-[1.04em] font-normal tracking-[-0.02em] text-accent-text italic">
      {head}
      <span className="relative inline-block">
        {tail}
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 220 16"
          preserveAspectRatio="none"
          className="pointer-events-none absolute -bottom-[0.12em] left-0 h-[0.18em] w-full overflow-visible text-accent"
        >
          <path
            d="M3 11.6C38 6.4 81 3.7 124 4.1c34 .3 63 2.4 93 5.8"
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            className="[stroke-dasharray:1] transition-[stroke-dashoffset] delay-[900ms] duration-[1400ms] ease-out-expo starting:[stroke-dashoffset:1] motion-reduce:delay-0"
          />
        </svg>
      </span>
    </em>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex min-h-10 items-center gap-2 text-sm font-medium text-fg transition-colors hover:text-accent-text [&_svg]:size-4"
    >
      {icon}
      <span className="underline decoration-line-strong underline-offset-4 transition-colors group-hover:decoration-current">
        {label}
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** Verified résumé figures as a spec strip. */
function MetricsStrip({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={className} style={style}>
      <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
        <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-subtle uppercase">By the numbers</p>
        <a
          href={`#${SECTION_IDS.recruiter.experience}`}
          onClick={(event) => handleAnchorClick(event)}
          className="group inline-flex min-h-10 items-center gap-1.5 font-mono text-[0.6875rem] tracking-[0.16em] text-subtle uppercase transition-colors hover:text-fg"
        >
          Experience
          <ArrowDown aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-y-0.5" />
        </a>
      </div>
      <dl className="mt-2 grid grid-cols-2 border-t border-line lg:grid-cols-4">
        {recruiterHero.metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={cn(
              "flex flex-col gap-3 border-line py-6 pr-4 sm:py-8",
              index % 2 === 1 && "border-l pl-4 sm:pl-6",
              index >= 2 && "border-t lg:border-t-0",
              index === 2 && "lg:border-l lg:pl-6",
              index === 3 && "lg:pl-6",
            )}
          >
            <dt className="order-2 text-sm leading-snug text-muted">
              {metric.label}
              <span className="mt-1 block font-mono text-[0.625rem] tracking-[0.12em] text-subtle uppercase">
                {metric.source}
              </span>
            </dt>
            <dd className="order-1 flex items-baseline gap-1 text-[2.75rem] leading-none font-semibold tracking-[-0.05em] text-fg tabular-nums sm:text-6xl">
              {metric.value}
              {"suffix" in metric ? <span className="text-xl font-normal tracking-normal text-subtle">{metric.suffix}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Blueprint grid on the right, a warm floor light — the recruiter texture. */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-24 right-[-10%] h-[44rem] w-[60rem] bg-blueprint opacity-[0.22] [mask-image:radial-gradient(ellipse_at_70%_30%,#000_15%,transparent_65%)]" />
      <div className="absolute top-[30%] right-[8%] size-[36rem] animate-glow rounded-full bg-accent/[0.07] blur-[120px]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-line-strong to-transparent" />
    </div>
  );
}
