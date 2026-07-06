import { describe, expect, it } from "vitest";
import { ROLE_NAMES } from "./roles.js";
import { toSafelistCSS } from "./safelist.js";

const listed = (css: string): string[] => {
  const match = /@source inline\("bg-\{(.+?)\}"\);/.exec(css);
  if (!match?.[1]) throw new Error("no bg- safelist found in emitted CSS");
  return match[1].split(",");
};

describe("toSafelistCSS", () => {
  it("safelists a bg- utility for every role", () => {
    expect(listed(toSafelistCSS()).sort()).toEqual([...ROLE_NAMES].sort());
  });

  it("covers the roles the token reference renders as swatches", () => {
    const roles = listed(toSafelistCSS());
    for (const role of ["sunken", "on-sunken", "on-tint", "accent-tint"])
      expect(roles).toContain(role);
  });

  it("does not safelist text- utilities, which would resurrect text-faint", () => {
    expect(toSafelistCSS()).not.toContain("text-");
  });
});
