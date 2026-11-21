import type { JSX } from "react";
import { cn } from "@/lib/cn";
import type { CapabilityDiagramKind } from "@/types";

/**
 * Small technical figures for the Recruiter capability board. Pure SVG, every
 * colour token-driven, decorative (aria-hidden — the tile text carries meaning).
 * Loops are CSS (`animate-dash-flow`, `animate-swap-*`): they pause offscreen via
 * [data-motion] and stop entirely under prefers-reduced-motion (globals.css).
 * Nothing here depicts a real product screen, API or data.
 */

const BOX = "fill-surface-3 stroke-line-strong";
const ACCENT_BOX = "fill-accent-soft stroke-accent-text";
const FLOW = "animate-dash-flow";

function T({
  x,
  y,
  children,
  size = 9,
  anchor = "start",
  className = "fill-muted",
}: {
  x: number;
  y: number;
  children: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
  className?: string;
}) {
  return (
    <text x={x} y={y} fontSize={size} textAnchor={anchor} className={cn("font-mono", className)}>
      {children}
    </text>
  );
}

function CleanArchitecture() {
  return (
    <svg viewBox="0 0 380 200" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx={96} cy={100} r={86} className="fill-surface-3/40 stroke-line-strong" strokeWidth={1.25} />
      <circle cx={96} cy={100} r={58} className={BOX} strokeWidth={1.25} />
      <circle cx={96} cy={100} r={30} className={ACCENT_BOX} strokeWidth={1.25} />
      <T x={96} y={29} anchor="middle" size={8} className="fill-subtle">
        PRESENTATION
      </T>
      <T x={96} y={57} anchor="middle" size={8} className="fill-subtle">
        DOMAIN
      </T>
      <T x={96} y={103} anchor="middle" size={8} className="fill-accent-text">
        ENTITIES
      </T>

      {/* Dependencies point inward */}
      <path d="M190 100H132" className={cn("stroke-accent-text", FLOW)} strokeWidth={1.5} strokeDasharray="4 4" />
      <path d="M138 95l-6 5 6 5" className="stroke-accent-text" strokeWidth={1.5} />

      <g strokeWidth={1.25}>
        <rect x={204} y={50} width={11} height={11} rx={3} className="fill-surface-3/40 stroke-line-strong" />
        <rect x={204} y={82} width={11} height={11} rx={3} className={BOX} />
        <rect x={204} y={114} width={11} height={11} rx={3} className={ACCENT_BOX} />
      </g>
      <T x={223} y={59} className="fill-fg">
        UI · Widgets · BLoC
      </T>
      <T x={223} y={91} className="fill-fg">
        Use cases · Repo contracts
      </T>
      <T x={223} y={123} className="fill-fg">
        Entities · Business rules
      </T>
      <T x={204} y={164} size={8.5} className="fill-accent-text">
        ← dependencies point inward
      </T>
    </svg>
  );
}

