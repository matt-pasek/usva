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
 * first; only then does the copy climb out, line by line, and the glide hands
 * the lamp from centre stage to its column while the heading arrives.
 */
export const KUOHU_SCENE = {
  watch: [0, 0.28],
  glide: [0.28, 0.5],
  eyebrow: [0.32, 0.42],
  title: [0.36, 0.48],
  lede: [0.46, 0.58],
  bodyA: [0.56, 0.68],
  bodyB: [0.64, 0.76],
  link: [0.74, 0.84],
} as const satisfies Record<string, Span>;

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
