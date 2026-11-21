"use client";

import { useCallback, useSyncExternalStore } from "react";

function subscribe(onChange: () => void): () => void {
  let frame = 0;
  const onScroll = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      onChange();
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", onScroll);
    if (frame) window.cancelAnimationFrame(frame);
  };
}

/**
 * True once the page has scrolled past `threshold` px.
 * Subscription-based (no state writes in effects); always false on the server.
 */
export function useScrolled(threshold = 8): boolean {
  const getSnapshot = useCallback(() => window.scrollY > threshold, [threshold]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
