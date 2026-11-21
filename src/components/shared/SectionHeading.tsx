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
   *  - Recruiter: rendered in Instrument Serif italic.
   *  - Freelance: rendered in the violet accent colour.
   */
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h2" | "h3";
  className?: string;
}

export function SectionHeading({
  id,
  eyebrow,
  index,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      as="header"
      className={cn("flex flex-col gap-5", align === "center" && "items-center text-center", className)}
    >
      <p className="flex items-center gap-3 font-mono text-xs tracking-[0.16em] text-subtle uppercase">
        {index ? (
          <>
            <span className="text-accent-text">{index}</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          </>
        ) : null}
        <span>{eyebrow}</span>
      </p>
      <Heading
        id={id}
        className={cn(
          "text-fg",
          // Recruiter — refined sans with a serif-italic accent
          "recruiter:max-w-3xl recruiter:text-[2rem] recruiter:leading-[1.08] recruiter:font-semibold recruiter:tracking-[-0.03em] recruiter:sm:text-[2.5rem] recruiter:lg:text-[2.875rem]",
          "recruiter:[&_em]:font-serif recruiter:[&_em]:text-[1.06em] recruiter:[&_em]:font-normal recruiter:[&_em]:tracking-[-0.01em] recruiter:[&_em]:italic",
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
