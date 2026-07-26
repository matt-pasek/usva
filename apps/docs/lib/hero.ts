export const HERO_SIZE = { width: 1200, height: 630 } as const;

export const HERO_SCALE = 2;

export const HERO_SQUARE = HERO_SIZE.height;

export const HERO_SQUARE_X = 30;

export const HERO_SAFE = {
  left: HERO_SQUARE_X,
  right: HERO_SQUARE_X + HERO_SQUARE,
} as const;

export const HERO_PAD = { top: 62, left: 72, bottom: 40 } as const;

export const HERO_TYPE = {
  eyebrow: { size: 19, tracking: "0.14em" },
  wordmark: { size: 82, tracking: "-0.03em", leading: 0.94 },
  tagline: { size: 34, tracking: "-0.01em", leading: 1.22, maxWidth: 430 },
  foot: { size: 16, tracking: "0.11em" },
} as const;

export const HERO_CARD = { x: 486, y: 352, width: 232 } as const;

export const HERO_CLUSTER = { x: 700, y: 76, width: 620 } as const;

export const HERO_LAYERS = [
  "primitives",
  "patterns",
  "atmospheres",
  "sula",
  "motion",
] as const;

export const HERO_INTERNAL = ["atmospheres-core", "sula-core", "sula-motion"];

export const HERO_STATS = [
  { label: "components", value: "77" },
  { label: "layers", value: "5" },
  { label: "themes", value: "3" },
] as const;

export const HERO_ROWS = [
  {
    heading: "kajastus",
    metaLeft: "atmospheres",
    metaRight: "webgl",
    stripe: "var(--usva-accent)",
  },
  {
    heading: "sula-field",
    metaLeft: "sula",
    metaRight: "sdf",
    stripe: "var(--usva-accent-alt)",
  },
] as const;

export const HERO_VARE_PARAMS = {
  wavenumber: 5.4,
  soft: 8,
  gain: 1.3,
} as const;

export const HERO_SEEK_MS = 6500;
export const HERO_FPS = 60;

export type HeroTheme = "kajo" | "savi";
export const HERO_THEMES: readonly HeroTheme[] = ["kajo", "savi"];

export const heroFiles = (theme: HeroTheme) => ({
  wide: `public/og/hero-${theme}.png`,
  square: `public/og/hero-${theme}-square.png`,
});

export const HERO_FILES = HERO_THEMES.flatMap((theme) => {
  const { wide, square } = heroFiles(theme);
  return [
    { path: wide, width: HERO_SIZE.width, height: HERO_SIZE.height },
    { path: square, width: HERO_SQUARE, height: HERO_SQUARE },
  ];
});
