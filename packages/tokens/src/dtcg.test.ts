import { describe, expect, it } from "vitest";
import { toDTCG } from "./dtcg.js";

describe("toDTCG", () => {
  it("emits radius as DTCG dimension tokens", () => {
    const out = toDTCG();
    expect(out.radius.md).toEqual({ $type: "dimension", $value: "0.5rem" });
  });
  it("emits motion durations", () => {
    const out = toDTCG();
    expect(out.motion.duration.base.$value).toBe("200ms");
  });
});
