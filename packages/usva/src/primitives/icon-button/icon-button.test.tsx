import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { IconButton } from "./icon-button.js";

const Dot = () => (
  <svg viewBox="0 0 4 4" aria-hidden="true">
    <circle cx="2" cy="2" r="2" />
  </svg>
);

describe("IconButton", () => {
  it("renders an accessible icon-only button", () => {
    render(
      <IconButton aria-label="Settings">
        <Dot />
      </IconButton>,
    );
    expect(
      screen.getByRole("button", { name: "Settings" }),
    ).toBeInTheDocument();
  });

  it("fires onClick", () => {
    const onClick = vi.fn();
    render(
      <IconButton aria-label="Add" onClick={onClick}>
        <Dot />
      </IconButton>,
    );
    screen.getByRole("button", { name: "Add" }).click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders a tooltip linked via aria-describedby", () => {
    render(
      <IconButton aria-label="Filter" tooltip="Filter results">
        <Dot />
      </IconButton>,
    );
    const button = screen.getByRole("button", { name: "Filter" });
    const tip = screen.getByRole("tooltip");
    expect(tip).toHaveTextContent("Filter results");
    expect(button).toHaveAttribute("aria-describedby", tip.id);
  });

  it("marks the active state", () => {
    render(
      <IconButton aria-label="Grid" active>
        <Dot />
      </IconButton>,
    );
    expect(screen.getByRole("button", { name: "Grid" })).toHaveClass(
      "glow-ring",
    );
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <IconButton aria-label="Search" tooltip="Search">
        <Dot />
      </IconButton>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
