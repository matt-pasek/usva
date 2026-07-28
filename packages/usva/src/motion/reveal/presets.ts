import { tokens } from "usva-tokens";

export const springs = tokens.motion.spring;

/**
 * Legacy variant objects (framer/motion `variants` shape). Kept for consumers
 * that drive their own `motion` components; the Reveal system below supersedes
 * this for scroll reveals.
 */
export const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: springs.soft },
  },
  stagger: {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  },
} as const;

/** Tactile press feedback. Spread onto a `motion` component. Never below 0.96. */
export const press = {
  whileTap: { scale: 0.96 },
  transition: springs.soft,
} as const;

// ── Reveal system: "resolve from mist" ──────────────────────────────
// Six distinct reveals, one metaphor: things resolve out of fog toward the
// light above. Assign by content role, never by position. One `intensity`
// scalar dials the whole set from kajo-bold (1) to sisu-quiet (~0.45) to a
// plain crossfade (0, also the reduced-motion path).

const EASE = {
  quart: [0.25, 1, 0.5, 1],
  quint: [0.22, 1, 0.36, 1],
  expo: [0.16, 1, 0.3, 1],
} as const;

export type RevealVariant =
  | "veil"
  | "cast"
  | "surface"
  | "focus"
  | "tick"
  | "lean";

type RevealSpec = {
  x?: number;
  y?: number;
  scale?: number;
  blur?: number;
  transition: Record<string, unknown>;
};

const SPECS: Record<RevealVariant, RevealSpec> = {
  // default; mist thinning: prose, generic sections, footers
  veil: { y: 12, blur: 3, transition: { duration: 0.5, ease: EASE.quart } },
  // light resolving from above: headings, eyebrows, titles (moves DOWN)
  cast: { y: -10, blur: 8, transition: { duration: 0.7, ease: EASE.quint } },
  // material rising to the light: cards, panels, CTAs, hero (spring, no blur)
  surface: { y: 20, scale: 0.97, transition: springs.soft },
  // lens finding focus: images, media frames (no travel; clip the scale)
  focus: {
    scale: 1.04,
    blur: 12,
    transition: { duration: 0.9, ease: EASE.expo },
  },
  // instrument reading: stats, tables, mono/tabular (never blurs, grouped)
  tick: { y: 6, transition: { duration: 0.28, ease: EASE.expo } },
  // aside voice: quotes, testimonials, callouts (the only horizontal move)
  lean: { x: -16, transition: { duration: 0.6, ease: EASE.quint } },
};

export interface BuiltReveal {
  initial: Record<string, number | string>;
  animate: Record<string, number | string>;
  transition: Record<string, unknown>;
}

/**
 * Compute a variant's motion objects, scaled by intensity `k` (0..1). Blur under
 * 2px is dropped rather than rendered, so a low `k` degrades to a plain move.
 */
export function buildReveal(
  variant: RevealVariant,
  k: number,
  reduced: boolean,
): BuiltReveal {
  if (reduced || k <= 0) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: variant === "tick" ? 0 : 0.15, ease: "linear" },
    };
  }

  const spec = SPECS[variant];
  const initial: Record<string, number | string> = { opacity: 0 };
  const animate: Record<string, number | string> = { opacity: 1 };

  const x = (spec.x ?? 0) * k;
  const y = (spec.y ?? 0) * k;
  if (x) {
    initial.x = x;
    animate.x = 0;
  }
  if (y) {
    initial.y = y;
    animate.y = 0;
  }
  if (spec.scale != null) {
    initial.scale = 1 + (spec.scale - 1) * k;
    animate.scale = 1;
  }
  const blur = (spec.blur ?? 0) * k;
  if (blur >= 2) {
    initial.filter = `blur(${blur.toFixed(1)}px)`;
    animate.filter = "blur(0px)";
  }

  const isSpring = spec.transition.type === "spring";
  const transition = isSpring
    ? spec.transition
    : {
        ...spec.transition,
        duration: (spec.transition.duration as number) * (0.7 + 0.3 * k),
      };

  return { initial, animate, transition };
}
