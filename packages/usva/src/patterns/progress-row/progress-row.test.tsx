import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Badge } from "../../primitives/badge/badge.js";
import { ProgressRow } from "./progress-row.js";

describe("ProgressRow", () => {
  it("renders the label and the value over max", () => {
    render(
      <ProgressRow label="Computer Science" value={12} max={30} unit="cr" />,
    );
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();
    expect(screen.getByText(/cr/)).toBeInTheDocument();
  });

  it("exposes progressbar semantics", () => {
    render(<ProgressRow label="Mathematics" value={12} max={30} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "12");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "30");
    expect(bar).toHaveAttribute("aria-label", "Mathematics");
  });

  it("renders an empty bar when max is zero rather than dividing by zero", () => {
    render(<ProgressRow label="Unset" value={5} max={0} />);
    const fill = screen.getByTestId("progress-row-fill");
    expect(fill).toHaveStyle({ width: "0%" });
  });

  it("clamps overshoot to a full bar", () => {
    render(<ProgressRow label="Over" value={40} max={30} />);
    expect(screen.getByTestId("progress-row-fill")).toHaveStyle({
      width: "100%",
    });
  });

  it("clamps a negative value to an empty bar", () => {
    render(<ProgressRow label="Under" value={-5} max={30} />);
    expect(screen.getByTestId("progress-row-fill")).toHaveStyle({
      width: "0%",
    });
  });

  it("applies a categorical bar colour when given", () => {
    render(<ProgressRow label="CS" value={1} max={2} barColor="#8b5cf6" />);
    expect(screen.getByTestId("progress-row-fill")).toHaveStyle({
      backgroundColor: "#8b5cf6",
    });
  });

  it("renders a status slot", () => {
    render(
      <ProgressRow
        label="CS"
        value={30}
        max={30}
        status={<Badge tone="success">Complete</Badge>}
      />,
    );
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <ProgressRow
        label="Computer Science"
        value={12}
        max={30}
        unit="cr"
        status={<Badge tone="warning">In progress</Badge>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
