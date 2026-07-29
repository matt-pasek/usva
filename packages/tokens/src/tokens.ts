import type { RoleName } from "./roles.js";

/**
 * Only what the CSS contract cannot carry. Colours, radii, fonts, easings,
 * elevations, focus and z-layers all live in theme.css and themes/*.css, and
 * every export reads them back from there. A second copy here had drifted three
 * ways before it was cut down: it invented a `full` radius the CSS never had,
 * published Fira Mono for sisu (which sets Fira Code), and claimed a
 * cubic-bezier for kajo's spring (which is a `linear()` curve).
 *
 * The spacing and type scales stay because they are Tailwind v4's own defaults
 * adopted as-is rather than values usva declares, so there is no `--spacing-*`
 * or `--text-*` in theme.css to read them back from.
 */
export const tokens = {
  space: Object.fromEntries(
    Array.from({ length: 25 }, (_, i) => [i, `${i * 0.25}rem`]),
  ) as Record<number, string>,
  text: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
  },
  motion: {
    /**
     * Spring physics, not a CSS timing function. motion consumes these objects
     * directly, so they have no theme.css equivalent to be read from.
     */
    spring: {
      soft: { type: "spring", stiffness: 210, damping: 30 },
      snappy: { type: "spring", stiffness: 400, damping: 32 },
      bouncy: { type: "spring", stiffness: 500, damping: 18 },
    },
  },
} as const;

export type Tokens = typeof tokens;
export type { RoleName };
