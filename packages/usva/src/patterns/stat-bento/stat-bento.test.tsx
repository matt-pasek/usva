import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { StatBento } from "./stat-bento.js";

const stats = [
  { value: "2.4k", label: "active users" },
  { value: "98", suffix: "%", label: "uptime" },
  { value: "12", label: "shipped" },
];

describe("StatBento", () => {
  it("renders every stat value and label", () => {
    render(<StatBento stats={stats} />);
    expect(screen.getByText("2.4k")).toBeInTheDocument();
    expect(screen.getByText("active users")).toBeInTheDocument();
    expect(screen.getByText("shipped")).toBeInTheDocument();
  });

  it("renders a suffix keyed to the alternate accent", () => {
    render(<StatBento stats={stats} />);
    expect(screen.getByText("%").className).toContain("text-accent-alt");
  });

  it("uses the display-weight metric treatment", () => {
    render(<StatBento stats={stats} />);
    expect(screen.getByText("2.4k").className).toContain("font-black");
  });

  it("renders an icon slot per stat", () => {
    render(
      <StatBento
        stats={[
          {
            value: "4",
            label: "teams",
            icon: <svg data-testid="ico" aria-hidden="true" />,
          },
        ]}
      />,
    );
    expect(screen.getByTestId("ico")).toBeInTheDocument();
  });

  it("forwards className onto the grid", () => {
    const { container } = render(<StatBento stats={stats} className="mt-10" />);
    expect(container.firstChild).toHaveClass("mt-10");
  });

  it("renders the grid as a custom element so the cells can be staggered", () => {
    const { container } = render(<StatBento as="section" stats={stats} />);
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("keeps the metrics as direct children of the grid", () => {
    const { container } = render(<StatBento stats={stats} />);
    expect(container.firstElementChild?.children).toHaveLength(stats.length);
  });

  /** bg-surface is invisible inside a Card that already paints bg-surface. */
  it("fills cells translucently rather than with a fixed surface token", () => {
    const { container } = render(<StatBento stats={stats} />);
    const cell = container.firstElementChild?.firstElementChild;
    expect(cell?.className).toContain("bg-ink/[0.04]");
    expect(cell?.className).not.toContain("bg-surface");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<StatBento stats={stats} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
