"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type CopyState = "idle" | "copied" | "error";

interface CopyButtonProps {
  value: string;
  /** Accessible label, e.g. "Copy email address". */
  label: string;
  className?: string;
  /** Show text next to the icon. */
  showText?: boolean;
}

/** Copies `value` to the clipboard with visible + announced feedback. */
export function CopyButton({ value, label, className, showText = false }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("error");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2200);
  }

  const text = state === "copied" ? "Copied" : state === "error" ? "Copy failed" : "Copy";

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full h-8 border border-line bg-surface-2 px-3 text-xs font-medium text-muted transition-colors hover:border-line-strong hover:text-fg",
        className,
      )}
    >
      {state === "copied" ? (
        <Check aria-hidden="true" className="size-3.5 text-accent-2" />
      ) : (
        <Copy aria-hidden="true" className="size-3.5" />
      )}
      {showText ? <span>{text}</span> : null}
      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? "Copied to clipboard" : state === "error" ? "Could not copy" : ""}
      </span>
    </button>
  );
}
