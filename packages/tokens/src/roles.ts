export const ROLE_NAMES = [
  "bg", "surface", "surface-2", "overlay",
  "ink", "muted", "faint", "on-accent",
  "accent", "accent-2", "accent-ink",
  "success", "warning", "danger", "info",
  "border", "border-strong", "ring",
] as const;

export type RoleName = (typeof ROLE_NAMES)[number];
