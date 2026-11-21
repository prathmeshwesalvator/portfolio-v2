"use client";

import { MotionConfig } from "framer-motion";
import { FreelanceExperience } from "@/components/freelance/FreelanceExperience";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ModeProvider, useMode } from "@/components/mode/ModeProvider";
import { RecruiterExperience } from "@/components/recruiter/RecruiterExperience";
import { Terminal } from "@/components/terminal/Terminal";
import { cn } from "@/lib/cn";
import { handleAnchorClick } from "@/lib/scroll";
import type { ViewerMode } from "@/types";

/**
 * Client root shared by both statically prerendered pages.
 * `initialMode` comes from the route (/ → recruiter, /?viewer=freelance → freelance).
 */
export function PortfolioApp({ initialMode }: { initialMode: ViewerMode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ModeProvider initialMode={initialMode}>
        <AppFrame />
      </ModeProvider>
    </MotionConfig>
  );
}

function AppFrame() {
  const { mode, transition } = useMode();

  return (
    <div data-mode={mode} className="relative isolate flex min-h-dvh flex-col bg-bg text-fg">
      <a
        href="#main"
        onClick={(event) => handleAnchorClick(event)}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-fg"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main" tabIndex={-1} className="flex-1">
        {/* Keyed by mode: each experience mounts fresh so its entrance motion replays. */}
        <div key={mode} className={cn(transition === "fade" && "animate-fade")}>
          {mode === "recruiter" ? <RecruiterExperience /> : <FreelanceExperience />}
        </div>
      </main>

      <SiteFooter />
      <Terminal />
    </div>
  );
}
