import { describe, expect, it } from "vitest";
import { cn } from "./cn.js";

describe("cn", () => {
  it("merges conflicting tailwind classes, last wins", () => {
    expect(cn("px-2 px-4")).toBe("px-4");
  });
  it("drops falsy values", () => {
    expect(cn("a", false, null, "b")).toBe("a b");
  });
});
