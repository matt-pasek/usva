import { describe, expect, it } from "vitest";
import {
  type GroundSupport,
  LIGHT_GROUND_SUPPORT,
} from "./atmospheres-ground.js";

describe("light-ground atmosphere support", () => {
  it("treats routa as a native light-ground port", () => {
    const support = LIGHT_GROUND_SUPPORT as Record<string, GroundSupport>;
    expect(support.routa).toBe("port");
  });
});
