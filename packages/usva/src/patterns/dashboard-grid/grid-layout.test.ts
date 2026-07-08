import { describe, expect, it } from "vitest";
import {
  addItem,
  applyPatch,
  canPlace,
  clampItem,
  deltaToCells,
  findOpenSlot,
  type GridItem,
  itemsOverlap,
  removeItem,
} from "./grid-layout.js";

const bounds = { columns: 10, rows: 8 };
const item = (
  id: string,
  x: number,
  y: number,
  w = 2,
  h = 2,
  rest: Partial<GridItem> = {},
): GridItem => ({ id, x, y, w, h, ...rest });

describe("clampItem", () => {
  it("keeps an item inside the grid", () => {
    expect(clampItem(item("a", 9, 7, 3, 3), bounds)).toMatchObject({
      x: 7,
      y: 5,
      w: 3,
      h: 3,
    });
  });

  it("keeps an item inside its own size limits", () => {
    const constrained = item("a", 0, 0, 1, 9, { minW: 2, maxH: 4 });
    expect(clampItem(constrained, bounds)).toMatchObject({ w: 2, h: 4 });
  });

  it("never lets an item exceed the grid, whatever its maxima say", () => {
    const huge = item("a", 0, 0, 99, 99, { maxW: 99, maxH: 99 });
    expect(clampItem(huge, bounds)).toMatchObject({ w: 10, h: 8 });
  });

  it("never lets an item shrink below one cell", () => {
    expect(clampItem(item("a", 0, 0, 0, -3), bounds)).toMatchObject({
      w: 1,
      h: 1,
    });
  });

  /** Position clamping depends on the settled size, so size has to win first. */
  it("clamps position against the clamped size, not the requested one", () => {
    const wide = item("a", 8, 0, 6, 1, { maxW: 4 });
    expect(clampItem(wide, bounds)).toMatchObject({ x: 6, w: 4 });
  });

  it("does not mutate its input", () => {
    const original = item("a", 99, 99, 99, 99);
    clampItem(original, bounds);
    expect(original).toMatchObject({ x: 99, y: 99, w: 99, h: 99 });
  });
});

describe("itemsOverlap", () => {
  it("sees an overlap", () => {
    expect(itemsOverlap(item("a", 0, 0, 2, 2), item("b", 1, 1, 2, 2))).toBe(
      true,
    );
  });

  it("lets neighbours touch without overlapping", () => {
    expect(itemsOverlap(item("a", 0, 0, 2, 2), item("b", 2, 0, 2, 2))).toBe(
      false,
    );
    expect(itemsOverlap(item("a", 0, 0, 2, 2), item("b", 0, 2, 2, 2))).toBe(
      false,
    );
  });
});

describe("canPlace", () => {
  const layout = [item("a", 0, 0), item("b", 4, 0)];

  it("accepts an empty patch of grid", () => {
    expect(canPlace(layout, item("c", 2, 0), bounds)).toBe(true);
  });

  it("rejects a collision", () => {
    expect(canPlace(layout, item("c", 1, 0), bounds)).toBe(false);
  });

  it("ignores the item being moved, so a nudge onto itself is legal", () => {
    expect(canPlace(layout, item("a", 1, 0), bounds)).toBe(true);
  });

  /** An out-of-bounds candidate is clamped back in, and may then collide. */
  it("collides after being clamped into the grid", () => {
    const packed = [item("a", 8, 0, 2, 2)];
    expect(canPlace(packed, item("c", 12, 0, 2, 2), bounds)).toBe(false);
  });
});

