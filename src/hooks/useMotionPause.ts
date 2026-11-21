"use client";

import { useEffect, useRef } from "react";

/**
 * Pauses CSS animation loops inside an element while it is offscreen.
 * Writes `data-motion="on|off"` on the element; the global rule
 * `[data-motion="off"] * { animation-play-state: paused }` (globals.css) does the rest.
 */
export function useMotionPause<T extends HTMLElement>(rootMargin = "120px") {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => element.setAttribute("data-motion", entry?.isIntersecting ? "on" : "off"),
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return ref;
}
