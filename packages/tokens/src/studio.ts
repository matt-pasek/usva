import type { RoleName } from "./roles.js";
import {
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

/**
 * Tokens Studio, not raw DTCG. Figma has no notion of a DTCG file, and the
 * Variables REST API is Enterprise-only, so the way tokens actually land in a
 * designer's file is the Tokens Studio plugin: a core set everything shares,
 * one set per theme, and a $themes block that becomes the mode switcher.
 */
type StudioToken = { type: string; value: string | number };
type StudioSet = Record<string, unknown>;

const token = (type: string, value: string | number): StudioToken => ({
  type,
  value,
});

/**
 * The plugin's `boxShadow` type wants a structured layer, which cannot hold a
 * multi-layer shadow built on `color-mix()` over `var()`. `other` is what Tokens
 * Studio uses for a value it carries verbatim, so elevation, focus, easing and
 * z-index ride as `other` rather than as a shape the plugin would reject.
 */
const VERBATIM = "other";

export interface StudioFile {
  core: StudioSet;
  $themes: unknown[];
  $metadata: { tokenSetOrder: string[] };
  [theme: string]: unknown;
}

function coreSet(radii: Record<string, string>): StudioSet {
  return {
    radius: Object.fromEntries(
      Object.entries(radii).map(([k, v]) => [k, token("borderRadius", v)]),
    ),
    space: Object.fromEntries(
      Object.entries(tokens.space).map(([k, v]) => [k, token("spacing", v)]),
    ),
    text: Object.fromEntries(
      Object.entries(tokens.text).map(([k, v]) => [k, token("fontSizes", v)]),
    ),
  };
}

function themeSet(vars: ThemeVars): StudioSet {
  const colors = themeColors(vars);
  return {
    color: Object.fromEntries(
      (Object.keys(colors) as RoleName[]).map((role) => [
        role,
        token("color", colors[role]),
      ]),
    ),
    duration: Object.fromEntries(
      Object.entries(themeDurations(vars)).map(([tier, value]) => [
        tier,
        token(VERBATIM, value),
      ]),
    ),
    font: Object.fromEntries(
      Object.entries(themeFonts(vars)).map(([name, value]) => [
        name,
        token("fontFamilies", value),
      ]),
    ),
    easing: Object.fromEntries(
      Object.entries(themeEasings(vars)).map(([name, value]) => [
        name,
        token(VERBATIM, value),
      ]),
    ),
    elevation: Object.fromEntries(
      Object.entries(themeElevations(vars)).map(([name, value]) => [
        name,
        token(VERBATIM, value),
      ]),
    ),
    focus: token(VERBATIM, themeFocus(vars)),
    zIndex: Object.fromEntries(
      Object.entries(themeZLayers(vars)).map(([name, value]) => [
        name,
        token(VERBATIM, value),
      ]),
    ),
  };
}

/** Each theme enables core plus its own set, so switching the theme in Figma
 * swaps every colour and duration at once and leaves the scales alone. */
function themeDefinition(name: ThemeName) {
  return {
    id: name,
    name,
    selectedTokenSets: { core: "enabled", [name]: "enabled" },
  };
}

export function toStudio(
  themes: Record<ThemeName, ThemeVars>,
  radii: Record<string, string>,
): StudioFile {
  const file = {
    core: coreSet(radii),
    $themes: THEME_NAMES.map(themeDefinition),
    $metadata: { tokenSetOrder: ["core", ...THEME_NAMES] },
  } as StudioFile;

  for (const name of THEME_NAMES) {
    file[name] = themeSet(themes[name]);
  }
  return file;
}
