"use client";

import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/BrandIcons";
import { ContactCopyButton } from "@/components/shared/ContactCopyButton";
import { Reveal } from "@/components/shared/Reveal";
import { profile } from "@/data/profile";
import { freelanceClosing, SECTION_IDS } from "@/data/site";
import { handleAnchorClick } from "@/lib/scroll";

const SECTION_ID = SECTION_IDS.freelance.talk;
const TITLE_ID = `${SECTION_ID}-title`;
const MARQUEE = ["Mobile apps", "Backend & APIs", "Web products", "Offline-first", "Flutter", "Django"] as const;

/**
 * Freelance · closing — the memorable last word: a solid violet panel (the
 * freelance brand colour, no gradient), giant display type and every contact
 * option one tap away. White on #6d4aff passes WCAG AA for body text.
 */
export function FreelanceClosingSection() {
  return (
    <section id={SECTION_ID} aria-labelledby={TITLE_ID} className="relative pb-24 sm:pb-32">
      <div className="container-page">
        <Reveal className="relative isolate overflow-hidden rounded-[36px] bg-primary px-6 pt-14 pb-0 text-white shadow-float sm:px-12 sm:pt-20 lg:px-16 lg:pt-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60 [--line:rgb(255_255_255/0.07)] [mask-image:radial-gradient(ellipse_at_top_right,#000_15%,transparent_70%)]"
          />

          <p className="flex items-center gap-3 font-mono text-xs tracking-[0.16em] text-white/80 uppercase">
            <span aria-hidden="true" className="size-2 shrink-0 animate-pulse-dot rounded-full bg-current text-[#34d399]" />
            {freelanceClosing.eyebrow}
          </p>

          <h2 id={TITLE_ID} className="mt-6 font-display font-semibold tracking-[-0.045em]">
            <span className="block text-[clamp(2rem,5vw,3.75rem)] leading-[1] text-white/75">{freelanceClosing.question}</span>
            <span className="mt-1 block text-[clamp(3rem,14vw,11rem)] leading-[0.88]">{freelanceClosing.answer}</span>
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
            <p className="max-w-md text-lg leading-relaxed text-white/90 lg:col-span-5">{freelanceClosing.description}</p>

            <div className="flex flex-col gap-4 lg:col-span-7 lg:items-end">
              <div className="flex w-full flex-wrap items-center gap-3 lg:justify-end">
                <a
                  href={`mailto:${profile.email}`}
                  className="group/mail inline-flex min-h-14 w-full max-w-full min-w-0 items-center gap-3 rounded-full bg-white py-3 pr-6 pl-5 text-sm font-semibold sm:w-auto text-[#2a1a7a] shadow-card transition-[scale,background-color] duration-200 hover:bg-white/90 active:scale-[0.98] sm:text-lg"
                >
                  <Mail
                    aria-hidden="true"
                    className="size-5 shrink-0 transition-transform duration-300 ease-out-expo group-hover/mail:-translate-y-0.5"
                  />
                  <span className="min-w-0 break-words">
                    {/* Break after the "@" if it ever has to wrap — never mid-domain. */}
                    {profile.email.split("@")[0]}@<wbr />
                    {profile.email.split("@")[1]}
                  </span>
                </a>
                <ContactCopyButton value={profile.email} label="Copy email address" />
              </div>

              <ul aria-label="Other ways to reach me" className="flex flex-wrap gap-2 lg:justify-end">
                <li>
                  <PanelLink href={profile.links.linkedin} label="LinkedIn" external icon={<LinkedInIcon aria-hidden="true" />} />
                </li>
                <li>
                  <PanelLink href={profile.links.github} label="GitHub" external icon={<GitHubIcon aria-hidden="true" />} />
                </li>
                <li>
                  <PanelLink href={`#${SECTION_IDS.freelance.inquiry}`} label="Send a project brief" icon={<ArrowUp aria-hidden="true" />} />
                </li>
              </ul>
            </div>
          </div>

          {/* Decorative service marquee along the bottom edge (static with reduced motion). */}
          <div aria-hidden="true" className="relative mt-14 -mx-6 overflow-hidden border-t border-white/15 py-6 sm:-mx-12 lg:-mx-16">
            <div
              className="flex w-max animate-marquee motion-reduce:animate-none"
              style={{ "--marquee-duration": "38s" } as CSSProperties}
            >
              {[0, 1].map((copy) => (
                <ul key={copy} className="flex shrink-0 items-center">
                  {MARQUEE.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-8 pr-8 font-display text-4xl font-semibold tracking-[-0.03em] whitespace-nowrap text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.45)] sm:text-5xl"
                    >
                      {item}
                      <span className="size-2 rotate-45 bg-white/40" />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PanelLink({
  href,
  label,
  icon,
  external,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(event) => {
        if (href.startsWith("#")) handleAnchorClick(event);
      }}
      className="group/pl inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-4 text-sm font-medium text-white transition-colors hover:border-white/60 hover:bg-white/10 focus-visible:outline-white [&_svg]:size-4"
    >
      {icon}
      {label}
      {external ? (
        <>
          <span className="sr-only"> (opens in a new tab)</span>
          <ArrowUpRight
            aria-hidden="true"
            className="text-white/70 transition-transform group-hover/pl:translate-x-0.5 group-hover/pl:-translate-y-0.5"
          />
        </>
      ) : null}
    </a>
  );
}
