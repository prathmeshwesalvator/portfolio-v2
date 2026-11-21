"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { handleAnchorClick } from "@/lib/scroll";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";
export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none " +
  "transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 " +
  "[&_svg]:shrink-0";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-fg shadow-soft hover:bg-primary-hover",
  secondary: "border border-line-strong bg-surface text-fg hover:border-fg/25 hover:bg-surface-2",
  ghost: "text-fg hover:bg-surface-2",
  accent: "bg-accent text-accent-fg shadow-soft hover:brightness-110",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm [&_svg]:size-4",
  md: "h-11 px-5 text-[0.9375rem] [&_svg]:size-[1.05rem]",
  lg: "h-12 px-6 text-base [&_svg]:size-[1.1rem]",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}): string {
  return cn(BASE, VARIANTS[variant], SIZES[size], className);
}

interface ButtonLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Opens in a new tab with rel="noopener noreferrer" and an sr-only hint. */
  external?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Called after an in-page (#id) navigation, e.g. to close a menu. */
  onNavigate?: () => void;
}

/** Link styled as a button. `#id` hrefs smooth-scroll without touching the URL. */
export function ButtonLink({
  href,
  variant,
  size,
  className,
  external,
  leadingIcon,
  trailingIcon,
  onNavigate,
  onClick,
  children,
  ...rest
}: ButtonLinkProps) {
  const isInPage = href.startsWith("#");
  return (
    <a
      href={href}
      className={buttonClasses({ variant, size, className })}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={(event) => {
        onClick?.(event);
        if (isInPage) handleAnchorClick(event, onNavigate);
      }}
      {...rest}
    >
      {leadingIcon}
      <span>{children}</span>
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      {trailingIcon}
    </a>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function Button({
  variant,
  size,
  className,
  leadingIcon,
  trailingIcon,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...rest}>
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </button>
  );
}
