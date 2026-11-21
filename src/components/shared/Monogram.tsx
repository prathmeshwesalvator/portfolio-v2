import { cn } from "@/lib/cn";

/**
 * "PM" brand mark — geometric strokes (no font dependency), shared by both
 * experiences, the favicon and the Open Graph images.
 */
export function Monogram({ className, withDot = true }: { className?: string; withDot?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      className={cn("size-9", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="16" className="fill-primary" />
      <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-fg">
        <path d="M13 46V18h8a8 8 0 0 1 0 16h-8" />
        <path d="M33 46V18l8 14 8-14v28" />
      </g>
      {withDot ? <circle cx="56.5" cy="45" r="3" className="fill-[#34d399]" /> : null}
    </svg>
  );
}
