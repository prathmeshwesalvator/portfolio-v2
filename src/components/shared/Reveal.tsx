"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT_EXPO, revealTransition } from "@/lib/motion";

type RevealTag =
  | "div"
  | "section"
  | "article"
  | "aside"
  | "header"
  | "footer"
  | "figure"
  | "ul"
  | "ol"
  | "li"
  | "p"
  | "span"
  | "dl";

type MotionDivProps = Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "viewport" | "variants" | "transition" | "children">;

/**
 * Static lookup (module scope) — components must not be created during render.
 * All motion intrinsic components share the same prop surface for our usage.
 */
const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  aside: motion.aside,
  header: motion.header,
  footer: motion.footer,
  figure: motion.figure,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  p: motion.p,
  span: motion.span,
  dl: motion.dl,
} as unknown as Record<RevealTag, typeof motion.div>;

interface RevealProps extends MotionDivProps {
  as?: RevealTag;
  children?: ReactNode;
  /** Seconds. */
  delay?: number;
  /** Initial vertical offset in px. */
  y?: number;
  /** Fraction of the element that must be visible to trigger (0–1). */
  amount?: number;
  once?: boolean;
}

/**
 * Fade-and-rise on scroll into view. Content is visible without JS thanks to
 * the <noscript> rule in the root layout (targets [data-reveal]).
 * Motion is automatically reduced via <MotionConfig reducedMotion="user">.
 */
export function Reveal({ as = "div", children, delay = 0, y = 18, amount = 0.2, once = true, ...rest }: RevealProps) {
  const Component = MOTION_TAGS[as];
  return (
    <Component
      data-reveal=""
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}

interface StaggerProps extends MotionDivProps {
  as?: RevealTag;
  children?: ReactNode;
  /** Seconds between children. */
  stagger?: number;
  /** Seconds before the first child. */
  delay?: number;
  amount?: number;
  once?: boolean;
}

/** Parent that reveals its <StaggerItem> children one after another. */
export function Stagger({ as = "div", children, stagger = 0.08, delay = 0, amount = 0.15, once = true, ...rest }: StaggerProps) {
  const Component = MOTION_TAGS[as];
  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...rest}
    >
      {children}
    </Component>
  );
}

interface StaggerItemProps extends MotionDivProps {
  as?: RevealTag;
  children?: ReactNode;
  y?: number;
}

export function StaggerItem({ as = "div", children, y = 18, ...rest }: StaggerItemProps) {
  const Component = MOTION_TAGS[as];
  return (
    <Component
      data-reveal=""
      variants={{ hidden: { opacity: 0, y }, visible: { opacity: 1, y: 0, transition: revealTransition } }}
      {...rest}
    >
      {children}
    </Component>
  );
}
