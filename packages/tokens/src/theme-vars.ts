import {
  ROLE_NAMES,
  type RoleName,
  Z_LAYERS,
  type ZLayerName,
} from "./roles.js";

export const THEME_NAMES = ["kajo", "sisu", "savi"] as const;
export type ThemeName = (typeof THEME_NAMES)[number];

export type ThemeVars = Record<string, string>;

/**
 * The colour values live in the theme CSS files and nowhere else, so anything
 * that wants them (Figma, the DTCG export) reads them back out rather than
 * keeping a second copy that would drift from the one you actually edit.
 */
export function parseThemeVars(css: string): ThemeVars {
  const vars: ThemeVars = {};
  const decl = /--usva-([a-z0-9-]+)\s*:\s*([^;]+);/g;
  let match = decl.exec(css);
  while (match) {
    const [, name, value] = match;
    if (name && value) vars[name] = value.replace(/\s+/g, " ").trim();
    match = decl.exec(css);
  }
  return vars;
}

/**
 * Two roles are deliberately defined by savi alone: a light ground needs its own
 * foreground on the sunken well and on the accent tint, and the dark themes are
 * legible without them. theme.css encodes the same fallbacks in var() chains.
 */
export const ROLE_FALLBACK: Partial<Record<RoleName, RoleName>> = {
  "on-sunken": "ink",
  "on-tint": "accent",
};

export function themeColors(vars: ThemeVars): Record<RoleName, string> {
  const colors = {} as Record<RoleName, string>;
  for (const role of ROLE_NAMES) {
    const fallback = ROLE_FALLBACK[role];
    const value = vars[role] ?? (fallback ? vars[fallback] : undefined);
    if (!value) {
      throw new Error(
        `Theme is missing --usva-${role}, and it has no fallback role.`,
      );
    }
    colors[role] = value;
  }
  return colors;
}

export const FONT_NAMES = ["sans", "mono"] as const;
export type FontName = (typeof FONT_NAMES)[number];

export const EASING_NAMES = ["soft", "emphasis", "spring"] as const;
export type EasingName = (typeof EASING_NAMES)[number];

export const ELEVATION_NAMES = ["raised", "floating", "overlay"] as const;
export type ElevationName = (typeof ELEVATION_NAMES)[number];

/** Reads one `--usva-*` var, or says which theme is missing what. */
function required(vars: ThemeVars, name: string): string {
  const value = vars[name];
  if (!value) throw new Error(`Theme is missing --usva-${name}.`);
  return value;
}

export function themeFonts(vars: ThemeVars): Record<FontName, string> {
  const out = {} as Record<FontName, string>;
  for (const name of FONT_NAMES) out[name] = required(vars, `font-${name}`);
  return out;
}

/**
 * Not all of these are cubic-beziers: kajo's spring is a `linear()` curve with
 * a dozen stops, which is why callers must not assume four control points.
 */
export function themeEasings(vars: ThemeVars): Record<EasingName, string> {
  const out = {} as Record<EasingName, string>;
  for (const name of EASING_NAMES) out[name] = required(vars, `ease-${name}`);
  return out;
}

/** Multi-layer box-shadows, so the value is a raw CSS declaration. */
export function themeElevations(
  vars: ThemeVars,
): Record<ElevationName, string> {
  const out = {} as Record<ElevationName, string>;
  for (const name of ELEVATION_NAMES)
    out[name] = required(vars, `shadow-${name}`);
  return out;
}

export function themeFocus(vars: ThemeVars): string {
  return required(vars, "focus");
}

export function themeZLayers(vars: ThemeVars): Record<ZLayerName, number> {
  const out = {} as Record<ZLayerName, number>;
  for (const name of Object.keys(Z_LAYERS) as ZLayerName[]) {
    const raw = required(vars, `z-${name}`);
    const value = Number(raw);
    if (!Number.isInteger(value))
      throw new Error(`--usva-z-${name} is not an integer: ${raw}`);
    out[name] = value;
  }
  return out;
}

/**
 * The radius scale is global rather than per theme, and it lives in theme.css
 * under Tailwind's own `--radius-*` namespace, so it needs its own reader.
 */
export function parseRadii(css: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const match of css.matchAll(/--radius-([a-z0-9]+)\s*:\s*([^;]+);/g)) {
    const [, name, value] = match;
    if (name && value) out[name] = value.trim();
  }
  if (Object.keys(out).length === 0)
    throw new Error("theme.css declares no --radius-* scale.");
  return out;
}

export const DURATION_TIERS = ["fast", "base", "slow", "ambient"] as const;
export type DurationTier = (typeof DURATION_TIERS)[number];

/**
 * Durations are per theme: kajo is languid, sisu is quick, savi is the baseline.
 * A single flat scale in the export would have told a designer the wrong number
 * for two themes out of three.
 */
export function themeDurations(vars: ThemeVars): Record<DurationTier, string> {
  const out = {} as Record<DurationTier, string>;
  for (const tier of DURATION_TIERS) {
    const value = vars[`duration-${tier}`];
    if (!value) throw new Error(`Theme is missing --usva-duration-${tier}.`);
    out[tier] = value;
  }
  return out;
}
