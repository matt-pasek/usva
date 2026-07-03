import { ROLE_NAMES } from "@matt-pasek/usva-tokens";
import dtcg from "@matt-pasek/usva-tokens/tokens.dtcg.json";

type NamedRow = { name: string };
type ValueRow = { name: string; value: string };

type TokenReference = {
  color: NamedRow[];
  spacing: ValueRow[];
  radius: ValueRow[];
  type: ValueRow[];
  motion: ValueRow[];
};

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
    // colors aren't in the DTCG export (they're theme CSS vars, not
    // static values), so the reference reads the role vocabulary
    // directly and renders each as a live `bg-<role>` swatch instead.
    color: ROLE_NAMES.map((name) => ({ name })),
    spacing: rowsFromDimensionGroup(dtcg.space),
    radius: rowsFromDimensionGroup(dtcg.radius),
    type: rowsFromDimensionGroup(dtcg.text),
    motion: Object.entries(dtcg.motion.duration).map(([name, token]) => ({
      name,
      value: token.$value,
    })),
  };
}
