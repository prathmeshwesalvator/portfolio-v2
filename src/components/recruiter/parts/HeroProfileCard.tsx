"use client";

import { MapPin } from "lucide-react";
// Photo temporarily hidden at the owner's request — uncomment (with the block below) to restore.
// import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Monogram } from "@/components/shared/Monogram";
import { profile } from "@/data/profile";
import { recruiterHero } from "@/data/site";
import { cn } from "@/lib/cn";

type FactLabel = (typeof recruiterHero.facts)[number]["label"];

/** Hero facts by label. A missing fact hides its row instead of inventing a value. */
function getFact(label: FactLabel): string | undefined {
  return recruiterHero.facts.find((fact) => fact.label === label)?.value;
}

/** Condensed from profile.summary (Flutter · offline-first architecture · secure mobile development). */
const FOCUS = "Flutter · Offline-first · Secure mobile";

/*
 * Photo temporarily hidden — restore together with the <Image> block below.
 * Rendered portrait width per layout: xl → 376px · lg → 336px · sm–md → 224px · mobile → card width.
 *
 * const PHOTO_SIZES =
 *   "(min-width: 1280px) 376px, (min-width: 1024px) 336px, (min-width: 640px) 224px, (min-width: 488px) 408px, calc(100vw - 5rem)";
 */

function GlanceRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[5.75rem_minmax(0,1fr)] sm:gap-4">
      <dt className="font-mono text-[0.6875rem] leading-5 tracking-[0.14em] text-subtle uppercase">{label}</dt>
      <dd className="text-sm leading-5 text-fg">{children}</dd>
    </div>
  );
}

interface HeroProfileCardProps {
  /** Entrance classes/delay are owned by the hero so the whole fold stays in one rhythm. */
  className?: string;
  style?: CSSProperties;
}

/**
 * "At a glance" card: identity header + a spec-sheet style <dl>.
 * (The portrait is commented out for now — see the block below.)
 */
export function HeroProfileCard({ className, style }: HeroProfileCardProps) {
  const location = getFact("Based in");
  const educationSummary = getFact("Education");
  const shipping = getFact("Shipping");

  return (
    <div className={cn("w-full max-w-md sm:max-w-xl lg:max-w-none", className)} style={style}>
      <div className="rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-7">
        {/*
          Photo temporarily hidden at the owner's request — uncomment to restore
          (also restore the `Image` import and PHOTO_SIZES above, and remove the identity header below).

        <div className="relative mb-6 overflow-hidden rounded-2xl bg-surface-2">
          <Image
            src={profile.photoSquare.src}
            alt={profile.photoSquare.alt}
            sizes={PHOTO_SIZES}
            placeholder="blur"
            loading="eager"
            className="aspect-square h-auto w-full object-cover"
          />
        </div>
        */}

        {/* Identity header (stands in for the portrait). */}
        <div className="flex items-center gap-4 border-b border-line pb-5">
          <Monogram className="size-14 shrink-0 rounded-2xl shadow-soft" />
          <div className="min-w-0">
            <p className="text-lg leading-tight font-semibold tracking-tight text-fg">{profile.name}</p>
            <p className="mt-0.5 text-sm text-muted">{profile.title}</p>
            {location ? (
              <p className="mt-2 inline-flex max-w-full items-center gap-1.5 text-xs font-medium text-muted">
                <MapPin aria-hidden="true" className="size-3.5 shrink-0 text-accent-text" />
                <span className="truncate">
                  <span className="sr-only">Based in </span>
                  {location}
                </span>
              </p>
            ) : null}
          </div>
        </div>

        <dl className="mt-5 divide-y divide-line">
          <GlanceRow label="Currently">
            <span className="font-medium">{profile.current.role}</span>, {profile.current.company}
            <span className="block text-muted">{recruiterHero.statusDetail}</span>
          </GlanceRow>
          <GlanceRow label="Focus">{FOCUS}</GlanceRow>
          {educationSummary ? <GlanceRow label="Education">{educationSummary}</GlanceRow> : null}
          {shipping ? <GlanceRow label="Shipping">{shipping}</GlanceRow> : null}
        </dl>
      </div>
    </div>
  );
}
