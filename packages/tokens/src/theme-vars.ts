import { ROLE_NAMES, type RoleName } from "./roles.js";

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
