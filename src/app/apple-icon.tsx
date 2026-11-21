import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#16161a" }}>
        <svg width="180" height="180" viewBox="0 0 64 64">
          <path d="M13 46V18h8a8 8 0 0 1 0 16h-8" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M33 46V18l8 14 8-14v28" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="56.5" cy="45" r="3" fill="#34d399" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
