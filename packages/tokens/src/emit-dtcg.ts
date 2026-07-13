import { readFileSync, writeFileSync } from "node:fs";
import { toDTCG } from "./dtcg.js";
import { toStudio } from "./studio.js";
import {
  parseThemeVars,
  THEME_NAMES,
  type ThemeName,
  type ThemeVars,
} from "./theme-vars.js";

const themes = Object.fromEntries(
  THEME_NAMES.map((name) => [
    name,
    parseThemeVars(
      readFileSync(new URL(`../themes/${name}.css`, import.meta.url), "utf8"),
    ),
  ]),
) as Record<ThemeName, ThemeVars>;

const write = (file: string, data: unknown) =>
  writeFileSync(
    new URL(`../dist/${file}`, import.meta.url),
    `${JSON.stringify(data, null, 2)}\n`,
  );

write("tokens.dtcg.json", toDTCG(themes));
write("tokens.studio.json", toStudio(themes));
