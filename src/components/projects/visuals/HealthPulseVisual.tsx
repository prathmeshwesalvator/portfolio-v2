import { Bar, CARD, INSET, Panel, SHADOW } from "./shared";

const MOTION =
  ".pv-hp-ecg{animation:pv-hp-ecg 3.6s linear infinite}" +
  ".pv-hp-spin{transform-box:fill-box;transform-origin:center;animation:pv-hp-spin 18s linear infinite}" +
  "@keyframes pv-hp-ecg{from{stroke-dashoffset:14}to{stroke-dashoffset:-100}}" +
  "@keyframes pv-hp-spin{to{transform:rotate(360deg)}}";

const ECG = "M106 200H168q6-10 12 0h8l4 6 8-52 8 64 6-18h18q10-16 20 0h36q5-8 10 0h8l3 5 7-44 7 54 5-15H374";

/** Pointy-top hexagon, radius 18. */
const hex = (cx: number) => `M${cx} 244l15.6 9v18L${cx} 280l-15.6-9v-18z`;
const HEX_X = [124, 176, 228] as const;

/**
 * Health records: an ECG trace on a soft card, a three-hex verification chain
 * (blockchain) and an ML "scan" reticle with crosshair ticks.
 */
export function HealthPulseVisual() {
  return (
    <>
      <style>{MOTION}</style>

      {/* Monitor card */}
      <Panel x={88} y={108} w={304} h={144} r={16} />
      <rect x={106} y={124} width={20} height={20} rx={6} className="fill-accent-soft" />
      <path d="M116 129v10M111 134h10" className="stroke-accent-text" strokeWidth={1.75} />
      <Bar x={134} y={131.5} w={64} h={6} className={INSET} />
      <circle cx={210} cy={134.5} r={3} className="fill-accent-2" />
      <path
        d="M106 172H374M106 228H374"
        className="stroke-line-strong"
        strokeWidth={1}
        strokeDasharray="1 5"
      />

      {/* ECG: quiet trace + a travelling highlight (rests on the first beat without motion) */}
      <path d={ECG} className="stroke-accent-text/45" strokeWidth={1.75} />
      <path
        d={ECG}
        pathLength={100}
        className="pv-hp-ecg stroke-accent-text"
        strokeWidth={2.25}
        strokeDasharray="14 100"
        strokeDashoffset={-18}
      />

      {/* Verification chain */}
      <path d="M141.6 262h16.8M193.6 262h16.8" className="stroke-line-strong" strokeWidth={1.5} />
      {HEX_X.map((cx, i) => {
        const verified = i === HEX_X.length - 1;
        return (
          <g key={cx}>
            <path d={hex(cx)} transform="translate(0 3)" className={SHADOW} />
            <path d={hex(cx)} className={CARD} strokeWidth={1.25} />
            {verified ? (
              <>
                <path d={hex(cx)} className="fill-accent-2-soft stroke-accent-2" strokeWidth={1.5} />
                <path d={`M${cx - 6} 262l4 4 8-8`} className="stroke-accent-2" strokeWidth={1.75} />
              </>
            ) : (
              <path d={`M${cx - 7} 259h14M${cx - 7} 265h9`} className="stroke-subtle/60" strokeWidth={1.5} />
            )}
          </g>
        );
      })}

      {/* Scan reticle */}
      <circle cx={380} cy={107} r={22} className={SHADOW} />
      <circle cx={380} cy={104} r={22} className={CARD} strokeWidth={1.25} />
      <circle
        cx={380}
        cy={104}
        r={34}
        className="pv-hp-spin stroke-accent-text/70"
        strokeWidth={1.5}
        strokeDasharray="40 13.41"
      />
      <path d="M380 62v-8M380 146v8M338 104h-8M422 104h8" className="stroke-accent-text" strokeWidth={1.5} />
      <path d="M380 92v5M380 111v5M368 104h5M387 104h5" className="stroke-subtle" strokeWidth={1.5} />
      <circle cx={380} cy={104} r={2.5} className="fill-accent-text" />
    </>
  );
}
