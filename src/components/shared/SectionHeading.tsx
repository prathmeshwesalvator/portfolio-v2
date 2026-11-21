import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  /** id for the heading element — pass the same value to <Section labelledBy>. */
  id: string;
  eyebrow: string;
  /** Optional index, e.g. "01". */
  index?: string;
  /**
   * Heading content. Wrap the accent phrase in <em>:
   *  - Recruiter: rendered in Instrument Serif italic, amber.
   *  - Freelance: rendered in the violet accent colour.
   */
  title: ReactNode;
  description?: ReactNode;
  /** Recruiter chapter openers: short mono fact on the right of the rule (e.g. "2 roles"). */
  meta?: string;
  align?: "left" | "center";
  as?: "h2" | "h3";
  className?: string;
}

/**
 * One heading component, two personalities (driven by the mode variants):
 *  - Recruiter: an editorial chapter opener — index, eyebrow and meta on a full-width hairline,
 *    then a large sans headline with a serif-italic amber accent.
 *  - Freelance: compact eyebrow + bold Bricolage display headline with a violet accent.
 * DOM order stays index → eyebrow → meta; `order` only rearranges the visual row.
 */
export function SectionHeading({
  id,
  eyebrow,
  index,
  title,
  description,
  meta,
  align = "left",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      as="header"
      className={cn(
        "flex flex-col gap-5 recruiter:gap-7",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <p
        className={cn(
          "flex items-center gap-3 font-mono text-xs tracking-[0.16em] text-subtle uppercase",
          "recruiter:w-full recruiter:gap-4",
        )}
      >
        {index ? (
          <>
            <span className="order-1 text-accent-text">{index}</span>
            <span
              aria-hidden="true"
              className="order-2 h-px w-8 bg-line-strong recruiter:order-3 recruiter:w-auto recruiter:min-w-6 recruiter:flex-1 recruiter:bg-line"
            />
          </>
        ) : null}
        <span className="order-3 recruiter:order-2 recruiter:text-fg/80">{eyebrow}</span>
        {meta ? <span className="order-4 hidden text-subtle tabular-nums sm:inline">{meta}</span> : null}
      </p>
      <Heading
        id={id}
        className={cn(
          "text-fg",
          // Recruiter — large editorial sans with a serif-italic amber accent
          "recruiter:max-w-4xl recruiter:text-[2.4rem] recruiter:leading-[1.02] recruiter:font-semibold recruiter:tracking-[-0.04em] recruiter:sm:text-[3.25rem] recruiter:lg:text-[4rem]",
          "recruiter:[&_em]:font-serif recruiter:[&_em]:text-[1.08em] recruiter:[&_em]:font-normal recruiter:[&_em]:tracking-[-0.015em] recruiter:[&_em]:text-accent-text recruiter:[&_em]:italic",
          // Freelance — bold editorial display with a violet accent
          "freelance:max-w-4xl freelance:font-display freelance:text-[2.5rem] freelance:leading-[0.98] freelance:font-semibold freelance:tracking-[-0.04em] freelance:sm:text-[3.5rem] freelance:lg:text-[4.5rem]",
          "freelance:[&_em]:text-accent-text freelance:[&_em]:not-italic",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
