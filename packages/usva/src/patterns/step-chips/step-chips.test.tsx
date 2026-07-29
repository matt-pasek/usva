import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { StepChips } from "./step-chips.js";

const steps = ["Install it", "Sign in", "Done"];

describe("StepChips", () => {
  /** The order is the meaning, so it is an ordered list, not a labelled div. */
  it("renders an ordered list", () => {
    render(<StepChips steps={steps} />);
    expect(screen.getByRole("list").tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("numbers each step", () => {
    render(<StepChips steps={steps} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders each step label", () => {
    render(<StepChips steps={steps} />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  /** The arrow is a visual join. A screen reader gets the ordinal instead. */
  it("hides the separators from assistive tech", () => {
    const { container } = render(<StepChips steps={steps} />);
    const seps = container.querySelectorAll("[data-step-separator]");
    expect(seps).toHaveLength(2);
    for (const sep of seps) expect(sep).toHaveAttribute("aria-hidden", "true");
  });

  it("draws no separator after the last step", () => {
    const { container } = render(<StepChips steps={["Only one"]} />);
    expect(container.querySelector("[data-step-separator]")).toBeNull();
  });

  it("takes an accessible label for the sequence", () => {
    render(<StepChips steps={steps} aria-label="Setup steps" />);
    expect(screen.getByRole("list")).toHaveAccessibleName("Setup steps");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <StepChips steps={steps} aria-label="Setup steps" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
