"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently crossing the middle of the viewport
 * (or null, e.g. while the hero is in view). Re-subscribes whenever the list of
 * ids changes — switching modes remounts every section.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  // Stable dependency for array props that are recreated on each render.
  const key = ids.join("|");

  useEffect(() => {
    const list = key ? key.split("|") : [];
    const intersecting = new Map<string, boolean>();
    let observer: IntersectionObserver | null = null;

    // Wait a frame so the sections of a freshly switched mode are in the DOM.
    const frame = window.requestAnimationFrame(() => {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) intersecting.set(entry.target.id, entry.isIntersecting);
          setActive(list.find((id) => intersecting.get(id)) ?? null);
        },
        // A thin band around the vertical centre of the viewport.
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
      );
      for (const id of list) {
        const element = document.getElementById(id);
        if (element) observer.observe(element);
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [key]);

  return active;
}
