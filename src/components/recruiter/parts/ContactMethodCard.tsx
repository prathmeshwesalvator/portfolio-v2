"use client";

import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/types";
import { ContactCopyButton } from "./ContactCopyButton";

export interface ContactMethod {
  id: string;
  /** Channel name, e.g. "LinkedIn". */
  label: string;
  /** Visible value, e.g. "@handle". */
  value: ReactNode;
  href: string;
  icon: IconComponent;
  /** Opens in a new tab (noopener noreferrer) with an sr-only hint. */
  external?: boolean;
  /** Suggested file name — makes the card a download link. */
  download?: string;
  /** Adds a copy-to-clipboard control for this value. */
  copy?: { value: string; label: string };
}

/**
 * Link card for the dark contact panel. The whole card is clickable through a
 * stretched ::after on the link, while the optional copy button sits above it
 * (z-10) — so no interactive element is ever nested inside the anchor.
 */
export function ContactMethodCard({ method }: { method: ContactMethod }) {
  const { label, value, href, icon: Icon, external, download, copy } = method;
  const Arrow = download ? ArrowDown : ArrowUpRight;

  return (
    <div className="group/contact relative flex w-full flex-col justify-between gap-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-[background-color,border-color] duration-300 hover:border-white/20 hover:bg-white/[0.08] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-white">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-white ring-1 ring-white/10 ring-inset"
        >
          <Icon className="size-[1.125rem]" />
        </span>
        <div className="flex items-center gap-3">
          {copy ? <ContactCopyButton value={copy.value} label={copy.label} /> : null}
          <Arrow
            aria-hidden="true"
            className={cn(
              "size-[1.125rem] shrink-0 text-white/60 transition-[translate,color] duration-300 ease-out-expo group-hover/contact:text-white",
              download
                ? "group-hover/contact:translate-y-0.5"
                : "group-hover/contact:translate-x-0.5 group-hover/contact:-translate-y-0.5",
            )}
          />
        </div>
      </div>

      <div className="min-w-0">
        {/* Visual label; the link below carries the same text for assistive tech. */}
        <p aria-hidden="true" className="font-mono text-xs tracking-[0.14em] text-white/60 uppercase">
          {label}
        </p>
        <a
          href={href}
          download={download}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="mt-1.5 block text-sm font-medium text-white outline-hidden wrap-anywhere after:absolute after:inset-0 after:rounded-2xl"
        >
          <span className="sr-only">{label}: </span>
          {value}
          {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </a>
      </div>
    </div>
  );
}
