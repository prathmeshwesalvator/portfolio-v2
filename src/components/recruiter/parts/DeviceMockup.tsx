"use client";

import {
  BadgePercent,
  Bell,
  Check,
  ChevronLeft,
  Clock,
  ExternalLink,
  LockKeyhole,
  Nfc,
  Plus,
  Star,
  Wallet,
  WifiOff,
} from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { ProjectId } from "@/types";

/**
 * Annotated device mockups for the Recruiter project chapters.
 *
 * IMPORTANT: these are deliberately ABSTRACT — skeleton bars, generic icons and
 * placeholder symbols. No logos, brand colours, copy, data or layouts from the
 * production apps (employer/client products are confidential). Callouts name
 * only the modules and techniques listed on the public résumé.
 */

export interface MockupCallout {
  label: string;
  side: "left" | "right";
  /** Vertical position of the target, % of the phone height. */
  top: number;
  /** Horizontal distance of the target from the callout's side edge, % of the phone width. */
  inset: number;
}

/** Callouts per project — each target points at the part of the mockup it describes. */
export const MOCKUP_CALLOUTS: Partial<Record<ProjectId, readonly MockupCallout[]>> = {
  "tc-pay": [
    { label: "RSA-AES encryption", side: "right", top: 22, inset: 16 },
    { label: "NFC module", side: "left", top: 29, inset: 22 },
    { label: "Cross-app deep link", side: "left", top: 60, inset: 14 },
    { label: "Edge Points", side: "right", top: 72, inset: 34 },
    { label: "Offers & Rewards", side: "left", top: 86, inset: 28 },
  ],
  tourpe: [
    { label: "Android Flavors", side: "right", top: 8, inset: 22 },
    { label: "Trip Wallet 2.0", side: "left", top: 23, inset: 30 },
    { label: "On Tour Sell", side: "left", top: 41, inset: 62 },
    { label: "Offline storage · Drift", side: "right", top: 61, inset: 13 },
    { label: "Background sync", side: "right", top: 86, inset: 30 },
  ],
};

/** Phone width drives callout line lengths (see Callout). */
const PHONE_SIZE = "[--phone-w:12rem] h-[25rem] w-[var(--phone-w)] sm:[--phone-w:13.5rem] sm:h-[28rem]";

export function DeviceMockup({ projectId, className }: { projectId: ProjectId; className?: string }) {
  const callouts = MOCKUP_CALLOUTS[projectId] ?? [];

  return (
    <div aria-hidden="true" className={cn("relative", PHONE_SIZE, className)}>
      {/* Hardware buttons */}
      <span className="absolute top-24 -left-[3px] h-10 w-[3px] rounded-l-sm bg-line-strong" />
      <span className="absolute top-36 -left-[3px] h-14 w-[3px] rounded-l-sm bg-line-strong" />
      <span className="absolute top-28 -right-[3px] h-16 w-[3px] rounded-r-sm bg-line-strong" />

      <div className="relative h-full w-full rounded-[2.4rem] border border-line-strong bg-[#070605] p-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_0_rgb(255_255_255/0.08)]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[1.95rem] bg-surface-2">
          <StatusBar flavor={projectId === "tourpe"} />
          {projectId === "tc-pay" ? <ForexScreen /> : <TourScreen />}
        </div>
      </div>

      {callouts.map((callout, index) => (
        <Callout key={callout.label} callout={callout} index={index} />
      ))}
    </div>
  );
}

