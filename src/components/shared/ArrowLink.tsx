"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { handleAnchorClick } from "@/lib/scroll";

interface ArrowLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  external?: boolean;
  leadingIcon?: ReactNode;
  /** Hide the trailing arrow. */
  plain?: boolean;
}

/**
 * Inline text link with an arrow that nudges on hover.
 * External links open in a new tab (noopener noreferrer) with an sr-only hint.
 */
export function ArrowLink({ href, external, leadingIcon, plain, className, children, onClick, ...rest }: ArrowLinkProps) {
  const Arrow = external ? ArrowUpRight : ArrowRight;
  return (
    <a
      href={href}
      className={cn(
        "group/link inline-flex items-center gap-1.5 font-medium text-fg underline-offset-4 transition-colors hover:text-accent-text hover:underline",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(event) => {
        onClick?.(event);
        if (href.startsWith("#")) handleAnchorClick(event);
      }}
      {...rest}
    >
      {leadingIcon}
      <span>{children}</span>
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      {plain ? null : (
        <Arrow
          aria-hidden="true"
          className={cn(
            "transition-transform duration-200 ease-out",
            external ? "group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" : "group-hover/link:translate-x-0.5",
          )}
        />
      )}
    </a>
  );
}
