import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { SectionLabel } from "./section-label.js";

describe("SectionLabel", () => {
  it("renders the title as a heading", () => {
    render(<SectionLabel title="Selected work" />);
    expect(
      screen.getByRole("heading", { name: "Selected work" }),
    ).toBeInTheDocument();
  });

  it("renders the zero-padded index when provided", () => {
    render(<SectionLabel index="01" title="Work" />);
    expect(screen.getByText("01")).toBeInTheDocument();
  });

  it("renders an aside slot", () => {
    render(<SectionLabel title="Writing" aside="12 posts" />);
    expect(screen.getByText("12 posts")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <SectionLabel index="02" title="About" aside="2024" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
