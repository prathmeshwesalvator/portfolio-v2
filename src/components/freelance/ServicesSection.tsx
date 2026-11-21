"use client";

import { Check } from "lucide-react";
import type { PointerEvent } from "react";
import { ArrowLink } from "@/components/shared/ArrowLink";
import { ChipList } from "@/components/shared/Chip";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { services } from "@/data/services";
import { SECTION_IDS } from "@/data/site";
import type { Service } from "@/types";

const SECTION_ID = SECTION_IDS.freelance.services;
const TITLE_ID = `${SECTION_ID}-title`;

/** Freelance · 01 — the three services, stated plainly. */
export function ServicesSection() {
  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID}>
      <SectionHeading
        id={TITLE_ID}
        index="01"
        eyebrow="Services"
        title={
          <>
            What I can <em>build for you</em>
          </>
        }
        description="Whether you need an app, the backend behind it, or the whole product — here's where I can help."
      />

      <Stagger as="ul" className="mt-14 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:gap-5">
        {services.map((service) => (
          <StaggerItem as="li" key={service.id} className="flex">
            <ServiceCard service={service} />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-12 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-3">
        <p className="text-muted">Not sure which fits your idea?</p>
        <ArrowLink href={`#${SECTION_IDS.freelance.inquiry}`}>Describe it and I&apos;ll suggest an approach</ArrowLink>
      </Reveal>
    </Section>
  );
}

/** Updates the spotlight position via CSS variables — no React re-render per move. */
function trackPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  element.style.setProperty("--x", `${event.clientX - rect.left}px`);
  element.style.setProperty("--y", `${event.clientY - rect.top}px`);
}

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  const titleId = `service-${service.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      onPointerMove={trackPointer}
      className="group relative flex w-full flex-col overflow-hidden rounded-[28px] border border-line bg-surface p-7 shadow-[inset_0_1px_0_0_rgb(255_255_255/0.05)] transition-[border-color,translate] duration-300 ease-out-expo [--x:50%] [--y:0%] hover:-translate-y-1 hover:border-line-strong sm:p-8"
    >
      {/* Pointer-following spotlight (mouse only; hover-capable devices). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(26rem circle at var(--x) var(--y), var(--accent-soft), transparent 45%)" }}
      />

      <div className="relative flex items-start justify-between">
        <span className="font-mono text-sm text-subtle">{service.index}</span>
        <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-text transition-transform duration-500 ease-out-expo group-hover:-rotate-6">
          <Icon aria-hidden="true" className="size-[1.35rem]" strokeWidth={1.75} />
        </span>
      </div>

      <h3
        id={titleId}
        className="relative mt-8 font-display text-2xl leading-tight font-semibold tracking-[-0.02em] text-fg sm:text-[1.75rem]"
      >
        {service.title}
      </h3>
      <p className="relative mt-3 leading-relaxed text-muted">{service.summary}</p>

      <ul className="relative mt-6 flex flex-col gap-2.5">
        {service.deliverables.map((deliverable) => (
          <li key={deliverable} className="flex gap-3 text-[0.95rem] leading-snug text-fg/90">
            <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-accent-2" strokeWidth={2.5} />
            <span className="min-w-0">{deliverable}</span>
          </li>
        ))}
      </ul>

      <div className="relative mt-auto pt-8">
        <div className="border-t border-line pt-5">
          <ChipList items={service.stack} size="xs" mono label={`${service.title} — tech stack`} />
        </div>
      </div>
    </article>
  );
}
