import { Bar, CARD, CARD_KNOCKOUT, INSET, Panel, PanelPath, SHADOW } from "./shared";

const MOTION = ".pv-tr-route{animation:pv-tr-route 6s linear infinite}@keyframes pv-tr-route{to{stroke-dashoffset:-56}}";

const ROUTE = "M72 272C120 272 150 208 200 208S270 150 330 150C380 150 392 112 404 84";

/** Zig-zag receipt edge, 92 wide. */
const RECEIPT =
  "M328 218h72a10 10 0 0 1 10 10v74" +
  "l-7.67 6-7.67-6-7.67 6-7.67-6-7.67 6-7.67-6-7.67 6-7.67-6-7.67 6-7.67-6-7.67 6-7.67-6" +
  "V228a10 10 0 0 1 10-10z";

function Pin({ x, y, active = false }: { x: number; y: number; active?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cy={1} rx={7} ry={2.5} className={SHADOW} />
      <path
        d="M0 0C-2-5-10-9-10-16a10 10 0 1 1 20 0c0 7-8 11-10 16z"
        className={active ? "fill-accent stroke-accent" : CARD}
        strokeWidth={1.25}
      />
      <circle cy={-16} r={3.5} className={active ? "fill-accent-fg" : "fill-accent-text"} />
    </g>
  );
}

/**
 * Tour operations: a winding route with waypoints, an offline → synced status
 * pill and a settled-payment receipt stack. Abstract — no map or app UI.
 */
export function TourRouteVisual() {
  return (
    <>
      <style>{MOTION}</style>

      {/* Route: road band + travelling lane dashes */}
      <path d={ROUTE} className="stroke-line-strong/70" strokeWidth={8} />
      <path d={ROUTE} className="pv-tr-route stroke-accent-text" strokeWidth={2} strokeDasharray="6 8" />

      {/* Origin */}
      <circle cx={72} cy={272} r={7} className="fill-surface stroke-accent-text freelance:fill-surface-3" strokeWidth={1.5} />
      <circle cx={72} cy={272} r={2.5} className="fill-accent-text" />

      <Pin x={200} y={208} />
      <Pin x={330} y={150} />
      <Pin x={404} y={84} active />

      {/* Offline → sync status */}
      <Panel x={60} y={128} w={108} h={40} r={20} />
      <g transform="translate(76 136)" strokeWidth={1.5}>
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" className="stroke-subtle" />
        <path d="M4 3l16 17" className={CARD_KNOCKOUT} strokeWidth={4.5} />
        <path d="M4 3l16 17" className="stroke-subtle" />
      </g>
      <path d="M108 148h12m-4-4 4 4-4 4" className="stroke-subtle/60" strokeWidth={1.5} />
      <path
        d="M131 148a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L149 144M149 139v5h-5M149 148a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L131 152M136 152h-5v5"
        className="stroke-accent-2"
        strokeWidth={1.5}
      />

      {/* Receipt stack */}
      <g transform="rotate(7 380 256)">
        <Panel x={336} y={206} w={88} h={100} r={10} />
      </g>
      <PanelPath d={RECEIPT} />
      <circle cx={336} cy={238} r={8} className="fill-accent-2-soft" />
      <path d="M332.5 238l2.5 2.5 4.5-4.5" className="stroke-accent-2" strokeWidth={1.5} />
      <path d="M330 258h68" className="stroke-line-strong" strokeWidth={1.25} strokeDasharray="2 4" />
      <g className={INSET}>
        <Bar x={350} y={232} w={44} />
        <Bar x={350} y={241} w={28} h={4} />
        <Bar x={330} y={268} w={30} h={4} />
        <Bar x={382} y={268} w={16} h={4} />
        <Bar x={330} y={278} w={22} h={4} />
        <Bar x={386} y={278} w={12} h={4} />
      </g>
      <Bar x={330} y={290} w={26} className="fill-fg/70" />
      <rect x={372} y={289.5} width={26} height={6} rx={3} className="fill-accent-text" />
    </>
  );
}
