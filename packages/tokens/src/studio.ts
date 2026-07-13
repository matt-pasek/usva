import type { RoleName } from "./roles.js";
import {
  THEME_NAMES,
  type ThemeName,
  type ThemeVars,
  themeColors,
  themeDurations,
} from "./theme-vars.js";
import { tokens } from "./tokens.js";

/**
 * Tokens Studio, not raw DTCG. Figma has no notion of a DTCG file, and the
 * Variables REST API is Enterprise-only, so the way tokens actually land in a
 * designer's file is the Tokens Studio plugin: a core set everything shares,
 * one set per theme, and a $themes block that becomes the mode switcher.
 */
type StudioToken = { type: string; value: string };
type StudioSet = Record<string, unknown>;

const token = (type: string, value: string): StudioToken => ({ type, value });

export interface StudioFile {
  core: StudioSet;
  $themes: unknown[];
  $metadata: { tokenSetOrder: string[] };
  [theme: string]: unknown;
}

function coreSet(): StudioSet {
  return {
    radius: Object.fromEntries(
      Object.entries(tokens.radius).map(([k, v]) => [
        k,
        token("borderRadius", v),
      ]),
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
  const durations = themeDurations(vars);
  return {
    color: Object.fromEntries(
      (Object.keys(colors) as RoleName[]).map((role) => [
        role,
        token("color", colors[role]),
      ]),
    ),
    duration: Object.fromEntries(
      Object.entries(durations).map(([tier, value]) => [
        tier,
        token("other", value),
      ]),
    ),
    font: {
      sans: token("fontFamilies", vars["font-sans"] ?? ""),
      mono: token("fontFamilies", vars["font-mono"] ?? ""),
    },
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

export function toStudio(themes: Record<ThemeName, ThemeVars>): StudioFile {
  const file = {
    core: coreSet(),
    $themes: THEME_NAMES.map(themeDefinition),
    $metadata: { tokenSetOrder: ["core", ...THEME_NAMES] },
  } as StudioFile;

  for (const name of THEME_NAMES) {
    file[name] = themeSet(themes[name]);
  }
  return file;
}