function OfflineFirst() {
  return (
    <svg viewBox="0 0 380 200" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Device with local store */}
      <rect x={10} y={22} width={88} height={156} rx={16} className={BOX} strokeWidth={1.25} />
      <rect x={42} y={31} width={24} height={4} rx={2} className="fill-line-strong" />
      <g className={ACCENT_BOX} strokeWidth={1.25}>
        <path d="M32 84v28a22 6 0 0 0 44 0V84" />
        <ellipse cx={54} cy={84} rx={22} ry={6} />
        <path d="M32 98a22 6 0 0 0 44 0" fill="none" />
      </g>
      <T x={54} y={138} anchor="middle" className="fill-fg">
        Drift
      </T>
      <T x={54} y={151} anchor="middle" size={7.5} className="fill-subtle">
        local store
      </T>

      {/* State A — offline: requests queue on the device */}
      <g className="animate-swap-a">
        <g className="fill-accent stroke-accent" strokeWidth={1}>
          <rect x={112} y={93} width={14} height={14} rx={3} />
          <rect x={130} y={93} width={14} height={14} rx={3} />
          <rect x={148} y={93} width={14} height={14} rx={3} />
        </g>
        <path d="M172 100h46M242 100h46" className="stroke-line-strong" strokeWidth={1.5} strokeDasharray="3 5" />
        <path d="M225 95l10 10M235 95l-10 10" className="stroke-subtle" strokeWidth={1.5} />
        <T x={230} y={72} anchor="middle" size={8.5} className="fill-accent-text">
          OFFLINE · 3 QUEUED
        </T>
      </g>

      {/* State B — online: the queue drains to the API */}
      <g className="animate-swap-b">
        <g className="fill-none stroke-line-strong" strokeWidth={1}>
          <rect x={112} y={93} width={14} height={14} rx={3} />
          <rect x={130} y={93} width={14} height={14} rx={3} />
          <rect x={148} y={93} width={14} height={14} rx={3} />
        </g>
        <path d="M172 100h116" className={cn("stroke-accent-2", FLOW)} strokeWidth={1.75} strokeDasharray="4 4" />
        <path d="M282 95l6 5-6 5" className="stroke-accent-2" strokeWidth={1.75} />
        <T x={230} y={72} anchor="middle" size={8.5} className="fill-accent-2">
          ONLINE · SYNCED ✓
        </T>
      </g>

      <T x={230} y={130} anchor="middle" size={8} className="fill-subtle">
        WorkManager · background sync
      </T>

      {/* API */}
      <path
        d="M318 116h40a14 14 0 0 0 2-27.8A20 20 0 0 0 322 84a14 14 0 0 0-4 32z"
        className={BOX}
        strokeWidth={1.25}
      />
      <T x={338} y={140} anchor="middle" className="fill-fg">
        REST API
      </T>
    </svg>
  );
}

function Bloc() {
  return (
    <svg viewBox="0 0 320 160" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x={20} y={58} width={84} height={44} rx={10} className={BOX} strokeWidth={1.25} />
      <T x={62} y={78} anchor="middle" size={10} className="fill-fg">
        UI
      </T>
      <T x={62} y={92} anchor="middle" size={7.5} className="fill-subtle">
        widgets
      </T>

      <rect x={216} y={58} width={84} height={44} rx={10} className={ACCENT_BOX} strokeWidth={1.25} />
      <T x={258} y={78} anchor="middle" size={10} className="fill-accent-text">
        BLoC
      </T>
      <T x={258} y={92} anchor="middle" size={7.5} className="fill-subtle">
        / Cubit
      </T>

      <path d="M104 68C140 24 180 24 216 68" className={cn("stroke-accent-text", FLOW)} strokeWidth={1.5} strokeDasharray="4 4" />
      <path d="M207.5 63.5 216 68l-1-9.5" className="stroke-accent-text" strokeWidth={1.5} />
      <T x={160} y={24} anchor="middle" size={8.5}>
        add(event)
      </T>

      <path d="M216 92C180 136 140 136 104 92" className={cn("stroke-accent-2", FLOW)} strokeWidth={1.5} strokeDasharray="4 4" />
      <path d="M112.5 96.5 104 92l1 9.5" className="stroke-accent-2" strokeWidth={1.5} />
      <T x={160} y={146} anchor="middle" size={8.5}>
        emit(state)
      </T>
    </svg>
  );
}

function Security() {
  return (
    <svg viewBox="0 0 320 160" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x={12} y={56} width={76} height={40} rx={8} className={BOX} strokeWidth={1.25} />
      <T x={50} y={79} anchor="middle" className="fill-fg">
        {"{ data }"}
      </T>

      <path d="M90 76h32" className={cn("stroke-accent-text", FLOW)} strokeWidth={1.5} strokeDasharray="4 4" />
      <path d="M117 71l6 5-6 5" className="stroke-accent-text" strokeWidth={1.5} />

      <T x={160} y={36} anchor="middle" size={8.5} className="fill-accent-text">
        RSA-AES
      </T>
      <rect x={126} y={44} width={68} height={64} rx={14} className={ACCENT_BOX} strokeWidth={1.25} />
      <path d="M150 70v-6a10 10 0 0 1 20 0v6" className="stroke-accent-text" strokeWidth={2} />
      <rect x={144} y={70} width={32} height={24} rx={5} className="fill-accent-text/15 stroke-accent-text" strokeWidth={1.5} />
      <circle cx={160} cy={81} r={3} className="fill-accent-text" />

      <path d="M196 76h32" className={cn("stroke-accent-text", FLOW)} strokeWidth={1.5} strokeDasharray="4 4" />
      <path d="M223 71l6 5-6 5" className="stroke-accent-text" strokeWidth={1.5} />

      <rect x={232} y={56} width={76} height={40} rx={8} className={BOX} strokeWidth={1.25} />
      <g className="fill-line-strong">
        <rect x={241} y={65} width={20} height={4} rx={2} />
        <rect x={265} y={65} width={12} height={4} rx={2} />
        <rect x={281} y={65} width={18} height={4} rx={2} />
        <rect x={241} y={74} width={10} height={4} rx={2} />
        <rect x={255} y={74} width={26} height={4} rx={2} />
        <rect x={285} y={74} width={14} height={4} rx={2} />
        <rect x={241} y={83} width={24} height={4} rx={2} />
        <rect x={269} y={83} width={14} height={4} rx={2} />
        <rect x={287} y={83} width={12} height={4} rx={2} />
      </g>

      <path d="M160 110v22" className="stroke-line-strong" strokeWidth={1.25} strokeDasharray="2 3" />
      <g className="stroke-muted" strokeWidth={1.5}>
        <circle cx={137} cy={146} r={5} />
        <path d="M142 146h14M152 146v4M156 146v3" />
      </g>
      <T x={164} y={149} size={8} className="fill-subtle">
        Keystore · Keychain
      </T>
    </svg>
  );
}

