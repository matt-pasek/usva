import { describe, expect, it } from "vitest";
import {
  ambientDrift,
  MAX_FIELD_BLOBS,
  MAX_FIELD_NECKS,
  resolveDriveFrame,
  type SulaBlob,
  type SulaFieldDrive,
} from "./drive.js";

const bounds = { width: 400, height: 800, seed: 3 };

const body = (i: number): SulaBlob => ({ cx: i, cy: i, r: 10 });

describe("drive contract", () => {
  it("is a pure function of time and bounds", () => {
    const a = ambientDrift(12.5, bounds);
    const b = ambientDrift(12.5, bounds);
    expect(a).toEqual(b);
    expect(ambientDrift(13.5, bounds)).not.toEqual(a);
  });

  it("reseeds the ambient drift", () => {
    const a = ambientDrift(4, bounds);
    const b = ambientDrift(4, { ...bounds, seed: 9 });
    expect(a.front?.[0]?.cx).not.toBe(b.front?.[0]?.cx);
  });

  it("keeps the built-in drift inside the plane budgets", () => {
    const frame = ambientDrift(30, bounds);
    expect(frame.back?.length ?? 0).toBeLessThanOrEqual(MAX_FIELD_BLOBS);
    expect(frame.front?.length ?? 0).toBeLessThanOrEqual(MAX_FIELD_BLOBS);
    expect(frame.necks?.length ?? 0).toBeLessThanOrEqual(MAX_FIELD_NECKS);
  });

  it("fills half-extents from the corner radius", () => {
    const resolved = resolveDriveFrame(
      { front: [{ cx: 1, cy: 2, r: 7 }] },
      bounds,
    );
    expect(resolved.front[0]).toEqual({ cx: 1, cy: 2, hw: 7, hh: 7, r: 7 });
  });

  it("defaults both merge radii off the short side", () => {
    const resolved = resolveDriveFrame({}, bounds);
    expect(resolved.kFront).toBeCloseTo(400 * 0.11);
    expect(resolved.kBack).toBeCloseTo(400 * 0.2);
  });

  it("takes the merge radii a drive asks for", () => {
    const resolved = resolveDriveFrame(
      { mergeRadius: 5, backMergeRadius: 9 },
      bounds,
    );
    expect(resolved.kFront).toBe(5);
    expect(resolved.kBack).toBe(9);
  });

  it("clamps a plane past its ceiling and says so", () => {
    const drive: SulaFieldDrive = () => ({
      front: Array.from({ length: MAX_FIELD_BLOBS + 4 }, (_, i) => body(i)),
    });
    const resolved = resolveDriveFrame(drive(0, bounds), bounds);
    expect(resolved.front).toHaveLength(MAX_FIELD_BLOBS);
    expect(resolved.front[0]?.cx).toBe(0);
    expect(resolved.clamped).toBe(true);
  });

  it("clamps necks past their ceiling and says so", () => {
    const necks = Array.from({ length: MAX_FIELD_NECKS + 1 }, (_, i) => ({
      ax: i,
      ay: 0,
      bx: i,
      by: 1,
      r: 2,
    }));
    const resolved = resolveDriveFrame({ necks }, bounds);
    expect(resolved.necks).toHaveLength(MAX_FIELD_NECKS);
    expect(resolved.clamped).toBe(true);
  });

  it("reports no clamp for a frame inside the budgets", () => {
    const resolved = resolveDriveFrame({ front: [body(0)] }, bounds);
    expect(resolved.clamped).toBe(false);
    expect(resolved.back).toEqual([]);
    expect(resolved.necks).toEqual([]);
  });

  it("copies the necks rather than handing the drive's own objects on", () => {
    const neck = { ax: 0, ay: 0, bx: 1, by: 1, r: 2 };
    const resolved = resolveDriveFrame({ necks: [neck] }, bounds);
    expect(resolved.necks[0]).not.toBe(neck);
    expect(resolved.necks[0]).toEqual(neck);
  });
});
