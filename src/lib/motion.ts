import type { Transition, Variants } from "framer-motion";

/** Shared easing curves (mirrors the CSS tokens in globals.css). */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;

export const revealTransition: Transition = {
  duration: 0.7,
  ease: EASE_OUT_EXPO,
};

/** Fade-and-rise used by <Reveal> and <StaggerItem>. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: revealTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

/** Spring used for small interactive affordances (pills, indicators). */
export const snappySpring: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 40,
  mass: 0.9,
};
