"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { Bar, CARD, INSET, Panel, SHADOW } from "./shared";

const MOTION =
  ".pv-fx-orbit{animation:pv-fx-orbit 20s linear infinite}.pv-fx-flow{animation:pv-fx-flow 3.2s linear infinite}" +
  "@keyframes pv-fx-orbit{to{stroke-dashoffset:-85}}@keyframes pv-fx-flow{to{stroke-dashoffset:-20}}";

/** Points on the tilted orbit (rx 182, ry 104, -8° about 240,188) at 200°, 310°, 30° and 120°. */
const BADGES = [
  { x: 65.7, y: 176.6, glyph: "₹", home: true },
  { x: 344.7, y: 92.8, glyph: "$", home: false },
  { x: 403.3, y: 217.6, glyph: "€", home: false },
  { x: 162.5, y: 289.8, glyph: "£", home: false },
] as const;

/**
 * Forex & travel card: a tilted contactless card inside a currency orbit,
 * a dashed exchange arc (₹ → £) and a security shield. Generic card — no brand.
 */
export function ForexCardVisual() {
  const sheenId = `${useId()}-sheen`;

  return (
    <>
      <style>{MOTION}</style>
      <defs>
        <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--accent)" }} stopOpacity={0.16} />
          <stop offset="0.65" style={{ stopColor: "var(--accent)" }} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Currency orbit */}
      <ellipse
        cx={240}
        cy={188}
        rx={182}
        ry={104}
        transform="rotate(-8 240 188)"
        className="pv-fx-orbit stroke-subtle/45"
        strokeWidth={1.5}
        strokeDasharray="1.5 7"
      />

      {/* Exchange arc ₹ → £ (outside the orbit) */}
      <path d="M50 192Q40 300 140 294" className="pv-fx-flow stroke-accent-text" strokeWidth={1.5} strokeDasharray="4 6" />
      <path d="M134.4 289.8 140 294l-5.1 4.8" className="stroke-accent-text" strokeWidth={1.5} />

      {/* Card */}
      <g transform="rotate(-10 240 188)">
        <Panel x={148} y={130} w={184} h={116} r={14} />
        <rect x={148} y={130} width={184} height={116} rx={14} fill={`url(#${sheenId})`} />
        {/* chip */}
        <rect
          x={166}
          y={156}
          width={30}
          height={23}
          rx={5}
          className="fill-surface-3 stroke-subtle/50 freelance:fill-line-strong"
          strokeWidth={1}
        />
        <path d="M176 156v23M186 156v23M166 167.5h10M186 167.5h10" className="stroke-subtle/50" strokeWidth={1} />
        {/* contactless */}
        <path
          d="M213.9 162.9a6 6 0 0 1 0 9.2M217.1 159.1a11 11 0 0 1 0 16.8M220.3 155.2a16 16 0 0 1 0 24.6"
          className="stroke-accent-text"
          strokeWidth={1.75}
        />
        {/* globe */}
        <g className="stroke-subtle/70" strokeWidth={1.25}>
          <circle cx={308} cy={156} r={8} />
          <ellipse cx={308} cy={156} rx={3.5} ry={8} />
          <path d="M300 156h16" />
        </g>
        {/* masked number groups + holder line (no digits on purpose) */}
        <g className={INSET}>
          <Bar x={166} y={200} w={30} h={6} />
          <Bar x={204} y={200} w={30} h={6} />
          <Bar x={242} y={200} w={30} h={6} />
          <Bar x={280} y={200} w={30} h={6} />
          <Bar x={166} y={220} w={70} />
          <Bar x={290} y={220} w={24} />
        </g>
      </g>

      {/* Security shield, overlapping the card corner */}
      <Panel x={324} y={216} w={44} h={44} r={12} />
      <path
        d="M346 227l9 3.4v6.6c0 5.6-3.7 9.8-9 12-5.3-2.2-9-6.4-9-12v-6.6z"
        className="fill-accent-2-soft stroke-accent-2"
        strokeWidth={1.5}
      />
      <circle cx={346} cy={236} r={2.2} className="fill-accent-2" />
      <path d="M346 238v4" className="stroke-accent-2" strokeWidth={1.75} />

      {/* Currency badges */}
      {BADGES.map(({ x, y, glyph, home }) => (
        <g key={glyph}>
          <circle cx={x} cy={y + 3} r={17} className={SHADOW} />
          <circle cx={x} cy={y} r={17} className={CARD} strokeWidth={1.25} />
          {home ? (
            <circle cx={x} cy={y} r={17} className="fill-accent-soft stroke-accent-text/60" strokeWidth={1.25} />
          ) : null}
          <text
            x={x}
            y={y + 5.25}
            textAnchor="middle"
            fontSize={15}
            className={cn("font-mono", home ? "fill-accent-text" : "fill-muted")}
          >
            {glyph}
          </text>
        </g>
      ))}
    </>
  );
}
