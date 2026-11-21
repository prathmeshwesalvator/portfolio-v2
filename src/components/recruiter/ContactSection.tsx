"use client";

import { Download, FileText, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { ModeCue } from "@/components/mode/ModeCue";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/BrandIcons";
import { Reveal, Stagger, StaggerItem } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { profile } from "@/data/profile";
import { recruiterContact, recruiterHero, SECTION_IDS } from "@/data/site";
import { cn } from "@/lib/cn";
import { ContactMethodCard, type ContactMethod } from "./parts/ContactMethodCard";

const SECTION_ID = SECTION_IDS.recruiter.contact;
const TITLE_ID = `${SECTION_ID}-title`;

/** "Let's Connect" → sans lead + serif-italic accent word, keeping the copy in data/site.ts. */
function splitTitle(title: string): { lead: string; accent: string } {
  const at = title.lastIndexOf(" ");
  return at > 0 ? { lead: title.slice(0, at), accent: title.slice(at + 1) } : { lead: "", accent: title };
}

/** Lets a long address wrap after the "@" rather than mid-word on narrow cards. */
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

const TITLE = splitTitle(recruiterContact.title);
const RESUME = recruiterHero.primaryCta;

const CONTACT_METHODS: readonly ContactMethod[] = [
  {
    id: "email",
    label: "Email",
    value: breakableEmail(profile.email),
    href: recruiterContact.primaryCta.href,
    icon: Mail,
    copy: { value: profile.email, label: "Copy email address" },
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: `in/${profile.links.linkedinHandle}`,
    href: profile.links.linkedin,
    icon: LinkedInIcon,
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    value: `@${profile.links.githubHandle}`,
    href: profile.links.github,
    icon: GitHubIcon,
    external: true,
  },
  {
    id: "resume",
    label: "Résumé",
    value: "PDF download",
    href: RESUME.href,
    icon: FileText,
    download: RESUME.download,
  },
];

/** Pill buttons tuned for the charcoal panel (the shared variants assume page surfaces). */
const PANEL_PILL =
  "group/cta inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-[0.9375rem] font-medium whitespace-nowrap select-none " +
  "transition-[background-color,border-color,scale] duration-200 ease-out active:scale-[0.98] focus-visible:outline-white sm:w-auto " +
  "[&_svg]:size-[1.1rem] [&_svg]:shrink-0";

/** Recruiter · 06 — closing charcoal panel with every contact channel one click away. */
export function RecruiterContactSection() {
  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID} className="pb-24 sm:pb-32">
      <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-primary p-8 text-primary-fg shadow-float inset-shadow-[0_1px_0_0_rgb(255_255_255/0.08)] sm:p-12 lg:p-16">
        {/* Hairline grid texture (white ≈ 6%) fading out from the top-right corner. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(ellipse_at_top_right,#000_10%,transparent_70%)] [--line:rgb(255_255_255/0.06)]"
        />

        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <p className="flex items-center gap-3 font-mono text-xs tracking-[0.16em] text-white/60 uppercase">
              <span className="text-white">06</span>
              <span aria-hidden="true" className="h-px w-8 bg-white/25" />
              <span>{recruiterContact.eyebrow}</span>
            </p>
            <h2
              id={TITLE_ID}
              className="mt-6 text-5xl leading-[0.98] font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl"
            >
              {TITLE.lead ? `${TITLE.lead} ` : null}
              <em className="font-serif text-[1.08em] font-normal tracking-[-0.01em] italic">{TITLE.accent}</em>
            </h2>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-5">
            <p className="max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{recruiterContact.description}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={recruiterContact.primaryCta.href}
                className={cn(PANEL_PILL, "bg-white text-primary shadow-soft hover:bg-white/90")}
              >
                <Mail
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out-expo group-hover/cta:-translate-y-px"
                />
                <span>{recruiterContact.primaryCta.label}</span>
              </a>
              <a
                href={RESUME.href}
                download={RESUME.download}
                className={cn(PANEL_PILL, "border border-white/20 text-white hover:border-white/35 hover:bg-white/[0.06]")}
              >
                <Download
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out-expo group-hover/cta:translate-y-0.5"
                />
                <span>{RESUME.label}</span>
              </a>
            </div>
          </div>
        </div>

        <Stagger
          as="ul"
          aria-label="Contact links"
          className="mt-12 grid gap-3 border-t border-white/10 pt-12 sm:mt-16 sm:grid-cols-2 sm:pt-16 lg:grid-cols-4"
        >
          {CONTACT_METHODS.map((method) => (
            <StaggerItem as="li" key={method.id} className="flex">
              <ContactMethodCard method={method} />
            </StaggerItem>
          ))}
        </Stagger>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 flex justify-center">
        <ModeCue className="justify-center" />
      </Reveal>
    </Section>
  );
}
