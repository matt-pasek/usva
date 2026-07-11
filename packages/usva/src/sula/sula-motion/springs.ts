/**
 * The sula springs. Every sula component animates on these so the family reads
 * as one fluid system: the presets share a natural-frequency register
 * (sqrt(stiffness / mass) near 4.8 rad/s), so nothing feels lighter or snappier
 * than its neighbours. Tune within the register, not away from it.
 */

/** Underdamped on purpose: the bar lands with one soft dip and a faint second bob. */
export const barSpring = {
  type: "spring",
  stiffness: 68,
  damping: 19,
  mass: 2.9,
} as const;
/** Slower and heavier, so a side pill emerges sticky rather than snapping out. */
export const sideSpring = {
  type: "spring",
  stiffness: 70,
  damping: 16,
  mass: 2.1,
} as const;
/** The whole row reshapes as one mass during a view switch. */
export const switchSpring = {
  type: "spring",
  stiffness: 115,
  damping: 22,
  mass: 1.45,
} as const;
/** The leftover top tether pulls upward after the bar has landed. */
export const dripRetract = {
  duration: 1.05,
  ease: [0.3, 1.12, 0.36, 1],
} as const;
/** Labels come up once, promptly, as the bar lands. */
export const textFade = { duration: 0.22, ease: [0.22, 1, 0.36, 1] } as const;

export type SulaMotionSpec =
  | typeof barSpring
  | typeof sideSpring
  | typeof switchSpring
  | typeof dripRetract
  | typeof textFade;