function Performance() {
  return (
    <svg viewBox="0 0 320 160" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <T x={16} y={26} size={8} className="fill-subtle">
        APP STARTUP
      </T>

      <T x={16} y={64}>
        Before
      </T>
      <rect x={72} y={54} width={224} height={12} rx={6} className="fill-line-strong" />

      <T x={16} y={96} className="fill-fg">
        After
      </T>
      <rect x={72} y={86} width={179} height={12} rx={6} className="fill-accent" />
      <rect x={251.5} y={86.5} width={44} height={11} rx={5.5} className="fill-none stroke-line-strong" strokeDasharray="2 2" />
      <path d="M251 46v58" className="stroke-accent-text" strokeWidth={1} strokeDasharray="2 3" />
      <T x={274} y={118} anchor="middle" size={10} className="fill-accent-text">
        ~20%
      </T>

      <T x={16} y={146} size={7.5} className="fill-subtle">
        CRASHLYTICS
      </T>
      <path d="M94 142h78l6-9 6 15 6-7h104" className="stroke-accent-2" strokeWidth={1.5} />
      <circle cx={296} cy={142} r={2.5} className="animate-glow fill-accent-2" />
    </svg>
  );
}

function Native() {
  return (
    <svg viewBox="0 0 320 160" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x={14} y={56} width={92} height={48} rx={10} className={ACCENT_BOX} strokeWidth={1.25} />
      <T x={60} y={78} anchor="middle" size={10} className="fill-accent-text">
        Flutter
      </T>
      <T x={60} y={92} anchor="middle" size={7.5} className="fill-subtle">
        Dart
      </T>

      <rect x={214} y={22} width={92} height={42} rx={10} className={BOX} strokeWidth={1.25} />
      <T x={260} y={46.5} anchor="middle" className="fill-fg">
        Android
      </T>
      <rect x={214} y={96} width={92} height={42} rx={10} className={BOX} strokeWidth={1.25} />
      <T x={260} y={120.5} anchor="middle" className="fill-fg">
        iOS
      </T>

      <path d="M106 70c44 0 64-27 108-27" className={cn("stroke-accent-text", FLOW)} strokeWidth={1.5} strokeDasharray="4 4" />
      <path d="M208 39l6 4-6 4" className="stroke-accent-text" strokeWidth={1.5} />
      <T x={150} y={40} anchor="middle" size={8}>
        MethodChannel
      </T>

      <path d="M214 117c-44 0-64-27-108-27" className={cn("stroke-accent-2", FLOW)} strokeWidth={1.5} strokeDasharray="4 4" />
      <path d="M112 86l-6 4 6 4" className="stroke-accent-2" strokeWidth={1.5} />
      <T x={150} y={132} anchor="middle" size={8}>
        EventChannel
      </T>
    </svg>
  );
}

