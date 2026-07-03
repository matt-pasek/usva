import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Progress } from "./progress.js";

describe("Progress", () => {
  it("exposes progressbar semantics", () => {
    render(<Progress value={40} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("respects a custom max", () => {
    render(<Progress value={5} max={10} />);
    const fill = screen.getByRole("progressbar").firstChild as HTMLElement;
    expect(fill).toHaveStyle({ width: "50%" });
  });

  it("clamps out-of-range values", () => {
    render(<Progress value={150} />);
    const fill = screen.getByRole("progressbar").firstChild as HTMLElement;
    expect(fill).toHaveStyle({ width: "100%" });
  });

  it("omits aria-valuenow when indeterminate", () => {
    render(<Progress />);
    const bar = screen.getByRole("progressbar");
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar.firstChild).toHaveClass("animate-shimmer");
  });

  it("adds glow when requested", () => {
    render(<Progress value={30} glow />);
    expect(screen.getByRole("progressbar").firstChild).toHaveClass(
      "glow-accent",
    );
  });

  it("guards width transition under prefers-reduced-motion", () => {
    render(<Progress value={30} />);
    expect(screen.getByRole("progressbar").firstChild).toHaveClass(
      "motion-reduce:transition-none",
    );
  });

  it("no a11y violations", async () => {
    const { container } = render(<Progress value={40} aria-label="Upload" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
