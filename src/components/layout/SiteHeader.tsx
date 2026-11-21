"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, Menu } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useMode } from "@/components/mode/ModeProvider";
import { ModeSwitch } from "@/components/mode/ModeSwitch";
import { ButtonLink } from "@/components/shared/Button";
import { Monogram } from "@/components/shared/Monogram";
import { profile } from "@/data/profile";
import { modeMeta, SECTION_IDS } from "@/data/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/cn";
import { snappySpring } from "@/lib/motion";
import { handleAnchorClick } from "@/lib/scroll";
import { MobileMenu } from "./MobileMenu";
import { ScrollProgress } from "./ScrollProgress";

const ROLE_LINE = {
  recruiter: profile.title,
  freelance: "Mobile · APIs · Web",
} as const;

/**
 * Fixed site header shared by both experiences. Same structure in both modes;
 * nav items, CTA and indicator style follow the active experience.
 * The mode switch is visible at every width — it is the key control of the site.
 */
export function SiteHeader() {
  const { mode } = useMode();
  const meta = modeMeta[mode];
  const scrolled = useScrolled(8);
  const active = useActiveSection(meta.nav.map((item) => item.id));
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const cta = meta.headerCta;

  return (
    <>
      <ScrollProgress />
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[var(--header-h)] border-b transition-[background-color,border-color,backdrop-filter] duration-300",
          scrolled ? "border-line bg-bg/80 backdrop-blur-md" : "border-transparent bg-transparent",
        )}
      >
        <div className="container-page flex h-full items-center justify-between gap-3">
          {/* Brand */}
          <a
            href={`#${SECTION_IDS[mode].hero}`}
            onClick={(event) => handleAnchorClick(event)}
            className="group flex min-w-0 shrink-0 items-center gap-3 rounded-xl"
          >
            <Monogram className="size-9 transition-transform duration-300 ease-out-expo group-hover:-rotate-3" />
            <span className="hidden min-w-0 flex-col leading-tight md:flex lg:hidden xl:flex">
              <span className="truncate text-[0.9375rem] font-semibold tracking-tight text-fg">{profile.name}</span>
              <span className="truncate font-mono text-[0.6875rem] tracking-[0.04em] text-subtle">{ROLE_LINE[mode]}</span>
            </span>
            <span className="sr-only md:hidden lg:inline xl:hidden">{profile.name} — back to top</span>
          </a>

          {/* Primary navigation (lg+) */}
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {meta.nav.map((item) => {
                const current = active === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(event) => handleAnchorClick(event)}
                      aria-current={current ? "location" : undefined}
                      className={cn(
                        "relative z-0 inline-flex h-9 items-center rounded-full px-3.5 text-sm transition-colors duration-200",
                        current ? "text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      {current ? (
                        <motion.span
                          layoutId={`nav-indicator-${mode}`}
                          transition={snappySpring}
                          aria-hidden="true"
                          className={cn(
                            "absolute -z-10 rounded-full",
                            mode === "recruiter"
                              ? "inset-0 border border-line bg-surface shadow-soft"
                              : "inset-x-0 bottom-0.5 mx-auto size-1 bg-accent-text",
                          )}
                        />
                      ) : null}
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ModeSwitch size="sm" layoutId="mode-switch-header" />
            <ButtonLink
              href={cta.href}
              download={cta.download}
              size="sm"
              variant="primary"
              className="max-sm:hidden"
              leadingIcon={cta.download ? <Download aria-hidden="true" /> : undefined}
              trailingIcon={cta.download ? undefined : <ArrowRight aria-hidden="true" />}
            >
              {cta.label}
            </ButtonLink>
            <button
              ref={menuButtonRef}
              type="button"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface text-fg shadow-soft transition-colors hover:border-line-strong lg:hidden"
            >
              <Menu aria-hidden="true" className="size-[1.125rem]" />
            </button>
          </div>
        </div>
      </header>

      {/* Sibling of <header> (not a child): its backdrop-filter must not become the dialog's containing block. */}
      <MobileMenu id={menuId} open={menuOpen} onClose={() => setMenuOpen(false)} returnFocusRef={menuButtonRef} />
    </>
  );
}
