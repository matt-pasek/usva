import { describe, expect, it } from "vitest";
import { rewriteImports } from "./rewrite-imports.js";

describe("rewriteImports", () => {
  it("points cn at the shadcn utils module", () => {
    expect(rewriteImports('import { cn } from "../../cn.js";')).toBe(
      'import { cn } from "@/lib/utils";',
    );
  });

  it("flattens a cross-kind import", () => {
    expect(
      rewriteImports(
        'import { Spinner } from "../../primitives/spinner/spinner.js";',
      ),
    ).toBe('import { Spinner } from "./spinner";');
  });

  it("flattens a sibling-directory import", () => {
    expect(rewriteImports('import { Card } from "../card/card.js";')).toBe(
      'import { Card } from "./card";',
    );
  });

  it("drops the .js extension from a same-directory import", () => {
    expect(rewriteImports('import { Avatar } from "./avatar.js";')).toBe(
      'import { Avatar } from "./avatar";',
    );
  });

  it("preserves type-only imports", () => {
    expect(
      rewriteImports(
        'import { Card, type CardProps } from "../../primitives/card/card.js";',
      ),
    ).toBe('import { Card, type CardProps } from "./card";');
  });

  it("leaves bare package specifiers alone", () => {
    const src =
      'import * as React from "react";\nimport { motion } from "motion/react";';
    expect(rewriteImports(src)).toBe(src);
  });
});
