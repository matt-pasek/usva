import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { PageLoader, Spinner } from "./spinner.js";

describe("Spinner", () => {
  it("exposes a status role", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders a visually-hidden default label", () => {
    render(<Spinner />);
    expect(screen.getByText("Loading")).toHaveClass("sr-only");
  });

  it("uses a custom label", () => {
    render(<Spinner label="Saving" />);
    expect(screen.getByText("Saving")).toBeInTheDocument();
  });

  it("guards animation under prefers-reduced-motion", () => {
    const { container } = render(<Spinner />);
    const ring = container.querySelector("span > span");
    expect(ring).toHaveClass("animate-spin", "motion-reduce:animate-none");
  });

  it("applies size classes", () => {
    const { container } = render(<Spinner size="lg" />);
    expect(container.querySelector("span > span")).toHaveClass("h-8", "w-8");
  });

  it("no a11y violations", async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("PageLoader", () => {
  it("renders a visible, aria-hidden label alongside the spinner", () => {
    render(<PageLoader label="Loading data" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    const labels = screen.getAllByText("Loading data");
    expect(labels.some((el) => el.getAttribute("aria-hidden") === "true")).toBe(
      true,
    );
  });

  it("no a11y violations", async () => {
    const { container } = render(<PageLoader label="Loading" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
