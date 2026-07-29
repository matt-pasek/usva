export const HERO_SIZE = { width: 1200, height: 630 } as const;
export const HERO_SCALE = 2;
export const HERO_PAD = { top: 62, left: 72, bottom: 40 } as const;
export const HERO_TYPE = {
  eyebrow: { size: 19, tracking: "0.14em" },
  wordmark: { size: 82, tracking: "-0.03em", leading: 0.94 },
  tagline: { size: 34, tracking: "-0.01em", leading: 1.22, maxWidth: 430 },
  foot: { size: 16, tracking: "0.11em" },
} as const;
export const HERO_PANEL = {
  x: 620,
  y: 62,
  width: 644,
  height: 436,
} as const;
export const HERO_CARD = { x: 576, y: 380, width: 280 } as const;
export const HERO_DIAL_RADIUS = 56;
export const HERO_SNIPPET = { x: 778, y: 430, width: 486 } as const;
export const HERO_SNIPPET_SIZE = 16;
export const HERO_FOOT_WIDTH = 452;
export const HERO_PANEL_PAD = 16;
export const HERO_STAT_COLUMN = 188;
export const HERO_ROW_COLUMN = 340;
export const HERO_SNIPPET_LINES = [
  "bun add usva",
  "npx shadcn add usva.build/r/knob.json",
] as const;

export const HERO_LAYERS = [
  "primitives",
  "patterns",
  "atmospheres",
  "sula",
  "motion",
] as const;

export const HERO_INTERNAL = ["atmospheres-core", "sula-core", "sula-motion"];

export const HERO_STATS = [
  { label: "components", value: "79" },
  { label: "layers", value: "5" },
  { label: "themes", value: "3" },
] as const;

export const HERO_ROWS = [
  {
    heading: "kajastus",
    metaLeft: "atmospheres",
    badge: "webgl",
    stripe: "var(--usva-accent)",
  },
  {
    heading: "sula-field",
    metaLeft: "sula",
    badge: "sdf",
    stripe: "var(--usva-accent-alt)",
  },
  {
    heading: "knob",
    metaLeft: "primitives",
    badge: "aria",
    stripe: "var(--usva-accent)",
  },
] as const;

export const HERO_VARE_PARAMS = {
  wavenumber: 3.4,
  soft: 6,
  gain: 1.55,
} as const;

export const HERO_SEEK_MS = 4000;
export const HERO_FPS = 60;

export type HeroTheme = "kajo" | "savi";
export const HERO_THEMES: readonly HeroTheme[] = ["kajo", "savi"];

export const heroFile = (theme: HeroTheme) => `public/og/hero-${theme}.png`;

export const HERO_FILES = HERO_THEMES.map((theme) => ({
  path: heroFile(theme),
  width: HERO_SIZE.width,
  height: HERO_SIZE.height,
}));
