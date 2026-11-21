import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Project } from "@/types";

/** Labelled case-study block: a mono uppercase heading over its content. */
export function WorkDetail({
  label,
  as: Heading = "h4",
  className,
  children,
}: {
  label: string;
  /** Heading level — h4 inside the featured article, h5 inside an index row (already an h4). */
  as?: "h4" | "h5";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2.5", className)}>
      <Heading className="font-mono text-xs tracking-[0.14em] text-subtle uppercase">{label}</Heading>
      {children}
    </div>
  );
}

/** Body copy used inside a WorkDetail. */
export function WorkText({ children }: { children: ReactNode }) {
  return <p className="text-[0.9375rem] leading-relaxed text-muted">{children}</p>;
}

/** Checklist with emerald ticks (verified contributions / product highlights). */
export function WorkChecklist({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-fg">
          <span
            aria-hidden="true"
            className="mt-[0.1875rem] grid size-5 shrink-0 place-items-center rounded-full bg-accent-2-soft text-accent-2"
          >
            <Check className="size-3" strokeWidth={2.75} />
          </span>
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Verified personal contributions take priority over product-level highlights. */
export function getWorkList(project: Project): { label: string; items: readonly string[] } | null {
  if (project.contributions?.length) return { label: "My contribution", items: project.contributions };
  if (project.highlights?.length) return { label: "Highlights", items: project.highlights };
  return null;
}

type KindTone = "accent" | "outline" | "success";

/**
 * Row/kind label. Professional work names the client (parsed from the data's
 * `context`, e.g. "Risosu Consultancy · Client: Thomas Cook India") so team
 * ownership is always explicit.
 */
export function getWorkKind(project: Project): { label: string; tone: KindTone } {
  if (project.kind === "professional") {
    const client = project.context?.split("Client:")[1]?.trim();
    return { label: client ? `Professional · ${client}` : project.kindLabel, tone: "accent" };
  }
  if (project.kind === "personal") return { label: project.kindLabel, tone: "outline" };
  return { label: project.kindLabel, tone: "success" };
}
