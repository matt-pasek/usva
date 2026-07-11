export const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));

export const mix = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Hermite ramp between edges; 0 below `a`, 1 above `b`, eased in between. */
export const smoothstep = (a: number, b: number, x: number): number => {
  if (a === b) return x < a ? 0 : 1;
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Quintic smootherstep: flat start, flat end, so a row glides as one mass. */
export const smoother = (t: number): number => {
  const x = clamp01(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};

/** Decelerating ease-out: sheds most of the change in the first frames. */
export const easeOutCubic = (t: number): number => {
  const inv = 1 - clamp01(t);
  return 1 - inv * inv * inv;
};

/**
 * The "bounce without a stop" mapping, the heart of every sula settle. A part
 * must cross its rest line still moving, or a spring's overshoot reads as a dead
 * stop followed by a separate bob. `start` delays the launch; the ease reaches 1
 * at t=1 with slope 1, and raw t past 1 flows straight on to carry the overshoot
 * as one motion. Feed it the raw spring value, not a clamped one.
 */
export const c1Settle = (t: number, start: number): number => {
  const f = Math.max(0, (t - start) / (1 - start));
  return f < 1 ? f * f * (2 - f) : f;
};
