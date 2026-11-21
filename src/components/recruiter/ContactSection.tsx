"use client";

import { ArrowDown, ArrowUpRight, Download, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { ModeCue } from "@/components/mode/ModeCue";
import { ButtonLink } from "@/components/shared/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { profile } from "@/data/profile";
import { recruiterContact, recruiterHero, SECTION_IDS } from "@/data/site";
import { cn } from "@/lib/cn";
import { CornerTicks } from "./parts/Blueprint";
import { ContactCopyButton } from "@/components/shared/ContactCopyButton";

const SECTION_ID = SECTION_IDS.recruiter.contact;
const TITLE_ID = `${SECTION_ID}-title`;
const RESUME = recruiterHero.resumeCta;

/** Lets a long address wrap after the "@" rather than mid-word on narrow screens. */
function breakableEmail(email: string): ReactNode {
  const at = email.indexOf("@");
  if (at < 0) return email;
  return (
    <>
      {email.slice(0, at + 1)}
      <wbr />
      {email.slice(at + 1)}
    </>
  );
}

interface ContactRowData {
  id: string;
  label: string;
  value: ReactNode;
  href: string;
  external?: boolean;
  download?: string;
  copy?: { value: string; label: string };
}

const ROWS: readonly ContactRowData[] = [
  {
    id: "email",
    label: "Email",
    value: breakableEmail(profile.email),
    href: recruiterContact.primaryCta.href,
    copy: { value: profile.email, label: "Copy email address" },
  },
  { id: "linkedin", label: "LinkedIn", value: `in/${profile.links.linkedinHandle}`, href: profile.links.linkedin, external: true },
  { id: "github", label: "GitHub", value: `@${profile.links.githubHandle}`, href: profile.links.github, external: true },
  { id: "resume", label: "Résumé", value: "Download PDF", href: RESUME.href, download: RESUME.download },
];

/** Recruiter · 06 — the closing statement, with every channel one click away. */
export function RecruiterContactSection() {
  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID} className="pb-24 sm:pb-32">
      <Reveal className="relative isolate overflow-hidden rounded-[2rem] border border-line bg-surface px-6 py-12 sm:p-12 lg:p-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-blueprint opacity-20 [mask-image:radial-gradient(ellipse_at_top_right,#000_10%,transparent_65%)]" />
          <div className="absolute -bottom-48 -left-32 size-[34rem] animate-glow rounded-full bg-accent/[0.1] blur-[110px]" />
        </div>
        <CornerTicks />

        <p className="flex items-center gap-4 font-mono text-xs tracking-[0.16em] text-subtle uppercase">
          <span className="text-accent-text">06</span>
          <span className="text-fg/80">{recruiterContact.eyebrow}</span>
          <span aria-hidden="true" className="h-px flex-1 bg-line" />
          <span className="hidden sm:inline">{recruiterHero.timezone}</span>
        </p>

        <h2
          id={TITLE_ID}
          className="mt-8 max-w-5xl text-[clamp(2.75rem,7.5vw,6.25rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-fg sm:mt-10"
        >
          {recruiterContact.title.lead}{" "}
          <em className="font-serif font-normal tracking-[-0.02em] text-accent-text italic">
            {recruiterContact.title.emphasis}
          </em>
        </h2>

        <div className="mt-12 grid gap-12 sm:mt-14 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-8 lg:col-span-5">
            <p className="max-w-md text-lg leading-relaxed text-muted">{recruiterContact.description}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink
                href={recruiterContact.primaryCta.href}
                size="lg"
                className="group/cta w-full sm:w-auto"
                leadingIcon={
                  <Mail
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-out-expo group-hover/cta:-translate-y-px"
                  />
                }
              >
                {recruiterContact.primaryCta.label}
              </ButtonLink>
              <ButtonLink
                href={RESUME.href}
                download={RESUME.download}
                variant="secondary"
                size="lg"
                className="group/dl w-full sm:w-auto"
                leadingIcon={
                  <Download
                    aria-hidden="true"
                    className="transition-transform duration-300 ease-out-expo group-hover/dl:translate-y-0.5"
                  />
                }
              >
                {RESUME.label}
              </ButtonLink>
            </div>
          </div>

          <Stagger as="ul" aria-label="Contact links" className="lg:col-span-7">
            {ROWS.map((row) => (
              <StaggerItem as="li" key={row.id} className="flex">
                <ContactRow row={row} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 flex justify-center">
        <ModeCue className="justify-center" />
      </Reveal>
    </Section>
  );
}

/**
 * Editorial contact row. The whole row is clickable through a stretched ::after
 * on the link, while the copy button sits above it (z-10) — so no interactive
 * element is ever nested inside the anchor.
 */
function ContactRow({ row }: { row: ContactRowData }) {
  const Arrow = row.download ? ArrowDown : ArrowUpRight;

  return (
    <div
      className={cn(
        // Phones: a 2×2 grid (label + copy, then value + arrow). sm+: one flex row.
        "group/row relative isolate grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 border-b border-line py-5 sm:flex sm:gap-6 sm:py-6 lg:gap-4",
        "before:absolute before:inset-y-0 before:-right-3 before:-left-3 before:-z-10 before:origin-left before:scale-x-0 before:rounded-xl before:bg-surface-2 before:transition-transform before:duration-500 before:ease-out-expo hover:before:scale-x-100",
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-[var(--ring)]",
      )}
    >
      <span aria-hidden="true" className="col-start-1 row-start-1 shrink-0 font-mono text-[0.6875rem] tracking-[0.16em] text-subtle uppercase sm:w-24 lg:w-20">
        {row.label}
      </span>
      <a
        href={row.href}
        download={row.download}
        {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="col-start-1 row-start-2 min-w-0 flex-1 text-lg font-semibold tracking-[-0.02em] text-fg outline-hidden break-words transition-colors group-hover/row:text-accent-text after:absolute after:inset-0 sm:text-2xl lg:text-xl xl:text-[1.375rem]"
      >
        <span className="sr-only">{row.label}: </span>
        {row.value}
        {row.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
      {row.copy ? (
        <span className="col-start-2 row-start-1 flex justify-end">
          <ContactCopyButton value={row.copy.value} label={row.copy.label} />
        </span>
      ) : null}
      <Arrow
        aria-hidden="true"
        className={cn(
          "col-start-2 row-start-2 size-5 shrink-0 justify-self-end text-subtle transition-[translate,color] duration-300 ease-out-expo group-hover/row:text-accent-text",
          row.download ? "group-hover/row:translate-y-0.5" : "group-hover/row:translate-x-0.5 group-hover/row:-translate-y-0.5",
        )}
      />
    </div>
  );
}
