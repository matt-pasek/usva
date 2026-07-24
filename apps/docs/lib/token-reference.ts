import { ROLE_NAMES } from "@matt-pasek/usva-tokens";
import dtcg from "@matt-pasek/usva-tokens/tokens.dtcg.json";
import studio from "@matt-pasek/usva-tokens/tokens.studio.json";

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
    // colors aren't in the DTCG export (they're theme CSS vars), so the
    // resolved per-theme values are read from the Tokens Studio export,
    // the one machine-readable source that carries role -> value per theme.
    color: colorRows(),
    spacing: rowsFromDimensionGroup(dtcg.space),
    radius: rowsFromDimensionGroup(dtcg.radius),
    type: rowsFromDimensionGroup(dtcg.text),
    motion: Object.entries(dtcg.motion.duration).map(([name, token]) => ({
      name,
      value: token.$value,
    })),
  };
}
