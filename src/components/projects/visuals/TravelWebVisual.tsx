"use client";

import { useId } from "react";
import { Bar, INSET, Panel } from "./shared";

const MOTION =
  ".pv-tw-sun{animation:pv-tw-sun 9s ease-in-out infinite alternate}" +
  "@keyframes pv-tw-sun{from{transform:translateY(3px)}to{transform:translateY(-4px)}}";

/** Both ridges close with the hero panel's rounded bottom corners (r 10), so no clip-path is needed. */
const PANEL_BASE = "V262a10 10 0 0 1-10 10H98a10 10 0 0 1-10-10Z";
const RIDGE_BACK = `M88 236C130 222 160 214 196 222S252 196 280 184S330 166 352 178S384 196 392 194${PANEL_BASE}`;
const RIDGE_FRONT = `M88 252C140 236 190 240 236 250S330 238 392 246${PANEL_BASE}`;

/**
 * Travel website: a browser window framing a landing hero (setting sun,
 * layered ridges, headline + CTA) and a floating destination card.
 */
export function TravelWebVisual() {
  const skyId = `${useId()}-sky`;

  return (
    <>
      <style>{MOTION}</style>
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--accent)" }} stopOpacity={0.14} />
          <stop offset="0.75" style={{ stopColor: "var(--accent)" }} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Window chrome */}
      <Panel x={72} y={72} w={336} h={216} r={14} />
      <g className="fill-line-strong">
        <circle cx={90} cy={88} r={3.5} />
        <circle cx={102} cy={88} r={3.5} />
        <circle cx={114} cy={88} r={3.5} />
      </g>
      <Bar x={134} y={81} w={180} h={14} className={INSET} />
      <path d="M72 104H408" className="stroke-line-strong" strokeWidth={1} />

      {/* Hero */}
      <rect x={88} y={116} width={304} height={156} rx={10} className="fill-surface-2" />
      <rect x={88} y={116} width={304} height={156} rx={10} fill={`url(#${skyId})`} />
      <circle cx={318} cy={160} r={22} className="pv-tw-sun fill-accent-soft stroke-accent-text/70" strokeWidth={1.5} />
      <path d={RIDGE_BACK} className={INSET} />
      <path d={RIDGE_FRONT} className="fill-surface" />

      <Bar x={108} y={136} w={112} h={9} className="fill-fg/75" />
      <Bar x={108} y={152} w={76} h={9} className="fill-fg/75" />
      <Bar x={108} y={170} w={92} h={5} className="fill-muted/40" />
      <rect x={108} y={184} width={70} height={22} rx={11} className="fill-primary" />
      <Bar x={120} y={193} w={30} h={4} className="fill-primary-fg/70" />
      <path d="M158 195h9m-3.5-3.5 3.5 3.5-3.5 3.5" className="stroke-primary-fg" strokeWidth={1.5} />

      {/* Floating destination card */}
      <Panel x={344} y={240} w={92} h={50} r={12} />
      <circle cx={364} cy={265} r={11} className="fill-accent-2-soft" />
      <path d="M364 271.5s-5-4.6-5-8.5a5 5 0 0 1 10 0c0 3.9-5 8.5-5 8.5z" className="stroke-accent-2" strokeWidth={1.5} />
      <circle cx={364} cy={263} r={1.6} className="fill-accent-2" />
      <Bar x={382} y={257} w={40} className="fill-fg/70" />
      <Bar x={382} y={268} w={26} h={4} className={INSET} />
    </>
  );
}
