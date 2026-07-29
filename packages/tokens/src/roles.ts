/**
 * Text-tier contract:
 *   ink    primary text
 *   muted  secondary text, plus anything information-bearing (stat units,
 *          placeholders, group labels). Clears 4.5:1 on every surface role.
 *   faint  decorative glyphs only. Sits near 2:1 by design, so it must never
 *          be the sole carrier of information.
 */
export const ROLE_NAMES = [
  "bg",
  "sunken",
  "surface",
  "surface-2",
  "overlay",
  "scrim",
  "ink",
  "muted",
  "faint",
  "on-accent",
  "on-sunken",
  "on-tint",
  "accent",
  "accent-2",
  "accent-alt",
  "accent-tint",
  "accent-ink",
  "success",
  "warning",
  "danger",
  "info",
  "border",
  "border-strong",
  "ring",
] as const;

export type RoleName = (typeof ROLE_NAMES)[number];

export const Z_LAYERS = {
  base: 0,
  dropdown: 20,
  overlay: 40,
  toast: 60,
} as const;

export type ZLayerName = keyof typeof Z_LAYERS;
