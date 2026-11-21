"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import type { ProjectVisualVariant } from "@/types";
import { CommerceAuctionVisual } from "./visuals/CommerceAuctionVisual";
import { ForexCardVisual } from "./visuals/ForexCardVisual";
import { HealthPulseVisual } from "./visuals/HealthPulseVisual";
import { LedgerVoteVisual } from "./visuals/LedgerVoteVisual";
import { SecureChatVisual } from "./visuals/SecureChatVisual";
import { TourRouteVisual } from "./visuals/TourRouteVisual";
import { TravelWebVisual } from "./visuals/TravelWebVisual";

export interface ProjectVisualProps {
  variant: ProjectVisualVariant;
  className?: string;
}

/** Loops are CSS-only; they pause while the visual is offscreen (and the global reduced-motion rule stops them). */
const PAUSE_OFFSCREEN = '[data-pv-motion="off"] *{animation-play-state:paused}';

function renderVariant(variant: ProjectVisualVariant) {
  switch (variant) {
    case "forex-card":
      return <ForexCardVisual />;
    case "tour-route":
      return <TourRouteVisual />;
    case "health-pulse":
      return <HealthPulseVisual />;
    case "commerce-auction":
      return <CommerceAuctionVisual />;
    case "secure-chat":
      return <SecureChatVisual />;
    case "ledger-vote":
      return <LedgerVoteVisual />;
    case "travel-web":
      return <TravelWebVisual />;
    default: {
      const unknown: never = variant;
      return unknown;
    }
  }
}

/**
 * Abstract, decorative illustration for a project — used instead of app
 * screenshots (employer products are confidential; nothing here depicts a real
 * screen, logo or brand). Fills its parent, is hidden from assistive tech and
 * adapts to both experiences through the colour tokens.
 *
 * The art is composed on a 480×360 canvas and scaled with `meet`, so it is never
 * cropped: landscape and portrait containers simply extend the gridded backdrop.
 */
export function ProjectVisual({ variant, className }: ProjectVisualProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        el.setAttribute("data-pv-motion", entry?.isIntersecting ? "on" : "off");
      },
      { rootMargin: "120px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-variant={variant}
      className={cn("relative h-full w-full overflow-hidden rounded-[inherit] bg-surface-2", className)}
    >
      <div className="absolute inset-0 bg-grid opacity-60 mask-fade-radial" />
      <svg
        viewBox="0 0 480 360"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full"
        focusable="false"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <style>{PAUSE_OFFSCREEN}</style>
        {renderVariant(variant)}
      </svg>
    </div>
  );
}
