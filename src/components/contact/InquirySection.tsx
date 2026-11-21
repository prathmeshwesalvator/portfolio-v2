"use client";

import { Inbox, Mail } from "lucide-react";
import { ArrowLink } from "@/components/shared/ArrowLink";
import { LinkedInIcon } from "@/components/shared/BrandIcons";
import { CopyButton } from "@/components/shared/CopyButton";
import { Reveal } from "@/components/shared/Reveal";
import { Section } from "@/components/shared/Section";
import { profile } from "@/data/profile";
import { freelanceInquiry, SECTION_IDS } from "@/data/site";
import { INQUIRY_DELIVERY, InquiryForm } from "./InquiryForm";

const SECTION_ID = SECTION_IDS.freelance.inquiry;
const TITLE_ID = `${SECTION_ID}-title`;

/** "Let's Build Your Project" → lead + accented last two words (copy stays in data/site.ts). */
function splitTitle(title: string): { lead: string; accent: string } {
  const words = title.split(" ");
  if (words.length < 3) return { lead: "", accent: title };
  return { lead: words.slice(0, -2).join(" "), accent: words.slice(-2).join(" ") };
}

const TITLE = splitTitle(freelanceInquiry.title);

/** Freelance · 05 — the conversion point: a short brief, no account, no tracking. */
export function InquirySection() {
  return (
    <Section id={SECTION_ID} labelledBy={TITLE_ID} className="pb-24 sm:pb-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <p className="flex items-center gap-3 font-mono text-xs tracking-[0.16em] text-subtle uppercase">
            <span className="text-accent-text">05</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
            <span>{freelanceInquiry.eyebrow}</span>
          </p>
          <h2
            id={TITLE_ID}
            className="mt-5 font-display text-5xl leading-[0.95] font-semibold tracking-[-0.04em] text-fg sm:text-6xl"
          >
            {TITLE.lead ? `${TITLE.lead} ` : null}
            <span className="text-accent-text">{TITLE.accent}</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">{freelanceInquiry.description}</p>

          <h3 className="mt-10 font-mono text-xs tracking-[0.16em] text-subtle uppercase">What happens next</h3>
          <ol className="mt-5 flex flex-col gap-4">
            {freelanceInquiry.nextSteps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-xs text-fg">
                  {index + 1}
                </span>
                <span className="pt-0.5 leading-relaxed text-muted">{step}</span>
              </li>
            ))}
          </ol>

          <div className="mt-10 border-t border-line pt-6">
            <p className="text-sm text-muted">Prefer email?</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
              <ArrowLink
                href={`mailto:${profile.email}`}
                plain
                leadingIcon={<Mail aria-hidden="true" className="text-muted" />}
                className="min-w-0 break-all"
              >
                {profile.email}
              </ArrowLink>
              <CopyButton value={profile.email} label="Copy email address" />
            </div>
            <ArrowLink
              href={profile.links.linkedin}
              external
              leadingIcon={<LinkedInIcon aria-hidden="true" className="text-muted" />}
              className="mt-3"
            >
              Message me on LinkedIn
            </ArrowLink>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="min-w-0 lg:col-span-7">
          <div className="rounded-[28px] border border-line bg-surface p-6 shadow-[var(--shadow-lg),inset_0_1px_0_0_rgb(255_255_255/0.05)] sm:p-8">
            <p className="mb-7 flex items-center gap-2 font-mono text-xs text-subtle">
              <Inbox aria-hidden="true" className="size-3.5 shrink-0" />
              {INQUIRY_DELIVERY === "emailjs"
                ? "Sends straight to my inbox."
                : "Opens your email app — nothing is sent automatically."}
            </p>
            <InquiryForm />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
