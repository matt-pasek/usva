import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { toStudio } from "./studio.js";
import {
  parseRadii,
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

const radii = parseRadii(
  readFileSync(new URL("../theme.css", import.meta.url), "utf8"),
);

const file = toStudio(themes, radii);

interface Token {
  type: string;
  value: string;
}

/** Reaches into the emitted file the way the plugin will, and fails loudly on a
 * hole rather than letting an optional chain quietly pass the test. */
function token(theme: ThemeName, group: string, name: string): Token {
  const set = file[theme] as Record<string, Record<string, Token>>;
  const found = set[group]?.[name];
  if (!found) throw new Error(`${theme}.${group}.${name} is missing`);
  return found;
}

describe("toStudio", () => {
  it("puts the scales in core, where every theme shares them", () => {
    expect(file.core).toHaveProperty("radius");
    expect(file.core).toHaveProperty("space");
    expect(file.core).toHaveProperty("text");
  });

  it("gives each theme a set that Figma can switch between", () => {
    expect(file.$metadata.tokenSetOrder).toEqual([
      "core",
      "kajo",
      "sisu",
      "savi",
    ]);
    expect(file.$themes).toHaveLength(3);
    expect(file.$themes[0]).toMatchObject({
      name: "kajo",
      selectedTokenSets: { core: "enabled", kajo: "enabled" },
    });
  });

  it("carries the colour of every role, typed as a colour", () => {
    expect(token("kajo", "color", "accent")).toEqual({
      type: "color",
      value: "#a78bfa",
    });
    expect(token("savi", "color", "bg").value).toBe("#e7dcc8");
  });

  it("keeps the duration tiers that genuinely differ per theme", () => {
    expect(token("kajo", "duration", "base").value).toBe("220ms");
    expect(token("sisu", "duration", "base").value).toBe("160ms");
    expect(token("savi", "duration", "base").value).toBe("200ms");
  });

  it("resolves the savi-only roles for the themes that omit them", () => {
    expect(token("kajo", "color", "on-sunken").value).toBe(
      token("kajo", "color", "ink").value,
    );
    expect(token("savi", "color", "on-sunken").value).toBe("#2a1f14");
  });

  it("carries the same two families in every theme", () => {
    for (const theme of THEME_NAMES) {
      expect(token(theme, "font", "sans").value).toContain("Fira Sans");
      expect(token(theme, "font", "mono").value).toContain("Fira Code");
    }
  });

  it("carries easing, elevation, focus and z-index for every theme", () => {
    for (const theme of THEME_NAMES) {
      expect(token(theme, "easing", "soft").value).toBeTruthy();
      expect(token(theme, "elevation", "floating").value).toBeTruthy();
      expect(token(theme, "zIndex", "toast").value).toBe(60);
      const set = file[theme] as Record<string, Token>;
      expect(set.focus?.value, `${theme}.focus`).toBeTruthy();
    }
  });

  it("takes the radius scale from theme.css rather than a second copy", () => {
    const radius = file.core.radius as Record<string, Token>;
    expect(Object.keys(radius).sort()).toEqual(Object.keys(radii).sort());
    expect(radius.full, "the CSS declares no full radius").toBeUndefined();
  });
});
