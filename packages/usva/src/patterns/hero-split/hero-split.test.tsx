import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { HeroSplit } from "./hero-split.js";

describe("HeroSplit", () => {
  it("renders the title and its accented phrase", () => {
    render(<HeroSplit title="Your degree," titleAccent="in one place." />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Your degree, in one place.");
  });

  it("renders the headline at a chosen level", () => {
    render(<HeroSplit headingLevel="h2" title="Nested hero" />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("colors the accented phrase with an arbitrary categorical color", () => {
    render(
      <HeroSplit
        title="Your degree,"
        titleAccent="in one place."
        accentColor="#52c989"
      />,
    );
    expect(screen.getByText("in one place.")).toHaveStyle({ color: "#52c989" });
  });

  it("omits the accent span when there is no accented phrase", () => {
    render(<HeroSplit title="Just a title" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Just a title",
    );
  });

  it("renders the badge, body, actions, proof and note slots", () => {
    render(
      <HeroSplit
        title="x"
        badge={<span data-testid="badge">v1.2</span>}
        body="Four registries, one planner."
        actions={<button type="button">Install</button>}
        proof={<span data-testid="proof">2.4k users</span>}
        note="Desktop only for now."
      />,
    );
    expect(screen.getByTestId("badge")).toBeInTheDocument();
    expect(
      screen.getByText("Four registries, one planner."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Install" })).toBeInTheDocument();
    expect(screen.getByTestId("proof")).toBeInTheDocument();
    expect(screen.getByText("Desktop only for now.")).toBeInTheDocument();
  });

  it("renders the visual slot", () => {
    render(<HeroSplit title="x" visual={<img alt="Product" src="/p.png" />} />);
    expect(screen.getByAltText("Product")).toBeInTheDocument();
  });

  /** The Plasma background is bucket C, so it never ships. It is a slot. */
  it("renders a background slot behind a scrim", () => {
    const { container } = render(
      <HeroSplit title="x" background={<div data-testid="plasma" />} />,
    );
    expect(screen.getByTestId("plasma")).toBeInTheDocument();
    const scrim = container.querySelector("[data-hero-scrim]");
    expect(scrim).toBeInTheDocument();
    expect(scrim).toHaveAttribute("aria-hidden", "true");
  });

  it("draws no scrim when there is no background", () => {
    const { container } = render(<HeroSplit title="x" />);
    expect(container.querySelector("[data-hero-scrim]")).toBeNull();
  });

  /** A hero dropped into a narrow column must not size itself off the window. */
  it("sizes the title off its container, not the viewport", () => {
    render(<HeroSplit title="x" />);
    const className = screen.getByRole("heading", { level: 1 }).className;
    expect(className).toContain("cqi");
    expect(className).not.toContain("vw");
  });

  it("switches to a side-by-side layout on container width, not viewport width", () => {
    const { container } = render(<HeroSplit title="x" />);
    const section = container.firstElementChild;
    expect(section?.className).toContain("@container");
    expect(section?.className).toContain("@5xl:flex-row");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <HeroSplit
        title="Your degree,"
        titleAccent="in one place."
        badge={<span>v1.2 shipped</span>}
        body="Four registries, one planner."
        actions={<button type="button">Install</button>}
        proof={<span>2.4k active users</span>}
        note="Desktop only for now."
        visual={<img alt="Product screenshot" src="/p.png" />}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