function Callout({ callout, index }: { callout: MockupCallout; index: number }) {
  const left = callout.side === "left";
  const position: CSSProperties = left
    ? { top: `${callout.top}%`, right: `${100 - callout.inset}%` }
    : { top: `${callout.top}%`, left: `${100 - callout.inset}%` };
  const lineWidth = `calc(var(--phone-w) * ${callout.inset / 100} + 2rem)`;

  return (
    <span
      data-callout=""
      style={position}
      className={cn(
        // Fits beside the phone only when the stage is wide (single-column md, two-column xl).
        "absolute hidden -translate-y-1/2 items-center md:flex lg:hidden xl:flex",
        left ? "flex-row" : "flex-row-reverse",
      )}
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface/95 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-fg shadow-card backdrop-blur-sm">
        <span className="font-mono text-[0.625rem] text-accent-text tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        {callout.label}
      </span>
      <span className="h-px bg-accent-text/60" style={{ width: lineWidth }} />
      <span className="relative size-2.5 shrink-0 rounded-full bg-accent shadow-[0_0_0_4px_rgb(242_165_65/0.18)]" />
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shared screen primitives                                                  */
/* -------------------------------------------------------------------------- */

function Bar({ className }: { className?: string }) {
  return <span className={cn("block h-1.5 rounded-full bg-line-strong", className)} />;
}

function StatusBar({ flavor = false }: { flavor?: boolean }) {
  return (
    <div className="relative flex h-7 shrink-0 items-center justify-between px-5 pt-1">
      <Bar className="h-1 w-6 bg-fg/60" />
      <span className="absolute top-1.5 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-[#070605]" />
      {flavor ? (
        <span className="rounded-sm bg-accent/90 px-1 font-mono text-[0.4375rem] leading-[0.75rem] font-semibold text-accent-fg">
          STAGING
        </span>
      ) : (
        <span className="flex gap-0.5">
          <span className="size-1 rounded-full bg-fg/60" />
          <span className="size-1 rounded-full bg-fg/60" />
          <span className="size-1 rounded-full bg-fg/40" />
        </span>
      )}
    </div>
  );
}

function BottomNav({ active = 0 }: { active?: number }) {
  return (
    <div className="mt-auto flex items-center justify-around border-t border-line bg-surface px-3 pt-2.5 pb-3">
      {[0, 1, 2, 3].map((index) => (
        <span key={index} className="flex flex-col items-center gap-1">
          <span className={cn("size-3.5 rounded-md", index === active ? "bg-accent" : "bg-line-strong")} />
          <span className={cn("h-1 w-4 rounded-full", index === active ? "bg-accent/60" : "bg-line")} />
        </span>
      ))}
    </div>
  );
}

function Tile({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-line bg-surface p-2.5", className)}>{children}</div>;
}

/* -------------------------------------------------------------------------- */
/*  Forex & travel card (abstract)                                            */
/* -------------------------------------------------------------------------- */

function ForexScreen() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-2.5 px-3.5 pt-1.5">
        <div className="flex items-center gap-2">
          <span className="size-6 rounded-full bg-surface-3" />
          <span className="flex flex-1 flex-col gap-1">
            <Bar className="w-14 bg-fg/70" />
            <Bar className="h-1 w-9" />
          </span>
          <Bell className="size-3.5 text-subtle" strokeWidth={2} />
        </div>

        {/* Generic travel card — no brand, no digits. */}
        <div className="relative overflow-hidden rounded-2xl border border-line-strong bg-surface-3 p-3">
          <span className="absolute -top-10 -right-8 size-28 rounded-full bg-accent/15 blur-xl" />
          <div className="relative flex items-start justify-between">
            <span className="grid h-5 w-7 grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-subtle/40 bg-line-strong/60">
              <span className="border-r border-b border-subtle/30" />
              <span className="border-b border-subtle/30" />
              <span className="border-r border-subtle/30" />
              <span />
            </span>
            <span className="grid size-6 place-items-center rounded-full border border-accent-2/40 bg-surface text-accent-2">
              <LockKeyhole className="size-3" strokeWidth={2.25} />
            </span>
          </div>
          <Nfc className="relative mt-2 size-4 text-accent-text" strokeWidth={2} />
          <div className="relative mt-3 flex gap-1.5">
            {[0, 1, 2, 3].map((index) => (
              <Bar key={index} className="h-1.5 w-6 bg-fg/40" />
            ))}
          </div>
          <div className="relative mt-2 flex justify-between">
            <Bar className="h-1 w-14" />
            <Bar className="h-1 w-6" />
          </div>
        </div>

        {/* Currency balances */}
        <div className="grid grid-cols-3 gap-1.5">
          {["₹", "$", "€"].map((glyph, index) => (
            <div key={glyph} className="rounded-lg border border-line bg-surface px-2 py-1.5">
              <span className={cn("font-mono text-[0.625rem]", index === 0 ? "text-accent-text" : "text-muted")}>
                {glyph}
              </span>
              <Bar className="mt-1 h-1 w-8 bg-fg/50" />
            </div>
          ))}
        </div>

        {/* Linked app row */}
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-line-strong px-2.5 py-2">
          <span className="size-4 rounded-md bg-surface-3" />
          <Bar className="w-16" />
          <ExternalLink className="ml-auto size-3 text-accent-text" strokeWidth={2.25} />
        </div>

        {/* Points */}
        <Tile className="flex items-center gap-2.5">
          <span className="relative grid size-9 shrink-0 place-items-center">
            <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
              <circle cx={18} cy={18} r={15} fill="none" className="stroke-line" strokeWidth={3} />
              <circle
                cx={18}
                cy={18}
                r={15}
                fill="none"
                className="stroke-accent"
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray="94.2"
                strokeDashoffset="33"
              />
            </svg>
            <Star className="size-3.5 text-accent-text" strokeWidth={2} />
          </span>
          <span className="flex flex-1 flex-col gap-1.5">
            <Bar className="w-16 bg-fg/70" />
            <Bar className="h-1 w-10" />
          </span>
        </Tile>

        {/* Offers */}
        <div className="grid grid-cols-2 gap-1.5">
          {[0, 1].map((index) => (
            <Tile key={index} className="p-2">
              <BadgePercent className={cn("size-3.5", index === 0 ? "text-accent-2" : "text-muted")} strokeWidth={2} />
              <Bar className="mt-1.5 h-1 w-10 bg-fg/50" />
              <Bar className="mt-1 h-1 w-7" />
            </Tile>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tour expense management (abstract)                                        */
/* -------------------------------------------------------------------------- */

const EXPENSES = [
  { w: "w-14", synced: true },
  { w: "w-10", synced: true },
  { w: "w-12", synced: false },
  { w: "w-9", synced: false },
] as const;

function TourScreen() {
  return (
    <>
      <div className="relative flex flex-1 flex-col gap-2.5 px-3.5 pt-1.5">
        <div className="flex items-center gap-2">
          <ChevronLeft className="size-3.5 text-subtle" strokeWidth={2.25} />
          <Bar className="w-16 bg-fg/70" />
          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-line bg-surface px-1.5 py-0.5 font-mono text-[0.4375rem] text-muted">
            <WifiOff className="size-2.5 text-accent-text" strokeWidth={2.25} />
            OFFLINE
          </span>
        </div>

        {/* Wallet */}
        <div className="rounded-2xl border border-line-strong bg-surface-3 p-3">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-accent-soft text-accent-text">
              <Wallet className="size-3.5" strokeWidth={2} />
            </span>
            <Bar className="h-1 w-12" />
          </div>
          <Bar className="mt-2.5 h-2.5 w-20 bg-fg/80" />
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line">
            <span className="block h-full w-3/5 rounded-full bg-accent" />
          </div>
        </div>

        {/* Segmented tabs */}
        <div className="flex rounded-full bg-surface p-0.5">
          <span className="flex-1 rounded-full bg-surface-3 py-1.5">
            <Bar className="mx-auto h-1 w-8 bg-fg/60" />
          </span>
          <span className="flex-1 py-1.5">
            <Bar className="mx-auto h-1 w-8" />
          </span>
          <span className="flex-1 py-1.5">
            <Bar className="mx-auto h-1 w-6" />
          </span>
        </div>

        {/* Expenses */}
        <ul className="flex flex-col gap-1.5">
          {EXPENSES.map((row, index) => (
            <li key={index} className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2 py-1.5">
              <span className="size-5 shrink-0 rounded-md bg-surface-3" />
              <span className="flex flex-1 flex-col gap-1">
                <Bar className={cn("h-1 bg-fg/60", row.w)} />
                <Bar className="h-1 w-6" />
              </span>
              {row.synced ? (
                <Check className="size-3 text-accent-2" strokeWidth={3} />
              ) : (
                <Clock className="size-3 text-accent-text" strokeWidth={2.5} />
              )}
            </li>
          ))}
        </ul>

        {/* Sync status — loops "saved offline" ↔ "synced". */}
        <span className="relative mt-auto mb-2 block h-7">
          <span className="absolute inset-0 flex animate-swap-a items-center justify-center gap-1.5 rounded-full border border-line bg-surface font-mono text-[0.5rem] text-muted">
            <span className="size-1.5 rounded-full bg-accent" />2 saved offline
          </span>
          <span className="absolute inset-0 flex animate-swap-b items-center justify-center gap-1.5 rounded-full border border-line bg-surface font-mono text-[0.5rem] text-fg">
            <span className="size-1.5 rounded-full bg-accent-2" />
            Back online · synced
          </span>
        </span>

        <span className="absolute right-3.5 bottom-12 grid size-8 place-items-center rounded-full bg-accent text-accent-fg shadow-card">
          <Plus className="size-4" strokeWidth={2.5} />
        </span>
      </div>
      <BottomNav active={1} />
    </>
  );
}
