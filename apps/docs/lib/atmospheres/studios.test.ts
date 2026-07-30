import { describe, expect, it } from "vitest";
import { studioByName, studios } from "./index";

describe("atmosphere studio registry", () => {
  it("registers all eight atmospheres with unique names", () => {
    const names = studios.map((studio) => studio.name);
    expect(names).toHaveLength(8);
    expect(new Set(names).size).toBe(8);
    expect([...names].sort()).toEqual([
      "hehku",
      "kajastus",
      "kuulto",
      "kynnos",
      "loimu",
      "routa",
      "utu",
      "vare",
    ]);
  });

  it("indexes each studio by name", () => {
    for (const studio of studios) {
      expect(studioByName[studio.name]).toBe(studio);
    }
  });

  for (const studio of studios) {
    describe(studio.name, () => {
      it("has its default template present and non-empty fields", () => {
        expect(studio.templates[studio.defaultTemplate]).toBeDefined();
        expect(studio.fields.length).toBeGreaterThan(0);
        expect(studio.blurb.length).toBeGreaterThan(0);
      });

      it("emits a deterministic import snippet for its default preset", () => {
        const preset = studio.templates[studio.defaultTemplate];
        if (!preset) throw new Error("missing default preset");
        const snippet = studio.snippet(preset);
        expect(snippet).toBe(studio.snippet(preset));
        expect(snippet).toContain(
          `from "@usva-ui/react/atmospheres/${studio.name}"`,
        );
        expect(snippet).not.toContain('from "@usva-ui/react"');
      });

      it("only references its own field keys in the config", () => {
        const preset = studio.templates[studio.defaultTemplate];
        if (!preset) throw new Error("missing default preset");
        for (const field of studio.fields) {
          expect(preset).toHaveProperty(String(field.key));
        }
      });
    });
  }
});
