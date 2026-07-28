import { describe, expect, it } from "vitest";
import {
  activePillRect,
  type Blob,
  bridgeNecks,
  lerpBlob,
  MAX_BLOBS,
  MAX_NECKS,
  measureRestBlobs,
  morphBlob,
  neckBreakDistance,
  neckRadius,
  packHover,
  packUniforms,
  restDiffers,
  springToBlob,
  toCanvasSpace,
} from "./geometry.js";

const blob = (over: Partial<Blob> = {}): Blob => ({
  cx: 100,
  cy: 40,
  hw: 80,
  hh: 24,
  r: 24,
  ...over,
});

const K = 26;

describe("packHover", () => {
  it("packs the live pointer position into canvas coordinates", () => {
    const packed = packHover(blob(), 1.2, 2, 200, { x: 75, y: 30 });

    expect(packed.point).toEqual([150, 340]);
    expect(packed.amount).toBeCloseTo(2.4);
    expect(packed.spread).toBeGreaterThan(100);
  });
});

describe("toCanvasSpace", () => {
  it("centres a DOM rect in canvas space", () => {
    const rect = { left: 120, top: 30, width: 200, height: 48 };
    const canvas = { left: 20, top: 10, width: 800, height: 120 };
    expect(toCanvasSpace(rect, canvas)).toEqual({
      cx: 200,
      cy: 44,
      hw: 100,
      hh: 24,
      r: 24,
    });
  });
});

describe("measureRestBlobs", () => {
  it("reads untransformed geometry without clearing a visible transform", () => {
    const part = {
      style: { transform: "translateX(-48px)" },
      getBoundingClientRect() {
        return {
          left: this.style.transform ? 72 : 120,
          top: 30,
          width: 200,
          height: 48,
        };
      },
    };

    expect(
      measureRestBlobs([part], { left: 20, top: 10, width: 800, height: 120 }),
    ).toEqual([{ cx: 200, cy: 44, hw: 100, hh: 24, r: 24 }]);
    expect(part.style.transform).toBe("translateX(-48px)");
  });
});

describe("packUniforms", () => {
  const field = { blobs: [blob()], necks: [], k: K };

  it("flips Y, because gl_FragCoord counts up from the bottom", () => {
    const packed = packUniforms(field, 1, 120);
    expect(packed.blobs[1]).toBe(80);
  });

  it("scales every dimension by the device pixel ratio", () => {
    const packed = packUniforms(field, 2, 120);
    expect(Array.from(packed.blobs.slice(0, 4))).toEqual([200, 160, 160, 48]);
    expect(packed.radii[0]).toBe(48);
  });

  it("pads the unused slots and reports the true counts", () => {
    const packed = packUniforms(
      { blobs: [blob()], necks: [{ ax: 1, ay: 2, bx: 3, by: 4, r: 5 }], k: K },
      1,
      120,
    );
    expect(packed.blobCount).toBe(1);
    expect(packed.neckCount).toBe(1);
    expect(packed.blobs).toHaveLength(MAX_BLOBS * 4);
    expect(packed.necks).toHaveLength(MAX_NECKS * 4);
    expect(packed.blobs[4]).toBe(0);
  });

  it("never emits more than the shader has slots for", () => {
    const packed = packUniforms(
      {
        blobs: Array.from({ length: MAX_BLOBS + 3 }, () => blob()),
        necks: Array.from({ length: MAX_NECKS + 3 }, () => ({
          ax: 0,
          ay: 0,
          bx: 1,
          by: 1,
          r: 2,
        })),
        k: K,
      },
      1,
      120,
    );
    expect(packed.blobCount).toBe(MAX_BLOBS);
    expect(packed.neckCount).toBe(MAX_NECKS);
  });

  it("keeps the top tether and both side tethers in one frame", () => {
    const packed = packUniforms(
      {
        blobs: [blob()],
        necks: Array.from({ length: 3 }, (_, index) => ({
          ax: index,
          ay: 0,
          bx: index + 1,
          by: 1,
          r: 2,
        })),
        k: K,
      },
      1,
      120,
    );
    expect(packed.neckCount).toBe(3);
  });

  it("defaults an unmarked neck to a solid bridge", () => {
    const packed = packUniforms(
      { blobs: [blob()], necks: [{ ax: 0, ay: 0, bx: 10, by: 0, r: 2 }], k: K },
      1,
      120,
    );
    expect(packed.neckStrengths[0]).toBe(1);
  });
});

