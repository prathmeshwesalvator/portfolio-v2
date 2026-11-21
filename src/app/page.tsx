import { PortfolioApp } from "@/components/app/PortfolioApp";
import { buildModeMetadata, buildModeViewport } from "@/lib/metadata";

/**
 * Recruiter experience — the default for `/`, `/?viewer=recruiter` and any
 * missing/invalid `viewer` value. Fully static; the client syncs the URL.
 */
export const ensureStatic = "navigation";

export const metadata = buildModeMetadata("recruiter");
export const viewport = buildModeViewport("recruiter");

export default function RecruiterPage() {
  return <PortfolioApp initialMode="recruiter" />;
}
