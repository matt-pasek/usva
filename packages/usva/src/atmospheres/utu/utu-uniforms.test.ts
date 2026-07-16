import { describe, expect, it } from "vitest";
import { DAWN, DEFAULT_PARAMS } from "./utu-field.js";
import { utuUniforms } from "./utu-uniforms.js";

describe("Utu kosteus uniforms", () => {
  it("carries pigment, the stain floor, and separate blend and extinction values", () => {
    const pigment: [number, number, number] = [0.2, 0.16, 0.12];
    const uniforms = utuUniforms({ ...DAWN, pigment }, DEFAULT_PARAMS);

    expect(uniforms.uPigment?.value).toEqual(pigment);
    expect(uniforms.uStainFloor?.value).toBe(0.62);
    expect(uniforms.uAbsorb?.value).toBe(0);
    expect(uniforms.uExtinction?.value).toBe(DEFAULT_PARAMS.absorb);
  });
});
