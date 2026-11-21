import { CARD, Panel } from "./shared";

const MOTION = ".pv-lv-rail{animation:pv-lv-rail 8s linear infinite}@keyframes pv-lv-rail{to{stroke-dashoffset:-30}}";

/** Rounded dash rows that read as hash digests. */
const HASH = "stroke-surface-3 freelance:stroke-line-strong";
const HASH_A = "M70 180h10m8 0h8m8 0h14m8 0h6M70 192h6m8 0h18m8 0h10M70 204h14m8 0h6";
const HASH_B = "M204 232h14m8 0h8m8 0h22m8 0h8";
const HASH_C = "M344 180h8m8 0h14m8 0h6m8 0h12M344 192h16m8 0h6m8 0h12M344 204h6m8 0h16";

/** Interlocking chain links centred in the gaps between blocks. */
const LINK_GAPS = [150, 294] as const;

function BlockLabel({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} fontSize={10} letterSpacing={0.5} className="fill-subtle font-mono">
      {children}
    </text>
  );
}

/**
 * E-voting on a ledger: three chained blocks with hash rows; the middle block
 * holds a ballot being cast, marked as verified.
 */
export function LedgerVoteVisual() {
  return (
    <>
      <style>{MOTION}</style>

      {/* Ledger rail */}
      <path d="M30 180H450" className="pv-lv-rail stroke-subtle/35" strokeWidth={1.5} strokeDasharray="1.5 6" />

      {/* Links */}
      {LINK_GAPS.map((g) => (
        <g key={g}>
          <rect x={g + 3} y={175} width={30} height={10} rx={5} className="fill-surface-2" />
          <g className="stroke-subtle/70" strokeWidth={1.5}>
            <rect x={g + 3} y={175} width={18} height={10} rx={5} />
            <rect x={g + 15} y={175} width={18} height={10} rx={5} />
          </g>
        </g>
      ))}

      {/* Block #01 */}
      <Panel x={56} y={136} w={94} h={88} r={12} />
      <BlockLabel x={70} y={158}>#01</BlockLabel>
      <path d={HASH_A} className={HASH} strokeWidth={4} />

      {/* Block #03 */}
      <Panel x={330} y={136} w={94} h={88} r={12} />
      <BlockLabel x={344} y={158}>#03</BlockLabel>
      <path d={HASH_C} className={HASH} strokeWidth={4} />

      {/* Block #02 — ballot cast + verified */}
      <Panel x={186} y={118} w={108} h={124} r={14} className="fill-surface stroke-accent-text/50 freelance:fill-surface-3" />
      <BlockLabel x={202} y={141}>#02</BlockLabel>
      <rect x={227} y={150} width={26} height={34} rx={3} className={CARD} strokeWidth={1.25} />
      <path d="M233 165l4 4 8-8" className="stroke-accent-2" strokeWidth={2} />
      <rect x={212} y={180} width={56} height={40} rx={7} className="fill-surface freelance:fill-surface-3" />
      <rect x={212} y={180} width={56} height={40} rx={7} className="fill-accent-soft stroke-accent-text/70" strokeWidth={1.5} />
      <path d="M222 180h36" className="stroke-accent-text" strokeWidth={2} />
      <path d="M230 202h20" className="stroke-accent-text/50" strokeWidth={2} />
      <path d={HASH_B} className={HASH} strokeWidth={4} />
    </>
  );
}
