"use client";

import { ArrowRight, ArrowUp, ArrowUpRight, FileText, Mail, Terminal as TerminalIcon } from "lucide-react";
import type { ReactNode } from "react";
import { originFromElement, useMode } from "@/components/mode/ModeProvider";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/BrandIcons";
import { Monogram } from "@/components/shared/Monogram";
import { profile } from "@/data/profile";
import { brand, modeMeta, SECTION_IDS } from "@/data/site";
import { cn } from "@/lib/cn";
import { handleAnchorClick } from "@/lib/scroll";
import { TERMINAL_OPEN_EVENT } from "@/lib/terminal";

export function SiteFooter() {
  const { mode, switchMode } = useMode();
  const target = mode === "recruiter" ? "freelance" : "recruiter";

  return (
    <footer className="border-t border-line">
      <div className="container-page grid gap-12 py-12 sm:py-16 md:grid-cols-12 md:gap-8">
        {/* Brand */}
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <Monogram className="size-10" />
            <div className="leading-tight">
              <p className="font-semibold tracking-tight text-fg">{profile.name}</p>
              <p className="text-sm text-muted">{profile.title}</p>
            </div>
          </div>
          <p
            className={cn(
              "mt-8 max-w-sm text-fg",
              mode === "recruiter"
                ? "font-serif text-3xl leading-tight italic"
                : "font-display text-3xl leading-[1.05] font-semibold tracking-[-0.03em]",
            )}
          >
            {brand.tagline}
          </p>
          <p className="mt-4 font-mono text-xs text-subtle">{profile.location.short}</p>
        </div>

        {/* Contact links */}
        <div className="md:col-span-4">
          <h2 className="font-mono text-xs tracking-[0.16em] text-subtle uppercase">Get in touch</h2>
          <ul className="mt-5 flex flex-col gap-3 text-sm">
            <FooterLink href={`mailto:${profile.email}`} icon={<Mail aria-hidden="true" />}>
              <span className="md:hidden">Email</span>
              <span className="hidden break-all md:inline">{profile.email}</span>
            </FooterLink>
            <FooterLink href={profile.links.linkedin} external icon={<LinkedInIcon aria-hidden="true" />}>
              LinkedIn
            </FooterLink>
            <FooterLink href={profile.links.github} external icon={<GitHubIcon aria-hidden="true" />}>
              GitHub
            </FooterLink>
            <FooterLink
              href={profile.links.resume}
              download={profile.links.resumeFileName}
              icon={<FileText aria-hidden="true" />}
            >
              Résumé (PDF)
            </FooterLink>
          </ul>
        </div>

        {/* Switch view + terminal */}
        <div className="md:col-span-3">
          <h2 className="font-mono text-xs tracking-[0.16em] text-subtle uppercase">Switch view</h2>
          <p className="mt-5 text-sm text-muted">{modeMeta[target].hint}</p>
          <button
            type="button"
            onClick={(event) => switchMode(target, { origin: originFromElement(event.currentTarget) })}
            className="group mt-3 inline-flex min-h-10 items-center gap-1.5 text-sm font-medium text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent-text hover:decoration-current"
          >
            Switch to the {modeMeta[target].label} view
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent(TERMINAL_OPEN_EVENT))}
            aria-label="Open the terminal (shortcut: backtick key)"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface-2 px-4 font-mono text-xs text-muted transition-colors hover:border-line-strong hover:text-fg"
          >
            <TerminalIcon aria-hidden="true" className="size-3.5" />
            Terminal
            <kbd className="rounded border border-line px-1.5 py-0.5 text-[0.625rem] leading-none text-subtle">`</kbd>
          </button>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {brand.copyrightYear} {profile.name}
          </p>
          <p>Built with Next.js, Tailwind CSS &amp; Framer Motion</p>
          <a
            href={`#${SECTION_IDS[mode].hero}`}
            onClick={(event) => handleAnchorClick(event)}
            className="group inline-flex min-h-10 items-center gap-1.5 font-medium text-muted transition-colors hover:text-fg sm:min-h-0"
          >
            Back to top
            <ArrowUp aria-hidden="true" className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  icon,
  external,
  download,
  children,
}: {
  href: string;
  icon: ReactNode;
  external?: boolean;
  download?: string;
  children: ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        download={download}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group inline-flex min-h-8 max-w-full items-center gap-2.5 text-muted transition-colors hover:text-fg [&_svg]:size-4 [&_svg]:shrink-0"
      >
        {icon}
        <span className="min-w-0">{children}</span>
        {external ? (
          <>
            <span className="sr-only"> (opens in a new tab)</span>
            <ArrowUpRight
              aria-hidden="true"
              className="text-subtle transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
            />
          </>
        ) : null}
      </a>
    </li>
  );
}
