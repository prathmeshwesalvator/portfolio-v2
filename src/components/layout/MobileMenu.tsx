"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight, Download, Mail, X } from "lucide-react";
import { useEffect, useId, useRef, type MouseEvent, type ReactNode, type RefObject } from "react";
import { useMode } from "@/components/mode/ModeProvider";
import { ModeSwitch } from "@/components/mode/ModeSwitch";
import { GitHubIcon, LinkedInIcon } from "@/components/shared/BrandIcons";
import { ButtonLink } from "@/components/shared/Button";
import { Monogram } from "@/components/shared/Monogram";
import { profile } from "@/data/profile";
import { modeMeta, recruiterHero, SECTION_IDS } from "@/data/site";
import { cn } from "@/lib/cn";
import { revealTransition } from "@/lib/motion";
import { scrollToSection } from "@/lib/scroll";

interface MobileMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
  /** The trigger — focus returns here when the menu closes without navigating. */
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}

const LG_QUERY = "(min-width: 64rem)";

function lockScroll() {
  document.documentElement.style.overflow = "hidden";
}

function unlockScroll() {
  document.documentElement.style.overflow = "";
}

const list: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.04 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: revealTransition },
};

/**
 * Full-screen mobile navigation on a native <dialog> (focus trap + Esc for free).
 * Rendered inside the data-mode subtree so mode tokens and variants apply.
 */
export function MobileMenu({ id, open, onClose, returnFocusRef }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { mode } = useMode();
  const meta = modeMeta[mode];

  // Open imperatively when the parent flips `open`.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) {
      dialog.showModal();
      lockScroll();
    }
  }, [open]);

  // Close automatically if the viewport grows to the desktop layout.
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia(LG_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        unlockScroll();
        dialogRef.current?.close();
      }
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open]);

  // Never leave the page locked if the header unmounts.
  useEffect(() => () => unlockScroll(), []);

  /** Close synchronously (unlocking scroll first so a following scroll can run). */
  function closeMenu() {
    unlockScroll();
    dialogRef.current?.close();
  }

  function handleClose() {
    unlockScroll();
    onClose();
    // Browsers restore focus to the trigger natively; this covers older engines.
    if (document.activeElement === document.body) returnFocusRef.current?.focus();
  }

  /** In-page link: close the dialog first, then scroll and move focus to the section. */
  function navigateTo(event: MouseEvent<HTMLAnchorElement>, sectionId: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    closeMenu();
    window.requestAnimationFrame(() => scrollToSection(sectionId));
  }

  const isFreelance = mode === "freelance";

  return (
    <dialog
      ref={dialogRef}
      id={id}
      aria-labelledby={titleId}
      onClose={handleClose}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-bg p-0 text-fg backdrop:bg-transparent"
    >
      {/* Always rendered so aria-labelledby resolves even while the dialog is closed. */}
      <h2 id={titleId} className="sr-only">
        Menu
      </h2>
      {open ? (
        <div className="container-page flex min-h-full flex-col pb-8">
          {/* Top bar mirrors the header so the menu feels like an extension of it. */}
          <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <Monogram className="size-9" />
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface text-fg shadow-soft transition-colors hover:border-line-strong"
            >
              <X aria-hidden="true" className="size-[1.125rem]" />
            </button>
          </div>

          <motion.div initial="hidden" animate="visible" variants={list} className="flex flex-1 flex-col">
            <nav aria-label="Mobile" className="mt-6">
              <ul className="border-t border-line">
                {meta.nav.map((navItem, index) => (
                  <motion.li key={navItem.id} variants={item} className="border-b border-line">
                    <a
                      href={`#${navItem.id}`}
                      onClick={(event) => navigateTo(event, navItem.id)}
                      className="group flex items-center gap-4 py-4"
                    >
                      <span className="w-6 font-mono text-xs text-subtle">{String(index + 1).padStart(2, "0")}</span>
                      <span
                        className={cn(
                          "flex-1 text-fg transition-colors group-hover:text-accent-text",
                          isFreelance
                            ? "font-display text-4xl leading-none font-semibold tracking-[-0.03em]"
                            : "text-3xl leading-tight font-semibold tracking-tight",
                        )}
                      >
                        {navItem.label}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        className="size-5 text-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-accent-text"
                      />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div variants={item} className="mt-10">
              <p className="font-mono text-xs tracking-[0.16em] text-subtle uppercase">Choose your view</p>
              <ModeSwitch
                size="md"
                layoutId="mode-switch-menu"
                onSelect={() => closeMenu()}
                className="mt-3"
              />
            </motion.div>

            <motion.div variants={item} className="mt-10 flex flex-col gap-3 sm:flex-row">
              {isFreelance ? (
                <ButtonLink
                  href={`#${SECTION_IDS.freelance.inquiry}`}
                  onClick={(event) => navigateTo(event, SECTION_IDS.freelance.inquiry)}
                  size="lg"
                  trailingIcon={<ArrowRight aria-hidden="true" />}
                  className="w-full sm:w-auto"
                >
                  Start a project
                </ButtonLink>
              ) : (
                <ButtonLink
                  href={recruiterHero.primaryCta.href}
                  download={recruiterHero.primaryCta.download}
                  size="lg"
                  leadingIcon={<Download aria-hidden="true" />}
                  className="w-full sm:w-auto"
                >
                  {recruiterHero.primaryCta.label}
                </ButtonLink>
              )}
              <ButtonLink
                href={`mailto:${profile.email}`}
                variant="secondary"
                size="lg"
                leadingIcon={<Mail aria-hidden="true" />}
                className="w-full sm:w-auto"
              >
                Email me
              </ButtonLink>
            </motion.div>

            <motion.ul variants={item} aria-label="Profiles" className="mt-auto flex flex-wrap items-center gap-3 pt-10">
              <li>
                <SocialLink href={profile.links.github} label="GitHub">
                  <GitHubIcon aria-hidden="true" className="size-[1.125rem]" />
                </SocialLink>
              </li>
              <li>
                <SocialLink href={profile.links.linkedin} label="LinkedIn">
                  <LinkedInIcon aria-hidden="true" className="size-[1.125rem]" />
                </SocialLink>
              </li>
              <li className="w-full pt-1 font-mono text-xs text-subtle sm:ml-auto sm:w-auto sm:pt-0">{profile.location.short}</li>
            </motion.ul>
          </motion.div>
        </div>
      ) : null}
    </dialog>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-fg transition-colors hover:border-line-strong"
    >
      {children}
      <span>{label}</span>
      <span className="sr-only"> (opens in a new tab)</span>
      <ArrowUpRight aria-hidden="true" className="size-3.5 text-subtle transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
    </a>
  );
}
