import type { ViewerMode } from "@/types";

/** Query parameter that selects the visitor experience. */
export const VIEWER_PARAM = "viewer";

export const VIEWER_MODES = ["recruiter", "freelance"] as const satisfies readonly ViewerMode[];

export const DEFAULT_VIEWER_MODE: ViewerMode = "recruiter";

export function isViewerMode(value: unknown): value is ViewerMode {
  return typeof value === "string" && (VIEWER_MODES as readonly string[]).includes(value);
}

/**
 * Parses the `viewer` query value. Anything missing or invalid falls back to
 * the recruiter experience (matching the server-side rewrite rules, which only
 * treat the exact value `freelance` as the freelance experience).
 */
export function parseViewerMode(value: string | string[] | null | undefined): ViewerMode {
  const first = Array.isArray(value) ? value[0] : value;
  return isViewerMode(first) ? first : DEFAULT_VIEWER_MODE;
}

/** Builds the relative URL for a mode, preserving unrelated query params. */
export function buildViewerUrl(mode: ViewerMode, current: URL, options: { keepHash?: boolean } = {}): string {
  const url = new URL(current.href);
  url.searchParams.set(VIEWER_PARAM, mode);
  return `${url.pathname}${url.search}${options.keepHash ? url.hash : ""}`;
}
