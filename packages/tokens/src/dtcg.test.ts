import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { toDTCG } from "./dtcg.js";
import {
  parseRadii,
  parseThemeVars,
  THEME_NAMES,
  type ThemeName,
  type ThemeVars,
} from "./theme-vars.js";

const read = (path: string) =>
  readFileSync(new URL(path, import.meta.url), "utf8");

const themes = Object.fromEntries(
  THEME_NAMES.map((name) => [
    name,
    parseThemeVars(read(`../themes/${name}.css`)),
  ]),
) as Record<ThemeName, ThemeVars>;

const radii = parseRadii(read("../theme.css"));
const out = toDTCG(themes, radii);

const theme = (name: ThemeName) => {
  const set = out.theme?.[name];
  if (!set) throw new Error(`${name} is missing from the export`);
  return set;
};

describe("toDTCG", () => {
  it("emits the radius scale theme.css declares", () => {
    expect(out.radius.md).toEqual({ $type: "dimension", $value: "0.5rem" });
    expect(Object.keys(out.radius).sort()).toEqual(Object.keys(radii).sort());
    expect(out.radius.full).toBeUndefined();
  });

  it("exports every duration tier per theme", () => {
    for (const name of THEME_NAMES) {
      expect(Object.keys(theme(name).duration).sort()).toEqual([
        "ambient",
        "base",
        "fast",
        "slow",
      ]);
    }
    expect(theme("savi").duration.base?.$value).toBe("200ms");
  });

  it("splits font stacks into family lists", () => {
    expect(theme("kajo").font.mono).toEqual({
      $type: "fontFamily",
      $value: [
        "Fira Code",
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "monospace",
      ],
    });
  });

  it("names the same two families in every theme", () => {
    for (const name of THEME_NAMES) {
      expect(theme(name).font.mono.$value).toContain("Fira Code");
      expect(theme(name).font.sans.$value).toContain("Fira Sans");
    }
  });

  it("types a cubic-bezier easing as one and keeps other curves verbatim", () => {
    expect(theme("savi").easing.soft).toEqual({
      $type: "cubicBezier",
      $value: [0.22, 1, 0.36, 1],
    });
    expect(theme("kajo").easing.spring.$type).toBe("cssEasing");
    expect(String(theme("kajo").easing.spring.$value)).toContain("linear(");
  });

  it("carries elevation and focus rather than dropping them", () => {
    for (const name of THEME_NAMES) {
      const set = theme(name);
      expect(Object.keys(set.elevation).sort()).toEqual([
        "floating",
        "overlay",
        "raised",
      ]);
      expect(set.elevation.raised.$type).toBe("cssShadow");
      expect(set.focus.$type).toBe("cssShadow");
    }
  });

  it("emits z-layers as numbers", () => {
    expect(theme("kajo").zIndex.toast).toEqual({ $type: "number", $value: 60 });
    expect(theme("kajo").zIndex.base.$value).toBe(0);
  });

  it("gives every theme the same token categories", () => {
    const shape = Object.keys(theme("kajo")).sort();
    for (const name of THEME_NAMES) {
      expect(Object.keys(theme(name)).sort(), name).toEqual(shape);
    }
    expect(shape).toEqual([
      "color",
      "duration",
      "easing",
      "elevation",
      "focus",
      "font",
      "zIndex",
    ]);
  });
});
