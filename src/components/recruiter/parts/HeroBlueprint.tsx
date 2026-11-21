"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Check, Database, FingerprintPattern, LockKeyhole, Smartphone } from "lucide-react";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { useMotionPause } from "@/hooks/useMotionPause";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { CornerTicks, FigureLabel } from "./Blueprint";

/**
 * Recruiter hero visual — "Anatomy of a Flutter app".
 * A wireframe phone beside the four layers of a Clean Architecture app. Each
 * layer is a tab; selecting one changes the overlay on the phone (debug-paint
 * outlines, a use case, offline sync, platform security). It auto-advances
 * until the visitor interacts, hovers, scrolls it away or prefers reduced motion.
 * Generic illustration of public architecture patterns — no employer screens.
 */

const LAYERS = [
  {
    key: "ui",
    name: "Presentation",
    tech: "Widgets · BLoC / Cubit",
    caption: "Widgets render state; BLoC and Cubit own it — so the UI stays declarative, predictable and testable.",
  },
  {
    key: "domain",
    name: "Domain",
    tech: "Use cases · Entities",
    caption: "Pure Dart business rules with no framework imports — the layer that doesn't change when the UI does.",
  },
  {
    key: "data",
    name: "Data",
    tech: "Repositories · Drift · REST",
    caption: "Repositories merge a local Drift store with REST APIs, and WorkManager syncs in the background when the network returns.",
  },
  {
    key: "platform",
    name: "Platform",
    tech: "Channels · Keystore · Keychain",
    caption: "Native Android and iOS features through Method and Event Channels, with keys held in Keystore and Keychain.",
  },
] as const;

type LayerKey = (typeof LAYERS)[number]["key"];

const ADVANCE_MS = 4200;

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}
const getVisible = () => document.visibilityState === "visible";
const getVisibleServer = () => false;

