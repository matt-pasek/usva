import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { ColorField } from "./color-field.js";

describe("ColorField", () => {
  it("renders a labelled hex input", () => {
    render(<ColorField label="Accent" defaultValue="#a78bfa" />);
    expect(screen.getByLabelText("Accent")).toHaveValue("#a78bfa");
  });

  it("names the hex input even with no visible label", async () => {
    const { container } = render(<ColorField defaultValue="#a78bfa" />);
    expect(screen.getByLabelText("Hex colour value")).toHaveValue("#a78bfa");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("lets a visible label name the hex input on its own", () => {
    render(<ColorField label="Accent" defaultValue="#a78bfa" />);
    expect(screen.getByLabelText("Accent")).toHaveAttribute("type", "text");
    expect(screen.queryByLabelText("Hex colour value")).toBeNull();
  });

  it("reports a valid hex as the user types it", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ColorField
        label="Accent"
        defaultValue="#000000"
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByLabelText("Accent");
    await user.clear(input);
    await user.type(input, "#52c989");

    expect(onValueChange).toHaveBeenLastCalledWith("#52c989");
  });

  it("does not report a malformed hex, and marks the field invalid", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ColorField
        label="Accent"
        defaultValue="#000000"
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByLabelText("Accent");
    await user.clear(input);
    await user.type(input, "#zzz");

    expect(onValueChange).not.toHaveBeenCalledWith("#zzz");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("supports a controlled value", () => {
    render(<ColorField label="Accent" value="#52c989" />);
    expect(screen.getByLabelText("Accent")).toHaveValue("#52c989");
  });

  it("supports disabled", () => {
    render(<ColorField label="Accent" defaultValue="#a78bfa" disabled />);
    expect(screen.getByLabelText("Accent")).toBeDisabled();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <ColorField label="Accent" defaultValue="#a78bfa" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
