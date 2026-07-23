import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  buildColors,
  ROUTA_DEFAULTS,
  type RoutaRole,
  resolveParams,
} from "./routa-field.js";

const fieldPath = resolve(
  process.cwd(),
  "src/atmospheres/routa/routa-field.ts",
);
const field = existsSync(fieldPath) ? readFileSync(fieldPath, "utf8") : "";

describe("Routa field contract", () => {
  it("exposes a resolved low, slow frost-heave parameter set", () => {
    expect(field).toContain("export interface RoutaParams");
    expect(field).toContain("export const ROUTA_DEFAULTS");
    expect(field).toContain("export function resolveParams");
    expect(field).toContain("drift:");
  });

  it("keeps the raking light explicit", () => {
    expect(field).toContain("export const DEFAULT_LIGHT");
  });

  it("clamps the seams and motion to material-safe ranges", () => {
    const params = resolveParams({
      cellScale: 0,
      crackWidth: 2,
      uneven: 4,
      drift: -1,
    });
    expect(params.cellScale).toBe(0.5);
    expect(params.crackWidth).toBe(0.2);
    expect(params.uneven).toBe(0.8);
    expect(params.drift).toBe(0);
    expect(ROUTA_DEFAULTS.drift).toBeLessThan(0.01);
  });

  it("keeps the clay's damp under the fissures it sits beside", () => {
    expect(resolveParams({ relief: 9 }).relief).toBe(0.35);
    expect(resolveParams({ relief: -1 }).relief).toBe(0);
    expect(ROUTA_DEFAULTS.relief).toBeLessThan(0.35);
  });

  it("grows the frost once over a readable timescale", () => {
    expect(ROUTA_DEFAULTS.growthRate).toBeGreaterThanOrEqual(0.02);
    expect(ROUTA_DEFAULTS.growthRate).toBeLessThanOrEqual(0.035);
  });

  it("pulls the savi fissure pigment toward ink", () => {
    const roles: Record<RoutaRole, [number, number, number]> = {
      bg: [0.9, 0.85, 0.75],
      ink: [0.12, 0.08, 0.04],
      accent: [0.2, 0.7, 0.35],
      "accent-alt": [0.7, 0.35, 0.2],
    };
    const colors = buildColors(roles, "absorptive");
    expect(colors.pigment[0]).toBeLessThan(roles.accent[0]);
    expect(colors.pigment[1]).toBeLessThan(roles.accent[1]);
  });

  describe("the dark-ground material", () => {
    const roles: Record<RoutaRole, [number, number, number]> = {
      bg: [0.04, 0.02, 0.07],
      ink: [0.9, 0.89, 0.95],
      accent: [0.65, 0.55, 0.98],
      "accent-alt": [0.32, 0.79, 0.54],
    };
    const luma = ([r, g, b]: [number, number, number]) =>
      0.2126 * r + 0.7152 * g + 0.0722 * b;

    it("gives the frost a body to sit on, lifted off the ground it covers", () => {
      const colors = buildColors(roles, "emissive");
      expect(luma(colors.body)).toBeGreaterThan(luma(roles.bg));
    });

    it("cuts the fissures below the body rather than leaving them open", () => {
      const colors = buildColors(roles, "emissive");
      expect(luma(colors.fissure)).toBeLessThan(luma(colors.body));
      expect(luma(colors.fissure)).toBeLessThan(luma(roles.bg));
    });

    it("keeps the raking key the brightest thing on the surface", () => {
      const colors = buildColors(roles, "emissive");
      expect(luma(colors.emission)).toBeGreaterThan(luma(colors.body));
    });

    it("lets a caller override only the key, never the surface", () => {
      const key: [number, number, number] = [1, 0, 0];
      const colors = buildColors(roles, "emissive", key);
      expect(colors.emission).toEqual(key);
      expect(colors.body).toEqual(buildColors(roles, "emissive").body);
    });
  });
});
