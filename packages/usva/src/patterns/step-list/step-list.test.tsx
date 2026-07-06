import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { StepList } from "./step-list.js";

const steps = [
  { title: "Sketch", body: "Rough the flow." },
  { title: "Build", body: "Wire it up." },
  { title: "Ship", body: "Push it live." },
];

describe("StepList", () => {
  it("renders every step", () => {
    render(<StepList steps={steps} />);
    expect(screen.getByText("Sketch")).toBeInTheDocument();
    expect(screen.getByText("Build")).toBeInTheDocument();
    expect(screen.getByText("Ship")).toBeInTheDocument();
  });

  it("renders as an ordered list", () => {
    const { container } = render(<StepList steps={steps} />);
    expect(container.querySelector("ol")).not.toBeNull();
    expect(container.querySelectorAll("li")).toHaveLength(3);
  });

  it("numbers the steps", () => {
    render(<StepList steps={steps} />);
    expect(screen.getAllByText("01").length).toBeGreaterThan(0);
  });

  it("has no a11y violations", async () => {
    const { container } = render(<StepList steps={steps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
