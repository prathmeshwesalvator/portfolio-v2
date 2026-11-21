"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type CopyState = "idle" | "copied" | "error";

const BUTTON_TEXT: Record<CopyState, string> = { idle: "Copy", copied: "Copied", error: "Failed" };
const STATUS_TEXT: Record<CopyState, string> = { idle: "", copied: "Copied to clipboard", error: "Could not copy" };

/**
 * Copy-to-clipboard pill for the dark contact panel. (The shared CopyButton is
 * styled with page surface tokens, which would read as a light chip here.)
 * `relative z-10` keeps it above the card's stretched link; the ::before
 * extends the hit area to 44px without enlarging the visual pill.
 */
export function ContactCopyButton({ value, label }: { value: string; label: string }) {
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

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        className="relative z-10 inline-flex h-8 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 text-xs font-medium text-white/80 transition-colors duration-200 select-none before:absolute before:-inset-1.5 before:rounded-full hover:border-white/30 hover:bg-white/[0.12] hover:text-white focus-visible:outline-white"
      >
        {state === "copied" ? (
          <Check aria-hidden="true" className="size-3.5 text-[#34d399]" strokeWidth={2.5} />
        ) : (
          <Copy aria-hidden="true" className="size-3.5" />
        )}
        <span aria-hidden="true">{BUTTON_TEXT[state]}</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {STATUS_TEXT[state]}
      </span>
    </>
  );
}
