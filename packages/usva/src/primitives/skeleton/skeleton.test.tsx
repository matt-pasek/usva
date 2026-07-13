import { render } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./skeleton.js";

describe("Skeleton", () => {
  it("is decorative: aria-hidden", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("carries one animation, the sheen, which the stylesheet stops under prefers-reduced-motion", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("skeleton-sheen");
    expect(container.firstChild).not.toHaveClass("animate-shimmer");
  });

  it("applies variant shape classes", () => {
    const { container } = render(<Skeleton variant="circle" />);
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("applies width and height via style", () => {
    const { container } = render(<Skeleton width={120} height={16} />);
    expect(container.firstChild).toHaveStyle({
      width: "120px",
      height: "16px",
    });
  });

  it("applies radius via style", () => {
    const { container } = render(<Skeleton radius={8} />);
    expect(container.firstChild).toHaveStyle({ borderRadius: "8px" });
  });

  it("no a11y violations", async () => {
    const { container } = render(<Skeleton />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
