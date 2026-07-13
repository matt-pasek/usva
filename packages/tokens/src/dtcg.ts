import type { RoleName } from "./roles.js";
import {
  THEME_NAMES,
  type ThemeName,
  type ThemeVars,
  themeColors,
  themeDurations,
} from "./theme-vars.js";
import { tokens } from "./tokens.js";

type DTCGToken = { $type: string; $value: string };
const dim = (v: string): DTCGToken => ({ $type: "dimension", $value: v });
const dur = (v: string): DTCGToken => ({ $type: "duration", $value: v });
const col = (v: string): DTCGToken => ({ $type: "color", $value: v });

export function toDTCG(themes?: Record<ThemeName, ThemeVars>) {
  const base = {
    radius: Object.fromEntries(
      Object.entries(tokens.radius).map(([k, v]) => [k, dim(v)]),
    ),
    space: Object.fromEntries(
      Object.entries(tokens.space).map(([k, v]) => [k, dim(v)]),
    ),
    text: Object.fromEntries(
      Object.entries(tokens.text).map(([k, v]) => [k, dim(v)]),
    ),
    motion: {
      duration: Object.fromEntries(
        Object.entries(tokens.motion.duration).map(([k, v]) => [k, dur(v)]),
      ) as Record<keyof typeof tokens.motion.duration, DTCGToken>,
    },
  };

  if (!themes) return base;

  const theme = Object.fromEntries(
    THEME_NAMES.map((name) => {
      const vars = themes[name];
      const colors = themeColors(vars);
      const durations = themeDurations(vars);
      return [
        name,
        {
          color: Object.fromEntries(
            (Object.keys(colors) as RoleName[]).map((role) => [
              role,
              col(colors[role]),
            ]),
          ),
          duration: Object.fromEntries(
            Object.entries(durations).map(([tier, value]) => [
              tier,
              dur(value),
            ]),
          ),
        },
      ];
    }),
  );

  return { ...base, theme };
}
