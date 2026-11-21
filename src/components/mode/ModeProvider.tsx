"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { modeMeta } from "@/data/site";
import { prefersReducedMotion } from "@/lib/scroll";
import { buildViewerUrl, isViewerMode, VIEWER_PARAM } from "@/lib/viewer";
import type { ViewerMode } from "@/types";

/**
 * How the current experience was entered:
 *  initial          – first render (server-rendered, hero entrance handles motion)
 *  view-transition  – circular reveal via the View Transition API
 *  fade             – View Transitions unavailable → CSS fade fallback
 *  instant          – reduced motion
 */
export type ModeTransitionKind = "initial" | "view-transition" | "fade" | "instant";

export interface SwitchModeOptions {
  /** Viewport coordinates the reveal expands from (e.g. centre of the clicked control). */
  origin?: { x: number; y: number };
}

interface ModeContextValue {
  mode: ViewerMode;
  switchMode: (next: ViewerMode, options?: SwitchModeOptions) => void;
  transition: ModeTransitionKind;
}

const ModeContext = createContext<ModeContextValue | null>(null);

const REVEAL_DURATION_MS = 720;
const REVEAL_EASING = "cubic-bezier(0.76, 0, 0.24, 1)";

function readModeFromLocation(): { mode: ViewerMode | null; raw: string | null } {
  const raw = new URLSearchParams(window.location.search).get(VIEWER_PARAM);
  return { mode: isViewerMode(raw) ? raw : null, raw };
}

function syncDocumentChrome(mode: ViewerMode) {
  const meta = modeMeta[mode];
  document.title = meta.title;
  document.querySelectorAll('meta[name="theme-color"]').forEach((element) => {
    element.setAttribute("content", meta.themeColor);
  });
}

export function ModeProvider({ initialMode, children }: { initialMode: ViewerMode; children: ReactNode }) {
  const [mode, setMode] = useState<ViewerMode>(initialMode);
  const [transition, setTransition] = useState<ModeTransitionKind>("initial");
  const [announcement, setAnnouncement] = useState("");
  const modeRef = useRef<ViewerMode>(initialMode);

  /** Swaps the rendered experience with the best available transition. Never touches history. */
  const transitionTo = useCallback((next: ViewerMode, origin?: SwitchModeOptions["origin"]) => {
    if (next === modeRef.current) return;
    modeRef.current = next;

    const commit = (kind: ModeTransitionKind) => {
      flushSync(() => {
        setMode(next);
        setTransition(kind);
      });
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      syncDocumentChrome(next);
    };

    const reduceMotion = prefersReducedMotion();
    const canViewTransition =
      typeof document.startViewTransition === "function" && document.visibilityState === "visible";

    if (reduceMotion || !canViewTransition) {
      commit(reduceMotion ? "instant" : "fade");
    } else {
      const viewTransition = document.startViewTransition(() => commit("view-transition"));
      viewTransition.ready
        .then(() => {
          const x = origin?.x ?? window.innerWidth / 2;
          const y = origin?.y ?? 0;
          const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: REVEAL_DURATION_MS, easing: REVEAL_EASING, pseudoElement: "::view-transition-new(root)" },
          );
        })
        .catch(() => {
          /* Transition skipped (e.g. tab hidden) — the DOM is already updated. */
        });
    }

    // Alternate a trailing space so repeated switches are re-announced.
    setAnnouncement((previous) =>
      previous === modeMeta[next].announcement ? `${modeMeta[next].announcement} ` : modeMeta[next].announcement,
    );
  }, []);

  /** User-initiated switch: push a history entry, then transition. */
  const switchMode = useCallback(
    (next: ViewerMode, options?: SwitchModeOptions) => {
      if (next === modeRef.current) return;
      // Next.js integrates window.history.pushState with its router (no reload, no server round-trip).
      window.history.pushState(null, "", buildViewerUrl(next, new URL(window.location.href)));
      transitionTo(next, options?.origin);
    },
    [transitionTo],
  );

  // Browser back/forward → follow the URL.
  useEffect(() => {
    const onPopState = () => {
      const { mode: requested } = readModeFromLocation();
      transitionTo(requested ?? "recruiter");
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [transitionTo]);

  // Keep the URL explicit (?viewer=…) on first load.
  // Deferred with a timeout: Next.js patches history.replaceState in a parent
  // effect, which runs after this child effect. Writing earlier would desync the
  // router, which later rewrites the URL back to its own canonical value.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const { mode: requested } = readModeFromLocation();
      if (requested && requested !== modeRef.current) {
        // Server rendered a different experience than the URL asks for
        // (e.g. a host without rewrites). Honour the URL instead of rewriting it.
        modeRef.current = requested;
        setMode(requested);
        setTransition("instant");
        syncDocumentChrome(requested);
        return;
      }
      if (!requested) {
        window.history.replaceState(
          null,
          "",
          buildViewerUrl(modeRef.current, new URL(window.location.href), { keepHash: true }),
        );
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const value = useMemo<ModeContextValue>(() => ({ mode, switchMode, transition }), [mode, switchMode, transition]);

  return (
    <ModeContext.Provider value={value}>
      {children}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
    </ModeContext.Provider>
  );
}

export function useMode(): ModeContextValue {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode must be used inside <ModeProvider>");
  }
  return context;
}

/** Helper for controls: origin = centre of the clicked element. */
export function originFromElement(element: Element): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}
