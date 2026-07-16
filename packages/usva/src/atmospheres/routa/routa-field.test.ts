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
});
