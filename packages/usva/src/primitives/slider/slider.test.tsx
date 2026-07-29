import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "./slider.js";

describe("Slider", () => {
  it("renders an accessible slider with its label", () => {
    render(<Slider label="Speed" defaultValue={40} />);
    expect(screen.getByRole("slider", { name: "Speed" })).toBeInTheDocument();
  });

  it("shows the current value, formatted", () => {
    render(
      <Slider
        label="Speed"
        defaultValue={2}
        showValue
        formatValue={(v) => `${v}s`}
      />,
    );
    expect(screen.getByText("2s")).toBeInTheDocument();
  });

  it("moves by one step on arrow-right, so it is operable without a pointer", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Slider
        label="Speed"
        defaultValue={40}
        step={5}
        onValueChange={onValueChange}
      />,
    );

    await user.tab();
    await user.keyboard("{ArrowRight}");

    expect(onValueChange).toHaveBeenCalledWith(45, expect.anything());
  });

  it("does not respond to the keyboard when disabled", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Slider
        label="Speed"
        defaultValue={40}
        disabled
        onValueChange={onValueChange}
      />,
    );

    await user.tab();
    await user.keyboard("{ArrowRight}");

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("supports a controlled value", () => {
    render(<Slider label="Speed" value={70} showValue />);
    expect(screen.getByRole("slider", { name: "Speed" })).toHaveAttribute(
      "aria-valuenow",
      "70",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(<Slider label="Speed" defaultValue={40} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
