"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Info } from "lucide-react";
import { useRef, type PointerEvent } from "react";
import { GooglePlayIcon } from "@/components/shared/BrandIcons";
import { ChipList } from "@/components/shared/Chip";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/cn";
import type { Project } from "@/types";
import { CornerTicks, FigureLabel, SPEC_LABEL } from "./Blueprint";
import { DeviceMockup } from "./DeviceMockup";

interface ProjectChapterProps {
  project: Project;
  /** 1-based chapter number. */
  number: number;
  /** Stage on the right from lg up (alternating rhythm down the page). */
  reverse?: boolean;
}

/** Writes a gentle tilt to CSS variables — no React render per pointer move. */
function trackTilt(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  element.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
  element.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
}

function resetTilt(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--ry", "0deg");
  event.currentTarget.style.setProperty("--rx", "0deg");
}

/**
 * Featured project "chapter": an editorial name header, then a sticky stage with
 * an annotated (abstract) device mockup beside the case study. The `project-<id>`
 * id is the anchor target used by the Experience section.
 */
export function ProjectChapter({ project, number, reverse = false }: ProjectChapterProps) {
  const articleId = `project-${project.id}`;
  const titleId = `${articleId}-title`;
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const playLink = project.links.find((link) => link.type === "play-store");
  const index = String(number).padStart(2, "0");

  // Subtle parallax: the device drifts against the scroll while the stage is on screen.
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "end start"] });
  const deviceY = useTransform(scrollYProgress, [0, 1], [36, -36]);

  return (
    <article id={articleId} aria-labelledby={titleId}>
      {/* Chapter header */}
      <Reveal as="header" className="flex flex-col gap-6">
        <div className="flex items-center gap-4 font-mono text-xs tracking-[0.16em] text-subtle uppercase">
          <span className="text-accent-text">P—{index}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
          <span className="hidden text-right sm:inline">{project.context ?? project.kindLabel}</span>
        </div>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-10">
          <hgroup className="min-w-0">
            <h3
              id={titleId}
              className="text-[3.5rem] leading-[0.88] font-semibold tracking-[-0.055em] text-fg sm:text-7xl lg:text-[6.5rem]"
            >
              {project.name}
            </h3>
            <p className="mt-4 font-serif text-2xl text-muted italic sm:text-3xl">{project.tagline}</p>
          </hgroup>
          {playLink ? (
            <a
              href={playLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group/play inline-flex h-12 shrink-0 items-center gap-2.5 self-start rounded-full border border-line-strong bg-surface pr-4 pl-5 text-sm font-medium text-fg transition-colors hover:border-accent/60 md:self-end"
            >
              <GooglePlayIcon aria-hidden="true" className="size-4 text-accent-2" />
              {project.outcome ?? playLink.label}
              <span className="sr-only"> — {project.name} on Google Play (opens in a new tab)</span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4 text-subtle transition-transform duration-300 ease-out-expo group-hover/play:translate-x-0.5 group-hover/play:-translate-y-0.5 group-hover/play:text-accent-text"
              />
            </a>
          ) : null}
        </div>
        <p className="font-mono text-xs text-subtle sm:hidden">{project.context ?? project.kindLabel}</p>
      </Reveal>

      <div className="mt-10 grid gap-10 sm:mt-12 lg:grid-cols-12 lg:gap-12">
        {/* Stage */}
        <div className={cn("min-w-0 lg:col-span-7", reverse && "lg:order-last")}>
          {/* The sticky wrapper is static; only the inner stage animates, so stickiness never fights a transform. */}
          <div className="lg:sticky lg:top-24">
          <Reveal>
            <div
              ref={stageRef}
              onPointerMove={reduceMotion ? undefined : trackTilt}
              onPointerLeave={reduceMotion ? undefined : resetTilt}
              className="group/stage relative isolate flex min-h-[32rem] items-center justify-center overflow-hidden rounded-[2rem] border border-line bg-surface py-14 [--rx:0deg] [--ry:0deg] sm:min-h-[36rem]"
            >
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-blueprint opacity-30 mask-fade-radial" />
                <div className="absolute top-1/2 left-1/2 size-[26rem] -translate-1/2 rounded-full bg-accent/[0.09] blur-[90px]" />
                <span
                  className={cn(
                    "absolute -bottom-10 text-[12rem] leading-none font-semibold tracking-[-0.06em] text-outline select-none sm:text-[15rem]",
                    reverse ? "-left-4" : "-right-4",
                  )}
                >
                  {index}
                </span>
              </div>
              <CornerTicks />
              <FigureLabel index={`P${number}`} className="absolute top-5 left-6">
                {project.tagline}
              </FigureLabel>

              <motion.div style={reduceMotion ? undefined : { y: deviceY }}>
                <div className="transition-transform duration-500 ease-out-expo [transform:perspective(1400px)_rotateX(var(--rx))_rotateY(var(--ry))]">
                  <DeviceMockup projectId={project.id} />
                </div>
              </motion.div>

              <p className="absolute right-6 bottom-5 left-6 text-center font-mono text-[0.625rem] tracking-[0.12em] text-subtle uppercase sm:text-left">
                Illustrative mockup — not the production interface
              </p>
            </div>
          </Reveal>
          </div>
        </div>

        {/* Case study */}
        <Reveal delay={0.08} className="flex min-w-0 flex-col gap-9 lg:col-span-5">
          <div>
            <h4 className={SPEC_LABEL}>Overview</h4>
            <p className="mt-3 text-lg leading-relaxed text-fg sm:text-xl">{project.summary}</p>
          </div>

          {project.challenge ? (
            <div className="border-l-2 border-accent/60 pl-5">
              <h4 className={SPEC_LABEL}>The challenge</h4>
              <p className="mt-2 leading-relaxed text-muted">{project.challenge}</p>
            </div>
          ) : null}

          {project.contributions?.length ? (
            <div>
              <h4 className={SPEC_LABEL}>My contribution</h4>
              <ol className="mt-4 divide-y divide-line border-y border-line">
                {project.contributions.map((item, itemIndex) => (
                  <li key={item} className="flex gap-4 py-3.5 text-[0.95rem] leading-snug text-fg">
                    <span aria-hidden="true" className="w-6 shrink-0 pt-0.5 font-mono text-xs text-accent-text tabular-nums">
                      {String(itemIndex + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {project.solution ? (
            <div>
              <h4 className={SPEC_LABEL}>Engineering approach</h4>
              <p className="mt-3 leading-relaxed text-muted">{project.solution}</p>
            </div>
          ) : null}

          <div>
            <h4 className={SPEC_LABEL}>Stack</h4>
            <ChipList items={project.stack} size="sm" mono label={`${project.name} tech stack`} className="mt-3" />
          </div>

          {project.ownershipNote ? (
            <p className="flex gap-2.5 rounded-xl border border-line bg-surface p-3.5 text-sm leading-relaxed text-muted">
              <Info aria-hidden="true" className="mt-[0.1875rem] size-4 shrink-0 text-subtle" />
              <span className="min-w-0">{project.ownershipNote}</span>
            </p>
          ) : null}
        </Reveal>
      </div>
    </article>
  );
}
