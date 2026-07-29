import { describe, expect, it } from "vitest";
import { decodeShare, encodeShare } from "./share";

describe("studio share encoding", () => {
  it("round-trips atmosphere and config", () => {
    const state = {
      atmosphere: "hehku",
      config: { speed: 1.4, cool: "#4832a0", interactive: true, glow: 26 },
    };
    const decoded = decodeShare(encodeShare(state));
    expect(decoded).toEqual(state);
  });

  it("survives config values with special characters", () => {
    const state = {
      atmosphere: "väre",
      config: { hot: "#ffb45e", label: "a / b + c" },
    };
    expect(decodeShare(encodeShare(state))).toEqual(state);
  });

  it("returns null for non-base64 input", () => {
    expect(decodeShare("!!! not base64 !!!")).toBeNull();
  });

  it("returns null when the payload is not a share shape", () => {
    const token = btoa(JSON.stringify({ nope: true }));
    expect(decodeShare(token)).toBeNull();
  });
});
