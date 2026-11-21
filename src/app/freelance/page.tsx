import { PortfolioApp } from "@/components/app/PortfolioApp";
import { buildModeMetadata, buildModeViewport } from "@/lib/metadata";

/**
 * Freelance experience. Publicly reachable only as `/?viewer=freelance`
 * (see rewrites/redirects in next.config.ts). Fully static.
 */
export const ensureStatic = "navigation";

export const metadata = buildModeMetadata("freelance");
export const viewport = buildModeViewport("freelance");

export default function FreelancePage() {
  return <PortfolioApp initialMode="freelance" />;
}
