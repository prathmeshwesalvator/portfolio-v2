/**
 * Shared primitives for the abstract project illustrations.
 * Every colour is token-driven, so one drawing reads as charcoal/blue on warm
 * off-white (Recruiter) and violet/emerald on near-black (Freelance).
 * Canvas: viewBox 0 0 480 360 (see ProjectVisual).
 */

/** Raised card: white on off-white (light) / lifted graphite on near-black (dark). */
export const CARD = "fill-surface stroke-line-strong freelance:fill-surface-3";

/** Skeleton bars and inset shapes placed on a CARD. */
export const INSET = "fill-surface-3 freelance:fill-line-strong";

/** Knock-out stroke matching the CARD fill (separates crossing lines). */
export const CARD_KNOCKOUT = "stroke-surface freelance:stroke-surface-3";

/** Low-opacity contact shadow; deeper in dark mode, where depth needs more weight. */
export const SHADOW = "fill-black/[0.045] freelance:fill-black/40";
const SHADOW_FAR = "fill-black/[0.03] freelance:fill-black/25";

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
}

/** Two stepped, offset layers read as a soft drop shadow without SVG filters. */
export function Shadow({ x, y, w, h, r }: Box) {
  return (
    <>
      {w > 32 && h > 32 ? (
        <rect x={x + 6} y={y + 12} width={w - 12} height={h - 4} rx={r} className={SHADOW_FAR} />
      ) : null}
      <rect x={x} y={y + 4} width={w} height={h} rx={r} className={SHADOW} />
    </>
  );
}

/** Shadowed card surface. */
export function Panel({ x, y, w, h, r, className = CARD }: Box & { className?: string }) {
  return (
    <>
      <Shadow x={x} y={y} w={w} h={h} r={r} />
      <rect x={x} y={y} width={w} height={h} rx={r} className={className} strokeWidth={1.25} />
    </>
  );
}

/** Shadowed free-form surface (bubbles, receipts). */
export function PanelPath({ d, className = CARD }: { d: string; className?: string }) {
  return (
    <>
      <path d={d} transform="translate(0 4)" className={SHADOW} />
      <path d={d} className={className} strokeWidth={1.25} />
    </>
  );
}

/**
 * Rounded skeleton bar (stands in for text — illustrations never carry real copy).
 * Without a className it inherits the fill of its group, e.g. `<g className={INSET}>`.
 */
export function Bar({ x, y, w, h = 5, className }: { x: number; y: number; w: number; h?: number; className?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} className={className} />;
}
