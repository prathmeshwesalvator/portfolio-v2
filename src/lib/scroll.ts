import type { MouseEvent } from "react";

/** True when the visitor asked the OS to minimise motion. Client-only. */
export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Smoothly scrolls to an in-page section and moves keyboard focus to it, so
 * screen-reader and keyboard users land in the right place. Does not touch
 * the URL (the ?viewer=… query stays clean and history is not polluted).
 */
export function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });

  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }
  target.focus({ preventScroll: true });
}

/** Click handler helper for `<a href="#id">` links that should smooth-scroll. */
export function handleAnchorClick(event: MouseEvent<HTMLAnchorElement>, onNavigate?: () => void): void {
  const href = event.currentTarget.getAttribute("href");
  if (!href || !href.startsWith("#") || href.length < 2) return;
  // Respect modified clicks (open in new tab, etc.).
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  event.preventDefault();
  scrollToSection(href.slice(1));
  onNavigate?.();
}
