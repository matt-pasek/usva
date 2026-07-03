import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox.js";

describe("Checkbox", () => {
  it("toggles and fires onCheckedChange", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Accept" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Accept" }));
    expect(onCheckedChange.mock.calls[0]?.[0]).toBe(true);
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <Checkbox label="Accept" description="terms" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("supports uncontrolled defaultChecked", () => {
    render(<Checkbox label="Accept" defaultChecked />);
    expect(screen.getByRole("checkbox", { name: "Accept" })).toBeChecked();
  });

  it("supports controlled checked", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        label="Accept"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );
    const el = screen.getByRole("checkbox", { name: "Accept" });
    expect(el).not.toBeChecked();
    await userEvent.click(el);
    expect(onCheckedChange.mock.calls[0]?.[0]).toBe(true);
    expect(el).not.toBeChecked();
  });

  it("reflects indeterminate state", () => {
    render(<Checkbox label="Accept" indeterminate />);
    expect(screen.getByRole("checkbox", { name: "Accept" })).toHaveAttribute(
      "data-indeterminate",
    );
  });

  it("supports disabled", () => {
    render(<Checkbox label="Accept" disabled />);
    expect(screen.getByRole("checkbox", { name: "Accept" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("renders description text", () => {
    render(<Checkbox label="Accept" description="terms and conditions" />);
    expect(screen.getByText("terms and conditions")).toBeInTheDocument();
  });
});
