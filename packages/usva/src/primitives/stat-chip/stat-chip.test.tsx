import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { StatChip } from "./stat-chip.js";

describe("StatChip", () => {
  it("renders label, value and unit", () => {
    render(<StatChip label="credits" value="142" unit="cr" />);
    expect(screen.getByText("credits")).toBeInTheDocument();
    expect(screen.getByText("142")).toBeInTheDocument();
    expect(screen.getByText("cr")).toBeInTheDocument();
  });

  it("colors the value by tone", () => {
    render(<StatChip tone="accent-alt" value="99" />);
    expect(screen.getByText("99")).toHaveClass("text-accent-alt");
  });

  it("renders tabular figures", () => {
    render(<StatChip value="1,240" />);
    expect(screen.getByText("1,240").parentElement).toHaveClass("tabular-nums");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <StatChip label="uptime" value="99.9" unit="%" tone="success" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
