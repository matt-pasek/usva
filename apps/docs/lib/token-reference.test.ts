import { expect, test } from "vitest";
import { buildTokenReference } from "./token-reference";

test("buildTokenReference groups color + spacing + type tokens", () => {
  const ref = buildTokenReference();
  expect(ref.color.length).toBeGreaterThan(0);
  expect(ref.spacing.length).toBeGreaterThan(0);
  expect(ref.radius.length).toBeGreaterThan(0);
  expect(ref.type.length).toBeGreaterThan(0);
  expect(ref.motion.length).toBeGreaterThan(0);
});
