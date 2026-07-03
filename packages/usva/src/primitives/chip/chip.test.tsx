import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Chip } from "./chip.js";

describe("Chip", () => {
  it("renders its label", () => {
    render(<Chip>React</Chip>);
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("renders a value when provided", () => {
    render(<Chip value="1,240">Credits</Chip>);
    expect(screen.getByText("1,240")).toHaveClass("tabular-nums");
  });

  it("applies tone classes", () => {
    render(<Chip tone="success">ok</Chip>);
    expect(screen.getByText("ok").parentElement?.className).toContain(
      "text-success",
    );
  });

  it("shows a dismiss button and fires onRemove", () => {
    const onRemove = vi.fn();
    render(<Chip onRemove={onRemove}>Tag</Chip>);
    const button = screen.getByRole("button", { name: "Remove" });
    fireEvent.click(button);
    expect(onRemove).toHaveBeenCalledOnce();
  });

  it("omits the dismiss button when no onRemove", () => {
    render(<Chip>Tag</Chip>);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <Chip tone="accent" value="9" onRemove={() => {}}>
        Runs
      </Chip>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
