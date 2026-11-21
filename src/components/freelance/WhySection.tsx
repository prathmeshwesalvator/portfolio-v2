"use client";

import { ArrowRight, ArrowUpRight, Info, Layers, MapPin } from "lucide-react";
// Photo temporarily hidden at the owner's request — uncomment (with the <Image> block below) to restore.
// import Image from "next/image";
import { GooglePlayIcon } from "@/components/shared/BrandIcons";
import { ButtonLink } from "@/components/shared/Button";
import { Monogram } from "@/components/shared/Monogram";
import { Stagger, StaggerItem } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { profile } from "@/data/profile";
import { getProject } from "@/data/projects";
import { whyItems } from "@/data/services";
import { SECTION_IDS } from "@/data/site";
import type { ProjectId, WhyItem } from "@/types";
import { WhyIcon, WhyTile } from "./parts/WhyTile";

const SECTION_ID = SECTION_IDS.freelance.why;
const TITLE_ID = `${SECTION_ID}-title`;

/** The why item that carries the Google Play proof row (and spans two columns). */
const PRODUCTION_ID = "production";
const PLAY_STORE_PROJECTS: readonly ProjectId[] = ["tc-pay", "tourpe"];

// Static data — resolved once at module scope. Apps without a verified Play link are skipped.
const playStoreApps = PLAY_STORE_PROJECTS.flatMap((id) => {
  const project = getProject(id);
  const link = project.links.find((item) => item.type === "play-store");
  return link ? [{ id, name: project.name, href: link.href }] : [];
});

const introFacts = [
  { id: "location", icon: MapPin, text: profile.location.short },
  { id: "stack", icon: Layers, text: "Flutter · Django · FastAPI · React" },
] as const;

/**
 * Freelance · 04 — bento grid.
 * lg (3 cols): intro tile fills the first column (3 rows); the production tile spans the
 * top of the remaining two columns; the four remaining tiles form a 2 × 2 block — no holes.
 * sm–md (2 cols): intro and production span both columns, then a 2 × 2 block.
 */
export function WhySection() {
  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID}>
      <SectionHeading
        id={TITLE_ID}
        index="04"
        eyebrow="Why work with me"
        title={
          <>
            Engineering you can <em>rely on</em>
          </>
        }
        description="What you get when you bring me onto your project."
      />

      <Stagger as="ul" className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        <IntroTile />
        {whyItems.map((item) =>
          item.id === PRODUCTION_ID ? <ProductionTile key={item.id} item={item} /> : <ReasonTile key={item.id} item={item} />,
        )}
      </Stagger>
    </Section>
  );
}

function IntroTile() {
  return (
    <StaggerItem
      as="li"
      className="relative isolate flex min-w-0 flex-col overflow-hidden rounded-[28px] border border-line bg-surface p-7 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.05)] sm:col-span-2 lg:col-span-1 lg:row-span-3"
    >
      {/* Hairline grid behind the mark — the one texture the freelance language allows. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -left-16 -z-10 size-80 bg-grid opacity-50 mask-fade-radial"
      />

      {/* Photo temporarily hidden at the owner's request — uncomment to restore. */}
      {/*
      <Image
        src={profile.photoSquare.src}
        alt={profile.photoSquare.alt}
        sizes="80px"
        placeholder="blur"
        className="size-16 rounded-2xl object-cover sm:size-20"
      />
      */}
      <Monogram className="size-16 shrink-0 sm:size-20" />

      {/* Greeting sits with the mark; on lg (three rows tall) the facts + CTA anchor to the bottom. */}
      <h3 className="mt-8 font-display text-3xl leading-[1.05] font-semibold tracking-[-0.03em] text-fg">
        Hi, I&apos;m {profile.firstName}.
      </h3>
      <p className="mt-4 max-w-xl leading-relaxed text-muted">
        I&apos;m a Flutter Software Engineer building production apps for an enterprise travel brand. On freelance
        projects I bring the same standards — clean architecture, careful testing and clear communication.
      </p>

      <div className="mt-8 flex flex-col gap-5 lg:mt-auto lg:pt-10">
        <ul className="flex flex-col gap-2.5 border-t border-line pt-5 font-mono text-xs text-muted">
          {introFacts.map((fact) => {
            const Icon = fact.icon;
            return (
              <li key={fact.id} className="flex min-w-0 items-start gap-2.5">
                <Icon aria-hidden="true" className="mt-px size-3.5 shrink-0 text-subtle" strokeWidth={2} />
                <span className="min-w-0">{fact.text}</span>
              </li>
            );
          })}
        </ul>

        <div className="pt-3">
          <ButtonLink
            href={`#${SECTION_IDS.freelance.inquiry}`}
            trailingIcon={
              <ArrowRight
                aria-hidden="true"
                className="transition-transform duration-200 group-hover/cta:translate-x-0.5"
              />
            }
            className="group/cta"
          >
            Start a project
          </ButtonLink>
        </div>
      </div>
    </StaggerItem>
  );
}

function ProductionTile({ item }: { item: WhyItem }) {
  return (
    <WhyTile className="sm:col-span-2">
      <WhyIcon icon={item.icon} />
      <h3 className="mt-6 font-display text-2xl leading-tight font-semibold tracking-[-0.025em] text-fg sm:text-[1.75rem]">
        {item.title}
      </h3>
      <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted">{item.description}</p>

      {playStoreApps.length > 0 ? (
        <div className="mt-auto pt-6">
          <div className="flex flex-col gap-4 border-t border-line pt-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <p className="inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.14em] text-accent-2 uppercase">
                <span aria-hidden="true" className="size-1.5 animate-pulse-dot rounded-full bg-current" />
                On Google Play
              </p>
              <ul aria-label="Apps on Google Play" className="flex flex-wrap gap-2">
                {playStoreApps.map((app) => (
                  <li key={app.id}>
                    <a
                      href={app.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/app inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface-2 px-4 text-sm font-medium text-fg transition-colors duration-200 hover:border-line-strong hover:text-accent-text"
                    >
                      <GooglePlayIcon aria-hidden="true" className="size-3.5 text-muted" />
                      {app.name}
                      <span className="sr-only"> on Google Play (opens in a new tab)</span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-3.5 text-subtle transition-transform duration-200 group-hover/app:translate-x-0.5 group-hover/app:-translate-y-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <p className="flex gap-2 text-xs leading-relaxed text-subtle">
              <Info aria-hidden="true" className="mt-px size-3.5 shrink-0" />
              <span className="min-w-0">Team products — I contributed modules as part of the Risosu Consultancy team.</span>
            </p>
          </div>
        </div>
      ) : null}
    </WhyTile>
  );
}

function ReasonTile({ item }: { item: WhyItem }) {
  return (
    <WhyTile className="sm:min-h-[15rem]">
      <WhyIcon icon={item.icon} />
      <div className="mt-8 sm:mt-auto sm:pt-10">
        <h3 className="font-display text-xl leading-snug font-semibold tracking-[-0.02em] text-fg">{item.title}</h3>
        <p className="mt-2.5 text-[0.95rem] leading-relaxed text-muted">{item.description}</p>
      </div>
    </WhyTile>
  );
}
