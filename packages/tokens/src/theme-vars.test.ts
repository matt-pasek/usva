import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ROLE_NAMES } from "./roles.js";
import {
  parseThemeVars,
  THEME_NAMES,
  themeColors,
  themeDurations,
} from "./theme-vars.js";

const read = (name: string) =>
  parseThemeVars(
    readFileSync(new URL(`../themes/${name}.css`, import.meta.url), "utf8"),
  );

describe("parseThemeVars", () => {
  it("reads a hex value", () => {
    expect(parseThemeVars("--usva-bg: #0a0613;").bg).toBe("#0a0613");
  });

  it("reads an rgba value, which scrim is the only user of", () => {
    expect(parseThemeVars("--usva-scrim: rgba(10, 6, 19, 0.6);").scrim).toBe(
      "rgba(10, 6, 19, 0.6)",
    );
  });

  it("collapses a value written across several lines", () => {
    const css =
      "--usva-shadow-raised: 0 1px 2px rgba(0,0,0,0.4),\n  0 0 0 1px #fff;";
    expect(parseThemeVars(css)["shadow-raised"]).toBe(
      "0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px #fff",
    );
  });

  it("ignores a declaration that is not a usva token", () => {
    expect(parseThemeVars("--color-on-sunken: var(--usva-ink);")).toEqual({});
  });
});

describe("every theme", () => {
  it.each(THEME_NAMES)("%s resolves all %i roles", (name) => {
    const colors = themeColors(read(name));
    for (const role of ROLE_NAMES) {
      expect(colors[role], `${name} is missing ${role}`).toBeTruthy();
    }
  });

  it.each(THEME_NAMES)("%s carries its own four duration tiers", (name) => {
    const durations = themeDurations(read(name));
    expect(Object.keys(durations).sort()).toEqual([
      "ambient",
      "base",
      "fast",
      "slow",
    ]);
  });
});

describe("the savi-only roles", () => {
  it("savi defines its own foreground on the well and on the tint", () => {
    const vars = read("savi");
    expect(vars["on-sunken"]).toBe("#2a1f14");
    expect(vars["on-tint"]).toBe("#234f31");
  });

  it("kajo omits them and falls back, as theme.css does", () => {
    const vars = read("kajo");
    expect(vars["on-sunken"]).toBeUndefined();
    const colors = themeColors(vars);
    expect(colors["on-sunken"]).toBe(colors.ink);
    expect(colors["on-tint"]).toBe(colors.accent);
  });
});

describe("themeColors", () => {
  it("throws rather than emit a theme with a hole in it", () => {
    expect(() => themeColors({ bg: "#000" })).toThrow(/missing --usva-/);
  });
});