export function HeroBlueprint({ className }: { className?: string }) {
  const baseId = useId();
  const rootRef = useMotionPause<HTMLDivElement>();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const inView = useInView(rootRef, { amount: 0.35 });
  const visible = useSyncExternalStore(subscribeVisibility, getVisible, getVisibleServer);
  const reduceMotion = useReducedMotion();

  const running = inView && visible && !reduceMotion && !interacted && !hovered;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % LAYERS.length), ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [running, active]);

  function select(index: number, focus = false) {
    setInteracted(true);
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = LAYERS.length - 1;
    const next =
      event.key === "ArrowDown" || event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowUp" || event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  }

  const layer = LAYERS[active];
  const panelId = `${baseId}-panel`;

  return (
    <div
      ref={rootRef}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={cn(
        "relative isolate overflow-hidden rounded-[1.75rem] border border-line bg-surface/80 p-4 shadow-float sm:p-6",
        className,
      )}
    >
      {/* Blueprint field + a single warm light behind the device. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-blueprint opacity-[0.35] mask-fade-radial" />
        <div className="absolute top-1/2 left-[22%] size-[22rem] -translate-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>
      <CornerTicks />

      <div className="flex items-center justify-between gap-4 px-1">
        <FigureLabel index="01">Anatomy of a Flutter app</FigureLabel>
        <p aria-hidden="true" className="hidden font-mono text-[0.625rem] tracking-[0.16em] text-subtle uppercase sm:block">
          Clean Architecture
        </p>
      </div>

      <div className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4 sm:mt-6 sm:gap-7">
        <Phone layer={layer.key} />

        <div className="min-w-0">
          <div
            role="tablist"
            aria-label="Architecture layers"
            aria-orientation="vertical"
            onFocus={() => setInteracted(true)}
            className="flex flex-col gap-2"
          >
            {LAYERS.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.key}
                  ref={(element) => {
                    tabRefs.current[index] = element;
                  }}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${item.key}`}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={cn(
                    "group/layer relative rounded-xl border px-3 py-2.5 text-left transition-[background-color,border-color] duration-300 sm:px-4 sm:py-3",
                    // Connector bridging the grid gap — "plugs" the layer into the device.
                    "before:absolute before:top-1/2 before:right-full before:h-px before:w-4 before:transition-colors sm:before:w-7",
                    selected
                      ? "border-accent/50 bg-accent-soft before:bg-accent-text"
                      : "border-line bg-bg/40 before:bg-line-strong hover:border-line-strong hover:bg-surface-2",
                  )}
                >
                  <span className="flex items-baseline gap-2.5">
                    <span
                      className={cn(
                        "font-mono text-[0.625rem] tabular-nums transition-colors",
                        selected ? "text-accent-text" : "text-subtle",
                      )}
                    >
                      0{index + 1}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block text-sm font-semibold tracking-tight transition-colors sm:text-[0.9375rem]",
                          selected ? "text-fg" : "text-muted group-hover/layer:text-fg",
                        )}
                      >
                        {item.name}
                      </span>
                      <span className="mt-0.5 block font-mono text-[0.625rem] leading-snug text-subtle sm:truncate sm:text-[0.6875rem]">
                        {item.tech}
                      </span>
                    </span>
                  </span>
                  {selected && running ? (
                    <motion.span
                      key={`progress-${active}`}
                      aria-hidden="true"
                      className="absolute inset-x-3 bottom-0 h-px origin-left bg-accent-text/70"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: ADVANCE_MS / 1000, ease: "linear" }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${layer.key}`}
        className="mt-5 border-t border-line pt-4 sm:mt-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={layer.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
            className="min-h-[4.5lh] text-sm leading-relaxed text-muted sm:min-h-[3lh]"
          >
            <span className="font-medium text-fg">{layer.name}.</span> {layer.caption}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Wireframe phone                                                           */
/* -------------------------------------------------------------------------- */

const ROWS = [
  { w: "w-3/5", status: "synced" },
  { w: "w-1/2", status: "synced" },
  { w: "w-2/3", status: "queued" },
] as const;

const overlay = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.35, ease: EASE_OUT_EXPO },
} as const;

function Phone({ layer }: { layer: LayerKey }) {
  const paint = layer === "ui";
  const dim = layer === "domain";
  /** Flutter "debug paint" style outline — shown on the Presentation layer. */
  const debug = paint ? "outline-1 outline-offset-2 outline-dashed outline-accent-text/80" : "outline-0 outline-transparent";

  return (
    <div aria-hidden="true" className="relative">
      <div className="relative h-[17.5rem] w-[8.75rem] rounded-[1.6rem] border border-line-strong bg-bg p-1.5 shadow-float sm:h-[22.5rem] sm:w-[11.25rem] sm:rounded-[2rem] lg:h-[24rem] lg:w-[12rem]">
        <div className="relative flex h-full flex-col gap-2 overflow-hidden rounded-[1.25rem] bg-surface-2 px-2.5 pt-2.5 pb-2 sm:gap-2.5 sm:rounded-[1.6rem] sm:px-3 sm:pt-3">
          <span className="mx-auto h-1 w-10 shrink-0 rounded-full bg-line-strong sm:h-1.5" />

          <div className={cn("flex flex-col gap-2 transition-opacity duration-500 sm:gap-2.5", dim && "opacity-30")}>
            {/* App bar */}
            <div className={cn("flex items-center gap-2 rounded-md transition-[outline-color]", debug)}>
              <span className="size-5 shrink-0 rounded-full bg-surface-3 sm:size-6" />
              <span className="flex flex-1 flex-col gap-1">
                <span className="h-1.5 w-3/5 rounded-full bg-fg/70" />
                <span className="h-1 w-2/5 rounded-full bg-line-strong" />
              </span>
            </div>

            {/* Summary card */}
            <div
              className={cn(
                "relative rounded-xl border border-line bg-surface-3 p-2.5 transition-[outline-color] sm:p-3",
                debug,
              )}
            >
              <span className="block h-1 w-1/3 rounded-full bg-line-strong" />
              <span className="mt-2 block h-2.5 w-3/5 rounded-full bg-fg/80 sm:h-3" />
              <svg viewBox="0 0 100 24" className="mt-2 h-5 w-full sm:h-6" fill="none">
                <path
                  d="M0 18C12 18 16 9 28 10s16 8 28 6 14-12 26-12 14 6 18 6"
                  className="stroke-accent-text"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                />
              </svg>
              <AnimatePresence>
                {layer === "platform" ? (
                  <motion.span
                    {...overlay}
                    className="absolute -top-2 -right-2 grid size-7 place-items-center rounded-full border border-accent-2/50 bg-surface text-accent-2 shadow-card sm:size-8"
                  >
                    <LockKeyhole className="size-3.5 sm:size-4" strokeWidth={2} />
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>

            {/* List */}
            <ul className="flex flex-col gap-1.5">
              {ROWS.map((row, index) => (
                <li
                  key={index}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border border-line bg-surface px-2 py-1.5 transition-[outline-color]",
                    debug,
                  )}
                >
                  <span className="size-3.5 shrink-0 rounded-md bg-surface-3 sm:size-4" />
                  <span className={cn("h-1.5 rounded-full bg-line-strong", row.w)} />
                  <span
                    className={cn(
                      "ml-auto size-1.5 shrink-0 rounded-full transition-[background-color,opacity] duration-500",
                      layer === "data" ? (row.status === "synced" ? "bg-accent-2" : "bg-accent") : "bg-transparent",
                    )}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom nav */}
          <div
            className={cn(
              "mt-auto flex items-center justify-around rounded-lg py-1.5 transition-[outline-color,opacity] duration-500",
              debug,
              dim && "opacity-30",
            )}
          >
            {[0, 1, 2, 3].map((index) => (
              <span key={index} className={cn("size-1.5 rounded-full", index === 0 ? "bg-accent-text" : "bg-line-strong")} />
            ))}
          </div>

          {/* Layer overlays */}
          <AnimatePresence>
            {layer === "ui" ? (
              <motion.span
                key="ui"
                {...overlay}
                className="absolute top-2 right-2 rounded-md bg-accent px-1.5 py-0.5 font-mono text-[0.5rem] font-semibold text-accent-fg sm:text-[0.5625rem]"
              >
                debugPaint
              </motion.span>
            ) : null}

            {layer === "domain" ? (
              <motion.div
                key="domain"
                {...overlay}
                className="absolute inset-x-2 top-[24%] rounded-xl border border-accent/40 bg-surface p-2.5 font-mono text-[0.5625rem] leading-relaxed shadow-float sm:inset-x-3 sm:p-3 sm:text-[0.625rem]"
              >
                <p className="text-accent-text">SaveExpense</p>
                <p className="text-subtle">(expense) → Result</p>
                <div className="my-1.5 h-px bg-line" />
                {["validate", "persist", "schedule sync"].map((step) => (
                  <p key={step} className="flex items-center justify-between gap-2 text-fg/90">
                    <span className="truncate">{step}()</span>
                    <Check className="size-2.5 shrink-0 text-accent-2" strokeWidth={3} />
                  </p>
                ))}
              </motion.div>
            ) : null}

            {layer === "data" ? (
              <motion.span
                key="data-tag"
                {...overlay}
                className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[0.5rem] text-muted sm:text-[0.5625rem]"
              >
                <Database className="size-2.5 text-accent-text" strokeWidth={2} />
                Drift
              </motion.span>
            ) : null}

            {layer === "data" ? (
              <motion.div key="data" {...overlay} className="pointer-events-none absolute inset-x-2 bottom-9 sm:bottom-10">
                <span className="relative block h-6 sm:h-7">
                  <span className="absolute inset-0 flex animate-swap-a items-center justify-center gap-1.5 rounded-full border border-line bg-surface font-mono text-[0.5rem] text-muted shadow-card sm:text-[0.5625rem]">
                    <span className="size-1.5 rounded-full bg-accent" />
                    Offline · 1 queued
                  </span>
                  <span className="absolute inset-0 flex animate-swap-b items-center justify-center gap-1.5 rounded-full border border-line bg-surface font-mono text-[0.5rem] text-fg shadow-card sm:text-[0.5625rem]">
                    <span className="size-1.5 rounded-full bg-accent-2" />
                    Online · synced
                  </span>
                </span>
              </motion.div>
            ) : null}

            {layer === "platform" ? (
              <motion.div
                key="platform"
                {...overlay}
                className="absolute inset-x-2 bottom-2 rounded-xl border border-line bg-surface p-2.5 text-center shadow-float sm:inset-x-3 sm:p-3"
              >
                <FingerprintPattern className="mx-auto size-5 text-accent-text sm:size-6" strokeWidth={1.5} />
                <p className="mt-1 font-mono text-[0.5rem] text-muted sm:text-[0.5625rem]">Keystore · Keychain</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Native bridge — appears with the Platform layer. */}
      <AnimatePresence>
        {layer === "platform" ? (
          <motion.span
            key="bridge"
            {...overlay}
            className="absolute -bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full border border-line-strong bg-surface px-2 py-1 font-mono text-[0.5625rem] whitespace-nowrap text-muted shadow-card"
          >
            <Smartphone className="size-3 text-accent-2" strokeWidth={2} />
            Android · iOS
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
