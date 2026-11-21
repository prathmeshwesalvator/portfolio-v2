import { Bar, CARD, INSET, Panel, PanelPath, SHADOW } from "./shared";

const MOTION =
  ".pv-sc-dot{animation:pv-sc-dot 1.4s ease-in-out infinite}" +
  "@keyframes pv-sc-dot{0%,60%,100%{opacity:.35}30%{opacity:1}}";

/** Pill-shaped bubble with a tighter corner on the sender's side. */
function bubble(x: number, y: number, w: number, h: number, tail: "left" | "right") {
  const r = h / 2;
  const br = tail === "right" ? 6 : r;
  const bl = tail === "left" ? 6 : r;
  return (
    `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - br}` +
    `A${br} ${br} 0 0 1 ${x + w - br} ${y + h}H${x + bl}A${bl} ${bl} 0 0 1 ${x} ${y + h - bl}` +
    `V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
  );
}

const INCOMING = bubble(60, 112, 168, 36, "left");
const OUTGOING = bubble(112, 162, 188, 36, "right");
const TYPING = bubble(60, 212, 76, 34, "left");

/** QR-like 7×7 grid at (348,186), 8-unit modules: three finder corners + hard-coded data cells. */
const QR_FINDERS = [
  [348, 186],
  [380, 186],
  [348, 218],
] as const;
const QR_CELLS = [
  [0, 3], [2, 3], [3, 0], [3, 2], [3, 3], [3, 5], [3, 6],
  [4, 3], [4, 4], [4, 6], [5, 4], [5, 5], [6, 3], [6, 5], [6, 6],
] as const;
const QR_DATA = QR_CELLS.map(([row, col]) => `M${349 + col * 8} ${187 + row * 8}h6v6h-6z`).join("");

/**
 * Real-time messaging: incoming/outgoing bubbles with a typing indicator,
 * an end-to-end lock and a QR-style key-verification tile.
 */
export function SecureChatVisual() {
  return (
    <>
      <style>{MOTION}</style>

      {/* Conversation */}
      <PanelPath d={INCOMING} />
      <g className={INSET}>
        <Bar x={78} y={127} w={76} h={6} />
        <Bar x={160} y={127} w={50} h={6} />
      </g>

      <PanelPath d={OUTGOING} className="fill-primary" />
      <g className="fill-primary-fg/45">
        <Bar x={130} y={177} w={92} h={6} />
        <Bar x={228} y={177} w={48} h={6} />
      </g>
      <path d="M276 210l3 3 6-6M283 210l3 3 6-6" className="stroke-accent-2" strokeWidth={1.5} />

      <PanelPath d={TYPING} />
      {[84, 98, 112].map((cx, i) => (
        <circle
          key={cx}
          cx={cx}
          cy={229}
          r={3.5}
          className="pv-sc-dot fill-subtle"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}

      {/* End-to-end lock */}
      <circle cx={300} cy={165} r={15} className={SHADOW} />
      <circle cx={300} cy={162} r={15} className={CARD} strokeWidth={1.25} />
      <rect x={294} y={161} width={12} height={9} rx={2} className="fill-accent-2-soft stroke-accent-2" strokeWidth={1.5} />
      <path d="M296.5 161v-2.5a3.5 3.5 0 0 1 7 0v2.5" className="stroke-accent-2" strokeWidth={1.5} />

      {/* Key verification */}
      <Panel x={332} y={170} w={88} h={88} r={14} />
      {QR_FINDERS.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x + 1.5} y={y + 1.5} width={21} height={21} rx={5} className="stroke-fg/75" strokeWidth={3} />
          <rect x={x + 8} y={y + 8} width={8} height={8} rx={2} className="fill-fg/75" />
        </g>
      ))}
      <path d={QR_DATA} className="fill-fg/75" />
    </>
  );
}
