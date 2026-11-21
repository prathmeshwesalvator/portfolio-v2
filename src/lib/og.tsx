/**
 * Shared Open Graph artwork (rendered by next/og at build time).
 * Satori supports a subset of CSS: flexbox layouts and inline styles only.
 */
export const OG_SIZE = { width: 1200, height: 630 } as const;

interface OgArtworkProps {
  theme: "warm" | "dark";
  eyebrow: string;
  title: string;
  subtitle: string;
  footerLeft: string;
  footerRight: string;
}

/** warm = Recruiter (graphite + amber), dark = Freelance (near-black + violet). */
const THEMES = {
  warm: {
    bg: "#0d0c0a",
    fg: "#f4f0e8",
    muted: "#b1aa9d",
    line: "#2a2823",
    tile: "#25231e",
    stroke: "#f4f0e8",
    accent: "#f5b25a",
  },
  dark: {
    bg: "#0a0a0c",
    fg: "#f4f4f6",
    muted: "#a6a6b0",
    line: "#24242b",
    tile: "#6d4aff",
    stroke: "#ffffff",
    accent: "#b49cff",
  },
} as const;

export function OgArtwork({ theme, eyebrow, title, subtitle, footerLeft, footerRight }: OgArtworkProps) {
  const t = THEMES[theme];
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: t.bg,
        color: t.fg,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg width="64" height="64" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="16" fill={t.tile} />
          <path d="M13 46V18h8a8 8 0 0 1 0 16h-8" fill="none" stroke={t.stroke} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M33 46V18l8 14 8-14v28" fill="none" stroke={t.stroke} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="56.5" cy="45" r="3" fill="#34d399" />
        </svg>
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: t.muted }}>
          {eyebrow}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -2.5, maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: t.muted, maxWidth: 980, lineHeight: 1.35 }}>{subtitle}</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `2px solid ${t.line}`,
          paddingTop: 28,
          fontSize: 24,
          color: t.muted,
        }}
      >
        <div style={{ display: "flex", color: t.accent }}>{footerLeft}</div>
        <div style={{ display: "flex" }}>{footerRight}</div>
      </div>
    </div>
  );
}
