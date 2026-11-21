import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ChipTone = "neutral" | "accent" | "success" | "outline";
type ChipSize = "xs" | "sm" | "md";

const TONES: Record<ChipTone, string> = {
  neutral: "border-line bg-surface-2 text-muted",
  outline: "border-line-strong bg-transparent text-muted",
  accent: "border-transparent bg-accent-soft text-accent-text",
  success: "border-transparent bg-accent-2-soft text-accent-2",
};

const SIZES: Record<ChipSize, string> = {
  xs: "h-6 px-2 text-[0.6875rem]",
  sm: "h-7 px-2.5 text-xs",
  md: "h-8 px-3 text-[0.8125rem]",
};

interface ChipProps {
  children: ReactNode;
  tone?: ChipTone;
  size?: ChipSize;
  /** Monospace label style (good for tech stacks). */
  mono?: boolean;
  className?: string;
}

/** Small tag for tech stacks, statuses and metadata. */
export function Chip({ children, tone = "neutral", size = "sm", mono = false, className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap",
        mono && "font-mono tracking-tight",
        TONES[tone],
        SIZES[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Semantic list of chips (renders <ul>/<li>). */
export function ChipList({
  items,
  tone,
  size,
  mono,
  className,
  label,
}: {
  items: readonly string[];
  tone?: ChipTone;
  size?: ChipSize;
  mono?: boolean;
  className?: string;
  /** Accessible list label, e.g. "Tech stack". */
  label?: string;
}) {
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <li key={item}>
          <Chip tone={tone} size={size} mono={mono}>
            {item}
          </Chip>
        </li>
      ))}
    </ul>
  );
}
