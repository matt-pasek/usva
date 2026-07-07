import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { SectionHeading } from "./section-heading.js";

describe("SectionHeading", () => {
  it("renders the eyebrow and the title", () => {
    render(<SectionHeading eyebrow="The problem" title="Unseen degrees" />);
    expect(screen.getByText("The problem")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Unseen degrees" }),
    ).toBeInTheDocument();
  });

  it("defaults the title to an h2", () => {
    render(<SectionHeading title="Unseen degrees" />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("retitles to the requested heading level", () => {
    render(<SectionHeading as="h1" title="Unseen degrees" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("omits the eyebrow when none is given", () => {
    const { container } = render(<SectionHeading title="Bare" />);
    expect(container.querySelector(".font-mono")).toBeNull();
  });

  it("tones the eyebrow", () => {
    render(
      <SectionHeading tone="accent-alt" eyebrow="Outcome" title="Shipped" />,
    );
    expect(screen.getByText("Outcome").className).toContain("text-accent-alt");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <SectionHeading eyebrow="The problem" title="Unseen degrees" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
