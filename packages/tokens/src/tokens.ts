import type { RoleName } from "./roles.js";

export const tokens = {
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  space: Object.fromEntries(
    Array.from({ length: 25 }, (_, i) => [i, `${i * 0.25}rem`]),
  ) as Record<number, string>,
  font: {
    sans: "'Fira Sans', system-ui, sans-serif",
    mono: "'Fira Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
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
     * The savi (neutral) baseline. kajo stretches these and sisu compresses
     * them via --usva-duration-*; see each theme file. Assign by what moves:
     * fast = colour/border/opacity, base = transform/scale/shadow,
     * slow = enter-exit and travelling indicators, ambient = media zoom and
     * progress travel.
     */
    duration: {
      fast: "150ms",
      base: "200ms",
      slow: "300ms",
      ambient: "500ms",
    },
    easing: {
      soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      emphasis: "cubic-bezier(0.25, 0, 0, 1)",
      spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
    spring: {
      soft: { type: "spring", stiffness: 210, damping: 30 },
      snappy: { type: "spring", stiffness: 400, damping: 32 },
      bouncy: { type: "spring", stiffness: 500, damping: 18 },
    },
  },
} as const;

export type Tokens = typeof tokens;
export type { RoleName };
