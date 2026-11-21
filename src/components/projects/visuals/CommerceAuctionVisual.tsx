import { Bar, INSET, Panel, SHADOW } from "./shared";

const MOTION =
  ".pv-ca-flow{animation:pv-ca-flow 2.2s linear infinite}" +
  ".pv-ca-ping{transform-box:fill-box;transform-origin:center;animation:pv-ca-ping 2.4s cubic-bezier(.16,1,.3,1) infinite}" +
  "@keyframes pv-ca-flow{to{stroke-dashoffset:-46}}" +
  "@keyframes pv-ca-ping{from{opacity:.55;transform:scale(1)}to{opacity:0;transform:scale(2.8)}}";

const TILES = [
  { x: 56, y: 96 },
  { x: 152, y: 96 },
  { x: 56, y: 192 },
  { x: 152, y: 192 },
] as const;
const ACTIVE_TILE = 1;

/** Bid history, bottom-aligned at y 248 — the last (current) bid is highlighted. */
const BIDS = [20, 32, 26, 42, 54, 70] as const;

/**
 * Real-time auctions: a 2×2 grid of abstract lots, a two-way socket channel
 * from the active lot and a live bid ticker with a rising history chart.
 */
export function CommerceAuctionVisual() {
  return (
    <>
      <style>{MOTION}</style>

      {/* Lots */}
      {TILES.map(({ x, y }, i) => (
        <Panel
          key={i}
          x={x}
          y={y}
          w={84}
          h={84}
          r={14}
          className={`fill-surface freelance:fill-surface-3 ${i === ACTIVE_TILE ? "stroke-accent-text/60" : "stroke-line-strong"}`}
        />
      ))}
      <g className={INSET}>
        {TILES.map(({ x, y }, i) => (
          <g key={i}>
            {i === ACTIVE_TILE ? null : <Bar x={x + 12} y={y + 64} w={26} />}
            <Bar x={x + 56} y={y + 64} w={16} />
          </g>
        ))}
        <circle cx={98} cy={130} r={17} />
        <path d="M98 213l15 26H83z" className="stroke-surface-3 freelance:stroke-line-strong" strokeWidth={5} />
        <path d="M180 242v-11a14 14 0 0 1 28 0v11z" />
      </g>
      <circle cx={98} cy={130} r={8} className="stroke-subtle/40" strokeWidth={1.5} />
      <Bar x={164} y={160} w={26} className="fill-accent-text" />
      <rect
        x={182}
        y={118}
        width={24}
        height={24}
        rx={5}
        transform="rotate(45 194 130)"
        className="fill-accent-soft stroke-accent-text"
        strokeWidth={1.5}
      />

      {/* Bid raised on the active lot */}
      <circle cx={234} cy={101} r={11} className={SHADOW} />
      <circle cx={234} cy={98} r={11} className="fill-accent" />
      <path d="M234 103v-10M229.5 97.5l4.5-4.5 4.5 4.5" className="stroke-accent-fg" strokeWidth={1.75} />

      {/* Socket channel: dotted rails, pulses travelling both ways */}
      <path d="M244 132h46M244 146h46" className="stroke-line-strong" strokeWidth={1.5} strokeDasharray="1.5 5" />
      <g className="stroke-accent-text" strokeWidth={2} strokeDasharray="8 38">
        <path d="M244 132h46" className="pv-ca-flow" />
        <path d="M290 146h-46" className="pv-ca-flow" style={{ animationDelay: "-1.1s" }} />
      </g>

      {/* Live bid ticker */}
      <Panel x={298} y={90} w={124} h={184} r={16} />
      <rect x={310} y={102} width={48} height={18} rx={9} className="fill-accent-2-soft" />
      <circle cx={320} cy={111} r={3} className="pv-ca-ping fill-accent-2" opacity={0} />
      <circle cx={320} cy={111} r={3} className="fill-accent-2" />
      <text x={327} y={114.5} fontSize={9} fontWeight={600} letterSpacing={0.6} className="fill-accent-2 font-mono">
        LIVE
      </text>
      <Bar x={310} y={134} w={62} h={10} className="fill-fg/80" />
      <path d="M382 141.5l5-5 5 5" className="stroke-accent-2" strokeWidth={1.75} />
      <g className={INSET}>
        <Bar x={384} y={108.5} w={26} />
        <Bar x={310} y={150} w={40} h={4} />
        {BIDS.slice(0, -1).map((h, i) => (
          <rect key={i} x={310 + i * 18} y={248 - h} width={10} height={h} rx={3} />
        ))}
        <Bar x={310} y={258} w={44} h={4} />
        <Bar x={392} y={258} w={18} h={4} />
      </g>
      <rect x={400} y={178} width={10} height={70} rx={3} className="fill-accent" />
    </>
  );
}
