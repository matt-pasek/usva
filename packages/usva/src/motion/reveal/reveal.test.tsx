import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { buildReveal } from "./presets.js";
import { Reveal, RevealGroup } from "./reveal.js";

describe("Reveal", () => {
  it("renders its children", () => {
    render(<Reveal>hello</Reveal>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders as the requested element", () => {
    render(
      <Reveal as="h2" variant="cast">
        heading
      </Reveal>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "heading",
    );
  });

  it("passes through className and attributes", () => {
    render(
      <Reveal className="x" data-testid="r">
        c
      </Reveal>,
    );
    expect(screen.getByTestId("r")).toHaveClass("x");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Reveal as="section" aria-label="intro">
        <p>body</p>
      </Reveal>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("RevealGroup", () => {
  it("renders all children", () => {
    render(
      <RevealGroup>
        <span>a</span>
        <span>b</span>
      </RevealGroup>,
    );
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
  });
});

describe("buildReveal", () => {
  it("collapses to a crossfade under reduced motion", () => {
    const r = buildReveal("surface", 1, true);
    expect(r.initial).toEqual({ opacity: 0 });
    expect(r.animate).toEqual({ opacity: 1 });
  });

  it("scales distance and drops sub-2px blur by intensity", () => {
    const full = buildReveal("veil", 1, false);
    expect(full.initial.y).toBe(12);
    expect(full.initial.filter).toBe("blur(3.0px)");

    const quiet = buildReveal("veil", 0.45, false);
    expect(quiet.initial.y).toBeCloseTo(5.4);
    // 3 * 0.45 = 1.35px < 2px floor → no blur
    expect(quiet.initial.filter).toBeUndefined();
  });

  it("never blurs the tick (data) variant", () => {
    expect(buildReveal("tick", 1, false).initial.filter).toBeUndefined();
  });
});
