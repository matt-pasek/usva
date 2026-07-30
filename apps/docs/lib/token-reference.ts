import { ROLE_NAMES } from "@usva-ui/tokens";
import dtcg from "@usva-ui/tokens/tokens.dtcg.json";
import studio from "@usva-ui/tokens/tokens.studio.json";

const THEME_NAMES = ["kajo", "sisu", "savi"] as const;
type ThemeName = (typeof THEME_NAMES)[number];

type ColorRow = { name: string; values: Record<ThemeName, string> };
type ValueRow = { name: string; value: string };

type TokenReference = {
  color: ColorRow[];
  spacing: ValueRow[];
  radius: ValueRow[];
  type: ValueRow[];
  motion: ValueRow[];
};

type StudioColorSet = { color: Record<string, { value: string }> };

function colorRows(): ColorRow[] {
  const sets = studio as unknown as Record<ThemeName, StudioColorSet>;
  return ROLE_NAMES.map((name) => ({
    name,
    values: Object.fromEntries(
      THEME_NAMES.map((theme) => [theme, sets[theme].color[name]?.value ?? ""]),
    ) as Record<ThemeName, string>,
  }));
}

/**
 * Durations are per theme, so one column would print the wrong number for two
 * themes out of three.
 */
function durationRows(): ValueRow[] {
  const themes = dtcg.theme as unknown as Record<
    ThemeName,
    { duration: Record<string, { $value: string }> }
  >;
  const tiers = Object.keys(themes.savi.duration);
  return tiers.map((name) => ({
    name,
    value: THEME_NAMES.map(
      (theme) => `${theme} ${themes[theme].duration[name]?.$value ?? ""}`,
    ).join(" · "),
  }));
}

function rowsFromDimensionGroup(
  group: Record<string, { $value: string }>,
): ValueRow[] {
  return Object.entries(group).map(([name, token]) => ({
    name,
    value: token.$value,
  }));
}

export function buildTokenReference(): TokenReference {
  return {
    color: colorRows(),
    spacing: rowsFromDimensionGroup(dtcg.space),
    radius: rowsFromDimensionGroup(dtcg.radius),
    type: rowsFromDimensionGroup(dtcg.text),
    motion: durationRows(),
  };
}
