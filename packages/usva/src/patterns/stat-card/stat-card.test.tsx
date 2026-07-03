import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { StatCard } from "./stat-card.js";

describe("StatCard", () => {
  it("renders label, value and unit", () => {
    render(<StatCard label="Revenue" value="48,209" unit="USD" />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("48,209")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("applies success tone for an up trend", () => {
    render(<StatCard label="x" value="1" note="+5%" trend="up" />);
    expect(screen.getByText(/\+5%/).className).toContain("text-success");
  });

  it("applies danger tone for a down trend", () => {
    render(<StatCard label="x" value="1" note="-5%" trend="down" />);
    expect(screen.getByText(/-5%/).className).toContain("text-danger");
  });

  it("renders a spark slot", () => {
    render(<StatCard label="x" value="1" spark={<span>spark-child</span>} />);
    expect(screen.getByText("spark-child")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <StatCard
        label="Sessions"
        value="9,832"
        unit="/day"
        note="+8%"
        trend="up"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
