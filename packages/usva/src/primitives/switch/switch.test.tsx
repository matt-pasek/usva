import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./switch.js";

describe("Switch", () => {
  it("toggles and fires onCheckedChange", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Notifications" onCheckedChange={onCheckedChange} />);
    await userEvent.click(
      screen.getByRole("switch", { name: "Notifications" }),
    );
    expect(onCheckedChange.mock.calls[0]?.[0]).toBe(true);
  });

  it("toggles via keyboard space", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Notifications" onCheckedChange={onCheckedChange} />);
    const el = screen.getByRole("switch", { name: "Notifications" });
    await userEvent.tab();
    expect(el).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(onCheckedChange.mock.calls[0]?.[0]).toBe(true);
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <Switch label="Notifications" description="Enable push notifications" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("supports uncontrolled defaultChecked", () => {
    render(<Switch label="Notifications" defaultChecked />);
    expect(
      screen.getByRole("switch", { name: "Notifications" }),
    ).toHaveAttribute("data-checked");
  });

  it("supports controlled checked", async () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch
        label="Notifications"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );
    const el = screen.getByRole("switch", { name: "Notifications" });
    expect(el).toHaveAttribute("data-unchecked");
    await userEvent.click(el);
    expect(onCheckedChange.mock.calls[0]?.[0]).toBe(true);
    expect(el).toHaveAttribute("data-unchecked");
  });

  it("supports disabled", () => {
    render(<Switch label="Notifications" disabled />);
    expect(
      screen.getByRole("switch", { name: "Notifications" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("renders description text", () => {
    render(
      <Switch label="Notifications" description="Enable push notifications" />,
    );
    expect(screen.getByText("Enable push notifications")).toBeInTheDocument();
  });
});
