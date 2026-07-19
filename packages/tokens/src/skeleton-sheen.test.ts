import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const theme = readFileSync(new URL("../theme.css", import.meta.url), "utf8");

describe("SkeletonGroup sheen", () => {
  it("samples one travelling group band through every local border mask", () => {
    expect(theme).toMatch(
      /@property --usva-sheen-position[\s\S]*?inherits:\s*true;/,
    );
    expect(theme).toMatch(
      /@utility skeleton-group[\s\S]*?animation:\s*usva-sheen-travel/,
    );
    expect(theme).toMatch(
      /&\[data-skeleton-grouped\]::after[\s\S]*?background-image:\s*linear-gradient/,
    );
    expect(theme).toMatch(
      /background-size:\s*var\(--usva-skeleton-group-width\)\s+var\(--usva-skeleton-group-height\)/,
    );
    expect(theme).toMatch(
      /background-position:\s*calc\(0px - var\(--usva-skeleton-offset-x\)\)\s+calc\(0px - var\(--usva-skeleton-offset-y\)\)/,
    );
    expect(theme).toMatch(
      /@utility skeleton-sheen[\s\S]*?mask-composite:\s*exclude;/,
    );
  });
});
