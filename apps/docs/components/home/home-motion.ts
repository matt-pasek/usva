/**
 * The homepage's motion vocabulary, as data. Every scene on the page is a
 * function of scroll, so the timelines live here as plain numbers where a
 * test can read them, and the components only interpolate.
 */

/** Long, asymmetric, no overshoot. Mass settles; it does not boing. */
export const COOL = [0.19, 1, 0.22, 1] as const;
/** The heave of something heavy leaving the floor. */
export const HEAVE = [0.16, 0.84, 0.24, 1] as const;

/** Overdamped weight for scroll-following springs: lags, settles, never bounces. */
export const WEIGHT = { stiffness: 100, damping: 30, mass: 0.9 } as const;

export type Span = readonly [number, number];

/**
 * The asserts scene, in section progress. The lamp gets the room to itself
 * first and is introduced by name: the word rises behind the glass, which
 * eclipses its middle, then the etymology and the gloss are read under it.
 * Only once the naming has cleared does the glide hand the lamp to its column
 * and the argument climb out, line by line.
 */
export const KUOHU_SCENE = {
  watch: [0, 0.04],
  word: [0.04, 0.16],
  etymology: [0.18, 0.28],
  gloss: [0.28, 0.38],
  /** The naming leaving: the word sinks back and the etymology clears. */
  recede: [0.36, 0.46],
  glide: [0.44, 0.62],
  eyebrow: [0.48, 0.56],
  title: [0.52, 0.62],
  lede: [0.6, 0.7],
  bodyA: [0.68, 0.78],
  bodyB: [0.74, 0.84],
  link: [0.82, 0.9],
  /** The lamp's own name, last, once it is home in its column. */
  credit: [0.88, 0.96],
} as const satisfies Record<string, Span>;

/** The beats that introduce the lamp by name, before the argument starts. */
export const KUOHU_NAMING = ["word", "etymology", "gloss"] as const;

/** The argument itself, dealt out in reading order. */
export const KUOHU_ARGUMENT = [
  "eyebrow",
  "title",
  "lede",
  "bodyA",
  "bodyB",
  "link",
] as const;

/**
 * The proportion scene. The grid is laid while the section rides in over the
 * atmosphere below it, and the emphasis only happens once the grid holds
 * still, so the ratio is read off an intact grid.
 */
export const PROPORTION_SCENE = {
  lay: [0.06, 0.42],
  quietShare: 0.55,
  dim: [0.56, 0.72],
  verdict: [0.6, 0.72],
} as const;

/** Quiet squares keep the grid legible even while they step back. */
export const PROPORTION_DIM = 0.3;

/**
 * The crest of an arriving mass: a wide, shallow arc, nothing like a circle.
 * Edges sit low, the apex barely clears the top of the box.
 */
export function crestPath(width = 1440, height = 96): string {
  const edge = Math.round(height * 0.82);
  const apex = Math.round(height * 0.06);
  const control = 2 * apex - edge;
  return `M0 ${height} L0 ${edge} Q ${width / 2} ${control} ${width} ${edge} L${width} ${height} Z`;
}

/** The same arc alone, for the faint rim light riding the crest. */
export function crestLine(width = 1440, height = 96): string {
  const edge = Math.round(height * 0.82);
  const apex = Math.round(height * 0.06);
  const control = 2 * apex - edge;
  return `M0 ${edge} Q ${width / 2} ${control} ${width} ${edge}`;
}

/** Quadratic bezier midpoint, which is the arc's apex for a symmetric crest. */
export function crestApex(height = 96): number {
  const edge = height * 0.82;
  const apex = height * 0.06;
  const control = 2 * apex - edge;
  return 0.25 * edge + 0.5 * control + 0.25 * edge;
}