describe("findOpenSlot", () => {
  it("finds the first free position, scanning rows before columns", () => {
    const layout = [item("a", 0, 0)];
    expect(findOpenSlot(layout, item("new", 0, 0), bounds)).toMatchObject({
      x: 2,
      y: 0,
    });
  });

  it("drops to the next row when the first is full", () => {
    const full = Array.from({ length: 5 }, (_, index) =>
      item(`f${index}`, index * 2, 0),
    );
    expect(findOpenSlot(full, item("new", 0, 0), bounds)).toMatchObject({
      x: 0,
      y: 2,
    });
  });

  it("returns null when nothing fits", () => {
    const full = Array.from({ length: 4 }, (_, index) =>
      item(`f${index}`, 0, index * 2, 10, 2),
    );
    expect(findOpenSlot(full, item("new", 0, 0), bounds)).toBeNull();
  });

  it("respects the incoming item's minimum size when looking", () => {
    const layout = [item("a", 0, 0, 8, 8)];
    expect(
      findOpenSlot(layout, item("new", 0, 0, 1, 1, { minW: 4 }), bounds),
    ).toBeNull();
  });
});

describe("applyPatch", () => {
  const layout = [item("a", 0, 0), item("b", 4, 0)];

  it("moves an item", () => {
    const next = applyPatch(layout, "a", { x: 2 }, bounds);
    expect(next[0]).toMatchObject({ id: "a", x: 2, y: 0 });
  });

  it("resizes an item", () => {
    const next = applyPatch(layout, "a", { w: 3 }, bounds);
    expect(next[0]).toMatchObject({ w: 3 });
  });

  /** Callers compare by reference to decide whether to shake the item. */
  it("returns the same array when the move collides", () => {
    expect(applyPatch(layout, "a", { x: 4 }, bounds)).toBe(layout);
  });

  it("returns the same array when clamping cancels the move out", () => {
    expect(applyPatch(layout, "a", { x: -5 }, bounds)).toBe(layout);
  });

  it("returns the same array for an unknown id", () => {
    expect(applyPatch(layout, "ghost", { x: 1 }, bounds)).toBe(layout);
  });

  it("does not mutate the previous layout", () => {
    applyPatch(layout, "a", { x: 2 }, bounds);
    expect(layout[0]).toMatchObject({ x: 0 });
  });

  /** Growing an item into a neighbour must be refused, not silently clipped. */
  it("refuses a resize that would overlap a neighbour", () => {
    expect(applyPatch(layout, "a", { w: 6 }, bounds)).toBe(layout);
  });

  it("accepts a resize that stops short of a neighbour", () => {
    const next = applyPatch(layout, "a", { w: 4 }, bounds);
    expect(next).not.toBe(layout);
    expect(next[0]).toMatchObject({ w: 4 });
  });
});

describe("addItem and removeItem", () => {
  it("adds into the first open slot", () => {
    const next = addItem([item("a", 0, 0)], item("b", 0, 0), bounds);
    expect(next).toHaveLength(2);
    expect(next[1]).toMatchObject({ id: "b", x: 2, y: 0 });
  });

  it("refuses a duplicate id", () => {
    const layout = [item("a", 0, 0)];
    expect(addItem(layout, item("a", 4, 4), bounds)).toBe(layout);
  });

  it("leaves the layout alone when there is no room", () => {
    const layout = [item("a", 0, 0, 10, 8)];
    expect(addItem(layout, item("b", 0, 0), bounds)).toBe(layout);
  });

  it("removes by id", () => {
    expect(removeItem([item("a", 0, 0), item("b", 4, 0)], "a")).toEqual([
      item("b", 4, 0),
    ]);
  });
});

describe("deltaToCells", () => {
  const step = { column: 100, row: 80 };

  it("rounds a pixel delta to whole cells", () => {
    expect(deltaToCells({ x: 149, y: -41 }, step)).toEqual({ x: 1, y: -1 });
    expect(deltaToCells({ x: 151, y: -39 }, step)).toEqual({ x: 2, y: 0 });
  });

  /** A zero step means the grid has not been measured yet. Do not divide by it. */
  it("survives an unmeasured grid", () => {
    expect(deltaToCells({ x: 300, y: 300 }, { column: 0, row: 0 })).toEqual({
      x: 0,
      y: 0,
    });
  });
});
