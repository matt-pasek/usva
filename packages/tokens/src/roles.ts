export const ROLE_NAMES = [
  "bg",
  "surface",
  "surface-2",
  "overlay",
  "scrim",
  "ink",
  "muted",
  "faint",
  "on-accent",
  "accent",
  "accent-2",
  "accent-alt",
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