function DeepLinking() {
  return (
    <svg viewBox="0 0 320 160" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x={30} y={18} width={68} height={120} rx={12} className={BOX} strokeWidth={1.25} />
      <g className="fill-line-strong">
        <rect x={40} y={32} width={36} height={4} rx={2} />
        <rect x={40} y={41} width={48} height={3} rx={1.5} />
      </g>
      <rect x={40} y={54} width={48} height={30} rx={5} className="fill-surface stroke-line" strokeWidth={1} />
      <rect x={40} y={96} width={48} height={14} rx={7} className="fill-accent" />
      <T x={64} y={154} anchor="middle" size={8} className="fill-subtle">
        App A
      </T>

      <rect x={222} y={18} width={68} height={120} rx={12} className={BOX} strokeWidth={1.25} />
      <rect x={232} y={32} width={30} height={4} rx={2} className="fill-line-strong" />
      <rect x={232} y={50} width={48} height={38} rx={5} className={ACCENT_BOX} strokeWidth={1.25} />
      <g className="fill-line-strong">
        <rect x={232} y={98} width={48} height={4} rx={2} />
        <rect x={232} y={108} width={34} height={4} rx={2} />
      </g>
      <T x={256} y={154} anchor="middle" size={8} className="fill-subtle">
        App B
      </T>

      <path d="M88 103C140 132 180 30 232 70" className={cn("stroke-accent-text", FLOW)} strokeWidth={1.5} strokeDasharray="4 4" />
      <path d="M223.5 67.5 232 70l-3.5-8.5" className="stroke-accent-text" strokeWidth={1.5} />
      <rect x={124} y={46} width={72} height={18} rx={9} className="fill-surface stroke-line-strong" strokeWidth={1} />
      <T x={160} y={58.5} anchor="middle" size={8} className="fill-fg">
        deep link
      </T>
    </svg>
  );
}

function Api() {
  return (
    <svg viewBox="0 0 320 160" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x={16} y={16} width={150} height={24} rx={12} className={BOX} strokeWidth={1.25} />
      <rect x={21} y={21} width={32} height={14} rx={7} className="fill-accent-2-soft" />
      <T x={37} y={31} anchor="middle" size={8} className="fill-accent-2">
        GET
      </T>
      <T x={60} y={31.5} size={8.5} className="fill-fg">
        /v1/items
      </T>

      <path d="M30 54v66" className="stroke-line-strong" strokeWidth={1.25} />
      <circle cx={30} cy={60} r={4} className="fill-bg stroke-subtle" strokeWidth={1.25} />
      <T x={44} y={63} size={8} className="fill-subtle">
        attempt 1 · timeout
      </T>
      <circle cx={30} cy={88} r={4} className={ACCENT_BOX} strokeWidth={1.25} />
      <T x={44} y={91} size={8} className="fill-accent-text">
        queued · retry
      </T>
      <circle cx={30} cy={116} r={4} className="animate-glow fill-accent-2" />
      <T x={44} y={119} size={8} className="fill-accent-2">
        200 OK · JSON
      </T>

      <rect x={190} y={16} width={114} height={128} rx={10} className={BOX} strokeWidth={1.25} />
      <T x={202} y={38} size={10} className="fill-subtle">
        {"{"}
      </T>
      {[52, 66, 80, 94].map((y, index) => (
        <g key={y}>
          <rect x={212} y={y - 4} width={28} height={4} rx={2} className="fill-accent-text/70" />
          <rect x={246} y={y - 4} width={[44, 30, 38, 24][index]} height={4} rx={2} className="fill-line-strong" />
        </g>
      ))}
      <T x={202} y={118} size={10} className="fill-subtle">
        {"}"}
      </T>
      <T x={16} y={150} size={7.5} className="fill-subtle">
        REST · WebSockets
      </T>
    </svg>
  );
}

const DIAGRAMS: Record<CapabilityDiagramKind, () => JSX.Element> = {
  "clean-architecture": CleanArchitecture,
  "offline-first": OfflineFirst,
  bloc: Bloc,
  security: Security,
  performance: Performance,
  native: Native,
  "deep-linking": DeepLinking,
  api: Api,
};

/** Renders one capability figure, scaled to fit (never cropped) inside its parent. */
export function CapabilityDiagram({ kind, className }: { kind: CapabilityDiagramKind; className?: string }) {
  const Diagram = DIAGRAMS[kind];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "[&>svg]:h-full [&>svg]:w-full [&>svg]:overflow-visible",
        className,
      )}
    >
      <Diagram />
    </div>
  );
}
