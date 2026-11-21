"use client";

import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { Check, Lock, Plus } from "lucide-react";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { EASE_OUT_EXPO, snappySpring } from "@/lib/motion";

/**
 * Interactive "product preview" for the freelance hero: one card, three tabs
 * (App · API · Web) mirroring the three services. Everything inside is a
 * generic illustration — no client or employer screens, data or branding.
 */

const TABS = [
  { key: "app", label: "App", caption: "Flutter · Firebase · Offline-first", description: "Illustration of a cross-platform mobile app: a project tracker with tasks and an offline sync notice." },
  { key: "api", label: "API", caption: "Django · FastAPI · PostgreSQL", description: "Illustration of a REST API request returning a JSON response." },
  { key: "web", label: "Web", caption: "React · Tailwind CSS · REST", description: "Illustration of a responsive website layout in a browser window." },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const ADVANCE_MS = 4500;

/* Document visibility as an external store (pauses auto-advance in background tabs). */
function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}
const getVisible = () => document.visibilityState === "visible";
const getVisibleServer = () => false;

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT_EXPO } },
};

export function HeroComposer() {
  const baseId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const inView = useInView(cardRef, { amount: 0.4 });
  const visible = useSyncExternalStore(subscribeVisibility, getVisible, getVisibleServer);
  const reduceMotion = useReducedMotion();

  const running = inView && visible && !reduceMotion && !interacted && !hovered;

  // Auto-advance (state is only updated from the timer callback).
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setActive((index) => (index + 1) % TABS.length), ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [running, active]);

  function select(index: number, focus = false) {
    setInteracted(true);
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = TABS.length - 1;
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  }

  const tab = TABS[active];
  const panelId = `${baseId}-panel`;

  return (
    <div className="mx-auto w-full max-w-md lg:max-w-none">
      <div
        ref={cardRef}
        onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        className="relative rounded-[28px] border border-line bg-surface p-3.5 shadow-[var(--shadow-lg),inset_0_1px_0_0_rgb(255_255_255/0.05)] sm:p-5"
      >
        {/* Tab bar */}
        <div className="flex items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="What I build"
            onFocus={() => setInteracted(true)}
            className="inline-flex rounded-full border border-line bg-surface-2 p-1"
          >
            {TABS.map((item, index) => {
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
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={cn(
                    "relative z-0 inline-flex h-9 min-w-14 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors duration-200",
                    selected ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {selected ? (
                    <motion.span
                      layoutId={`${baseId}-pill`}
                      transition={snappySpring}
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full bg-surface-3 shadow-soft"
                    />
                  ) : null}
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="hidden font-mono text-[0.6875rem] tracking-[0.14em] text-subtle uppercase sm:block">
            What I build
          </p>
        </div>

        {/* Auto-advance progress */}
        <div aria-hidden="true" className="mt-3 h-px overflow-hidden bg-line">
          {running ? (
            <motion.span
              key={`${active}-${tab.key}`}
              className="block h-full origin-left bg-accent-text"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: ADVANCE_MS / 1000, ease: "linear" }}
            />
          ) : null}
        </div>

        {/* Panel */}
        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${tab.key}`}
          tabIndex={0}
          className="relative mt-3 h-[22rem] overflow-hidden rounded-2xl sm:mt-4 sm:h-[24rem]"
        >
          <p className="sr-only">{tab.description}</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab.key}
              aria-hidden="true"
              className="absolute inset-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE_OUT_EXPO }}
            >
              <PanelArt tab={tab.key} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-4 text-center font-mono text-xs text-subtle">
        <span className="text-accent-text">{tab.label}</span>
        <span aria-hidden="true"> — </span>
        <span className="sr-only">: </span>
        {tab.caption}
      </p>
    </div>
  );
}

function PanelArt({ tab }: { tab: TabKey }) {
  if (tab === "app") return <AppPanel />;
  if (tab === "api") return <ApiPanel />;
  return <WebPanel />;
}

/* -------------------------------------------------------------------------- */
/*  App — a generic project-tracker screen in a phone frame                   */
/* -------------------------------------------------------------------------- */

const TASKS = [
  { label: "Design review", done: true },
  { label: "API integration", done: false },
  { label: "Release build", done: false },
] as const;

function AppPanel() {
  return (
    <div className="relative flex h-full items-start justify-center bg-surface-2 pt-3 sm:pt-4">
      <div className="absolute inset-0 bg-grid opacity-40 mask-fade-radial" />
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative h-[18rem] w-[12.5rem] rounded-[2.1rem] border border-line-strong bg-bg p-2 shadow-float sm:h-[19.5rem] sm:w-[14.5rem] sm:p-2.5"
      >
        <div className="relative flex h-full flex-col gap-2 overflow-hidden rounded-[1.65rem] bg-surface px-3 pt-3 pb-3">
          <div className="mx-auto h-1.5 w-12 shrink-0 rounded-full bg-line-strong" />

          <motion.div variants={rise} className="flex items-baseline justify-between">
            <div>
              <p className="font-mono text-[0.5625rem] tracking-[0.14em] text-subtle uppercase">Today</p>
              <p className="text-sm font-semibold tracking-tight text-fg">Project tracker</p>
            </div>
            <span className="size-6 rounded-full bg-surface-3" />
          </motion.div>

          <motion.div variants={rise} className="grid grid-cols-2 gap-2 rounded-xl bg-accent-soft p-2.5">
            <div>
              <p className="font-display text-xl leading-none font-semibold text-fg">12</p>
              <p className="mt-1 text-[0.625rem] text-fg/80">tasks</p>
            </div>
            <div>
              <p className="font-display text-xl leading-none font-semibold text-accent-text">3</p>
              <p className="mt-1 text-[0.625rem] text-fg/80">due today</p>
            </div>
          </motion.div>

          <motion.div variants={rise} className="flex rounded-full bg-surface-2 p-0.5 text-[0.625rem] font-medium">
            <span className="flex-1 rounded-full bg-surface-3 py-1 text-center text-fg">All</span>
            <span className="flex-1 py-1 text-center text-muted">Active</span>
            <span className="flex-1 py-1 text-center text-muted">Done</span>
          </motion.div>

          <ul className="flex flex-col gap-1.5">
            {TASKS.map((task) => (
              <motion.li
                key={task.label}
                variants={rise}
                className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-2 py-1.5"
              >
                <span
                  className={cn(
                    "grid size-4 shrink-0 place-items-center rounded-full border",
                    task.done ? "border-transparent bg-accent-2 text-bg" : "border-line-strong",
                  )}
                >
                  {task.done ? <Check className="size-2.5" strokeWidth={3} /> : null}
                </span>
                <span className={cn("truncate text-[0.6875rem]", task.done ? "text-muted line-through" : "text-fg")}>
                  {task.label}
                </span>
              </motion.li>
            ))}
          </ul>

          <motion.span
            variants={rise}
            className="absolute right-3 bottom-3 grid size-9 place-items-center rounded-full bg-primary text-primary-fg shadow-card"
          >
            <Plus className="size-4" strokeWidth={2.5} />
          </motion.span>
        </div>
      </motion.div>

      <SyncToast />
    </div>
  );
}

/** Small toast that cycles offline → synced, hinting at offline-first work. */
function SyncToast() {
  // Starts (and, with reduced motion, stays) on the "synced" state. Render output
  // depends only on state, so server and client markup always match.
  const [showOnline, setShowOnline] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setShowOnline((value) => !value), 2200);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  return (
    <div className="absolute inset-x-0 bottom-3 flex justify-center">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={showOnline ? "online" : "offline"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
          className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[0.6875rem] font-medium whitespace-nowrap text-fg shadow-card"
        >
          <span className={cn("size-1.5 rounded-full", showOnline ? "bg-accent-2" : "bg-subtle")} />
          {showOnline ? "Back online — synced" : "Offline — changes saved"}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  API — request + JSON response                                             */
/* -------------------------------------------------------------------------- */

type Token = { text: string; tone: "key" | "string" | "number" | "punct" };

const k = (text: string): Token => ({ text, tone: "key" });
const s = (text: string): Token => ({ text, tone: "string" });
const n = (text: string): Token => ({ text, tone: "number" });
const p = (text: string): Token => ({ text, tone: "punct" });

const JSON_LINES: readonly (readonly Token[])[] = [
  [p("{")],
  [p("  "), k('"id"'), p(": "), n("42"), p(",")],
  [p("  "), k('"name"'), p(": "), s('"Your product"'), p(",")],
  [p("  "), k('"platforms"'), p(": [")],
  [p("    "), s('"android"'), p(", "), s('"ios"'), p(", "), s('"web"')],
  [p("  ],")],
  [p("  "), k('"status"'), p(": "), s('"in_progress"'), p(",")],
  [p("  "), k('"next_release"'), p(": "), s('"v1.2.0"')],
  [p("}")],
];

const TONE: Record<Token["tone"], string> = {
  key: "text-accent-text",
  string: "text-accent-2",
  number: "text-fg",
  punct: "text-subtle",
};

function ApiPanel() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-bg p-4 font-mono text-xs leading-relaxed sm:p-5 sm:text-[0.8125rem]">
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-accent-2-soft px-1.5 py-0.5 text-[0.6875rem] font-semibold text-accent-2">GET</span>
        <span className="truncate text-fg">/api/v1/projects/42</span>
      </div>
      <p className="mt-2 flex items-center gap-2 text-subtle">
        <span className="size-1.5 rounded-full bg-accent-2" />
        <span className="text-accent-2">200 OK</span>
        <span>· 38 ms</span>
      </p>
      <div className="my-4 h-px bg-line" />
      <motion.div variants={stagger} initial="hidden" animate="visible" className="whitespace-pre">
        {JSON_LINES.map((line, index) => (
          <motion.div key={index} variants={rise}>
            {line.map((token, tokenIndex) => (
              <span key={tokenIndex} className={TONE[token.tone]}>
                {token.text}
              </span>
            ))}
          </motion.div>
        ))}
        <span className="inline-block h-[1.1em] w-[0.55em] translate-y-[0.15em] animate-blink bg-accent-text" />
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Web — a wireframe website in a browser window                             */
/* -------------------------------------------------------------------------- */

function WebPanel() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg">
      <div className="flex items-center gap-3 border-b border-line bg-surface-2 px-3 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
        </span>
        <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full bg-surface px-3 py-1 font-mono text-[0.6875rem] text-muted">
          <Lock className="size-3 shrink-0" />
          <span className="truncate">yourproduct.com</span>
        </span>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <motion.div variants={rise} className="flex items-center justify-between">
          <span className="size-5 rounded-md bg-accent-text" />
          <span className="hidden gap-3 min-[400px]:flex">
            <span className="h-1.5 w-8 rounded-full bg-line-strong" />
            <span className="h-1.5 w-8 rounded-full bg-line-strong" />
            <span className="h-1.5 w-8 rounded-full bg-line-strong" />
          </span>
          <span className="h-5 w-14 rounded-full border border-line-strong" />
        </motion.div>

        <motion.div variants={rise} className="mt-2 flex flex-col gap-2">
          <span className="h-3.5 w-4/5 rounded-full bg-fg/80" />
          <span className="h-3.5 w-3/5 rounded-full bg-fg/80" />
        </motion.div>
        <motion.div variants={rise} className="flex flex-col gap-1.5">
          <span className="h-1.5 w-11/12 rounded-full bg-line-strong" />
          <span className="h-1.5 w-2/3 rounded-full bg-line-strong" />
        </motion.div>
        <motion.div variants={rise} className="flex gap-2">
          <span className="h-7 w-24 rounded-full bg-primary" />
          <span className="h-7 w-20 rounded-full border border-line-strong" />
        </motion.div>

        <motion.div variants={rise} className="mt-auto grid grid-cols-3 gap-2">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex flex-col gap-1.5 rounded-lg border border-line bg-surface p-2">
              <span className={cn("aspect-[4/3] rounded-md", index === 1 ? "bg-accent-soft" : "bg-surface-3")} />
              <span className="h-1.5 w-3/4 rounded-full bg-line-strong" />
              <span className="h-1.5 w-1/2 rounded-full bg-line" />
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