describe("bridgeNecks", () => {
  const pair = (): Blob[] => [
    blob({ cx: 0, hw: 20 }),
    blob({ cx: 60, hw: 20 }),
  ];

  it("holds full strength once merge passes the rest floor", () => {
    // A partial strength held at rest recedes the bridge into two sharp cusps.
    expect(bridgeNecks(pair(), K, 1)[0]?.strength).toBe(1);
    expect(bridgeNecks(pair(), K, 0.32)[0]?.strength).toBe(1);
    expect(bridgeNecks(pair(), K, 0)).toEqual([]);
  });

  it("fades strength only through a transient melt below the floor", () => {
    const strength = bridgeNecks(pair(), K, 0.15)[0]?.strength ?? 0;
    expect(strength).toBeGreaterThan(0);
    expect(strength).toBeLessThan(1);
  });

  it("fattens the waist as the pair closes in", () => {
    const near = bridgeNecks(pair(), K, 0.32)[0];
    const far = bridgeNecks(
      [blob({ cx: 0, hw: 20 }), blob({ cx: 74, hw: 20 })],
      K,
      0.32,
    )[0];
    expect(near?.r ?? 0).toBeGreaterThan(far?.r ?? 0);
  });

  it("begins reaching before contact and strengthens continuously as the gap closes", () => {
    const reach = K * 1.6;
    const strengths = [0.05, 0.1, 0.2, 0.4].map((closeness) => {
      const gap = reach * (1 - closeness);
      const neck = bridgeNecks(
        [blob({ cx: 0, hw: 20 }), blob({ cx: 40 + gap, hw: 20 })],
        K,
        1,
      )[0];

      expect(neck).toBeDefined();
      expect(neck?.strength ?? 0).toBeGreaterThan(0);
      return neck?.strength ?? 0;
    });

    for (let i = 1; i < strengths.length; i++) {
      expect(strengths[i]).toBeGreaterThan(strengths[i - 1] as number);
    }
    expect(strengths[0]).toBeLessThan(0.1);
    expect(strengths.at(-1)).toBe(1);
  });

  it("skips a pair past the reach entirely", () => {
    const blobs = [blob({ cx: 0, hw: 20 }), blob({ cx: 200, hw: 20 })];
    expect(bridgeNecks(blobs, K, 1)).toEqual([]);
  });

  it("bridges along the pair's own axis for stacked blobs", () => {
    const a: Blob = { cx: 0, cy: 0, hw: 22, hh: 22, r: 22 };
    const b: Blob = { cx: 0, cy: 60, hw: 22, hh: 22, r: 22 };
    const neck = bridgeNecks([a, b], K, 1)[0];
    expect(neck?.ax).toBeCloseTo(0, 6);
    expect(neck?.bx).toBeCloseTo(0, 6);
    expect(neck?.ay).toBeCloseTo(22, 6);
    expect(neck?.by).toBeCloseTo(38, 6);
  });
});

describe("lerpBlob", () => {
  it("interpolates centre, half-extents and the corner radius", () => {
    const a = blob({ cx: 0, cy: 0, hw: 10, hh: 10, r: 2 });
    const b = blob({ cx: 100, cy: 50, hw: 20, hh: 30, r: 12 });
    expect(lerpBlob(a, b, 0.5)).toEqual({
      cx: 50,
      cy: 25,
      hw: 15,
      hh: 20,
      r: 7,
    });
  });
});

describe("springToBlob", () => {
  it("lets the centre overshoot but never the half-extents", () => {
    const from = blob({ cx: 0, hw: 0, hh: 0, r: 0 });
    const to = blob({ cx: 100, hw: 80, hh: 24, r: 24 });
    const result = springToBlob(from, to, 1.15);
    expect(result.cx).toBeCloseTo(115);
    expect(result.hw).toBe(80);
    expect(result.hh).toBe(24);
    expect(result.r).toBe(24);
  });
});

describe("morphBlob", () => {
  it("drives position and size on independent progresses", () => {
    const a = blob({ cx: 0, cy: 0, hw: 10, hh: 10, r: 5 });
    const b = blob({ cx: 100, cy: 40, hw: 60, hh: 20, r: 15 });
    const m = morphBlob(a, b, 1, 0);
    expect(m.cx).toBe(100);
    expect(m.cy).toBe(40);
    expect(m.hw).toBe(10);
    expect(m.hh).toBe(10);
  });
});

describe("restDiffers", () => {
  const current = [blob(), blob({ cx: 300 })];

  it("ignores subpixel jitter", () => {
    const next = [blob({ cx: 100.3 }), blob({ cx: 300, hh: 24.4 })];
    expect(restDiffers(current, next)).toBe(false);
  });

  it("flags a real reflow", () => {
    expect(restDiffers(current, [blob(), blob({ cx: 306 })])).toBe(true);
    expect(restDiffers(current, [blob({ hw: 88 }), blob({ cx: 300 })])).toBe(
      true,
    );
  });

  it("flags a changed part count", () => {
    expect(restDiffers(current, [blob()])).toBe(true);
  });
});

describe("neckRadius", () => {
  it("thins monotonically and reaches zero at the break distance", () => {
    const span = neckBreakDistance(K);
    const radii = [0, 0.25, 0.5, 0.75].map((f) => neckRadius(span * f, K));
    for (let i = 1; i < radii.length; i++) {
      expect(radii[i]).toBeLessThan(radii[i - 1] as number);
    }
    expect(neckRadius(span, K)).toBe(0);
    expect(neckRadius(span * 2, K)).toBe(0);
  });

  it("is thickest when the blobs still overlap", () => {
    expect(neckRadius(-40, K)).toBe(neckRadius(0, K));
  });
});

describe("activePillRect", () => {
  const items = [blob({ cx: 10 }), blob({ cx: 20 })];

  it("returns the active item's blob", () => {
    expect(activePillRect(items, 1)?.cx).toBe(20);
  });

  it("returns null outside the list", () => {
    expect(activePillRect(items, -1)).toBeNull();
    expect(activePillRect(items, 5)).toBeNull();
  });
});

describe("purity", () => {
  it("never mutates its inputs", () => {
    const a = blob();
    const b = blob({ cx: 300 });
    const snapshot = [{ ...a }, { ...b }];
    lerpBlob(a, b, 0.5);
    springToBlob(a, b, 1.2);
    morphBlob(a, b, 0.5, 0.5);
    packUniforms({ blobs: [a, b], necks: [], k: K }, 2, 120);
    expect([a, b]).toEqual(snapshot);
  });
});
