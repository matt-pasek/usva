import type { RoleName, ZLayerName } from "./roles.js";
import {
  type EasingName,
  type ElevationName,
  type FontName,
  THEME_NAMES,
  type ThemeName,
  type ThemeVars,
  themeColors,
  themeDurations,
  themeEasings,
  themeElevations,
  themeFocus,
  themeFonts,
  themeZLayers,
} from "./theme-vars.js";
import { tokens } from "./tokens.js";

type DTCGValue = string | number | string[] | number[];
type DTCGToken = { $type: string; $value: DTCGValue };

const dim = (v: string): DTCGToken => ({ $type: "dimension", $value: v });
const dur = (v: string): DTCGToken => ({ $type: "duration", $value: v });
const col = (v: string): DTCGToken => ({ $type: "color", $value: v });
const num = (v: number): DTCGToken => ({ $type: "number", $value: v });

const fontFamily = (v: string): DTCGToken => ({
  $type: "fontFamily",
  $value: v
    .split(",")
    .map((family) => family.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean),
});

const CSS_SHADOW = "cssShadow";
const CSS_EASING = "cssEasing";

const shadow = (v: string): DTCGToken => ({ $type: CSS_SHADOW, $value: v });

const CUBIC_BEZIER =
  /^cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)$/;

const easing = (v: string): DTCGToken => {
  const match = CUBIC_BEZIER.exec(v);
  if (!match) return { $type: CSS_EASING, $value: v };
  return { $type: "cubicBezier", $value: match.slice(1, 5).map(Number) };
};

export interface DTCGThemeSet {
  color: Record<RoleName, DTCGToken>;
  duration: Record<string, DTCGToken>;
  font: Record<FontName, DTCGToken>;
  easing: Record<EasingName, DTCGToken>;
  elevation: Record<ElevationName, DTCGToken>;
  focus: DTCGToken;
  zIndex: Record<ZLayerName, DTCGToken>;
}

function themeSet(vars: ThemeVars): DTCGThemeSet {
  const colors = themeColors(vars);

  return {
    color: Object.fromEntries(
      (Object.keys(colors) as RoleName[]).map((role) => [
        role,
        col(colors[role]),
      ]),
    ) as Record<RoleName, DTCGToken>,
    duration: Object.fromEntries(
      Object.entries(themeDurations(vars)).map(([tier, v]) => [tier, dur(v)]),
    ),
    font: Object.fromEntries(
      Object.entries(themeFonts(vars)).map(([name, v]) => [
        name,
        fontFamily(v),
      ]),
    ) as Record<FontName, DTCGToken>,
    easing: Object.fromEntries(
      Object.entries(themeEasings(vars)).map(([name, v]) => [name, easing(v)]),
    ) as Record<EasingName, DTCGToken>,
    elevation: Object.fromEntries(
      Object.entries(themeElevations(vars)).map(([name, v]) => [
        name,
        shadow(v),
      ]),
    ) as Record<ElevationName, DTCGToken>,
    focus: shadow(themeFocus(vars)),
    zIndex: Object.fromEntries(
      Object.entries(themeZLayers(vars)).map(([name, v]) => [name, num(v)]),
    ) as Record<ZLayerName, DTCGToken>,
  };
}

export interface DTCGFile {
  radius: Record<string, DTCGToken>;
  space: Record<string, DTCGToken>;
  text: Record<string, DTCGToken>;
  theme?: Record<ThemeName, DTCGThemeSet>;
}

export function toDTCG(
  themes?: Record<ThemeName, ThemeVars>,
  radii?: Record<string, string>,
): DTCGFile {
  const base = {
    radius: Object.fromEntries(
      Object.entries(radii ?? {}).map(([k, v]) => [k, dim(v)]),
    ),
    space: Object.fromEntries(
      Object.entries(tokens.space).map(([k, v]) => [k, dim(v)]),
    ),
    text: Object.fromEntries(
      Object.entries(tokens.text).map(([k, v]) => [k, dim(v)]),
    ),
  };

  if (!themes) return base;

  const theme = Object.fromEntries(
    THEME_NAMES.map((name) => [name, themeSet(themes[name])]),
  ) as Record<ThemeName, DTCGThemeSet>;

  return { ...base, theme };
}
