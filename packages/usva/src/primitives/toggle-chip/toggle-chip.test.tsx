import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import type * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { ToggleChip, ToggleChipGroup } from "./toggle-chip.js";

/** Flattened across both group modes so one harness can exercise either. */
type ChipsProps = {
  type?: "single" | "multiple";
  value?: string | string[];
  onValueChange?: ((value: string) => void) | ((value: string[]) => void);
  ariaLabel?: string;
  label?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  children?: React.ReactNode;
};

function Chips({ children, ...props }: ChipsProps) {
  const groupProps = {
    ariaLabel: "Stats",
    value: ["a"],
    ...props,
  } as React.ComponentProps<typeof ToggleChipGroup>;

  return (
    <ToggleChipGroup {...groupProps}>
      {children ?? (
        <>
          <ToggleChip value="a">Alpha</ToggleChip>
          <ToggleChip value="b">Beta</ToggleChip>
          <ToggleChip value="c">Gamma</ToggleChip>
        </>
      )}
    </ToggleChipGroup>
  );
}

describe("ToggleChipGroup", () => {
  it("marks the selected chips pressed", () => {
    render(<Chips value={["a", "c"]} />);
    expect(screen.getByRole("button", { name: "Alpha" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Beta" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("button", { name: "Gamma" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("adds and removes ids in multiple mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Chips value={["a"]} onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Beta" }));
    expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"]);

    await user.click(screen.getByRole("button", { name: "Alpha" }));
    expect(onValueChange).toHaveBeenLastCalledWith([]);
  });

  it("hands single mode a bare id, not an array", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Chips type="single" value="a" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Beta" }));
    expect(onValueChange).toHaveBeenLastCalledWith("b");
  });

  it("never deselects the last chip in single mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Chips type="single" value="a" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("button", { name: "Alpha" }));
    expect(onValueChange).toHaveBeenLastCalledWith("a");
  });

  it("locks selected chips at the minimum", () => {
    render(<Chips value={["a", "b"]} min={2} />);
    expect(screen.getByRole("button", { name: "Alpha" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Gamma" })).toBeEnabled();
  });

  it("locks unselected chips at the maximum", () => {
    render(<Chips value={["a", "b"]} max={2} />);
    expect(screen.getByRole("button", { name: "Gamma" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Alpha" })).toBeEnabled();
  });

  it("ignores min and max in single mode", () => {
    render(<Chips type="single" value="a" min={2} max={1} />);
    expect(screen.getByRole("button", { name: "Beta" })).toBeEnabled();
  });

  it("disables every chip when the group is disabled", () => {
    render(<Chips disabled />);
    for (const name of ["Alpha", "Beta", "Gamma"])
      expect(screen.getByRole("button", { name })).toBeDisabled();
  });

  it("lets a chip cancel the toggle from its own onClick", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Chips onValueChange={onValueChange}>
        <ToggleChip value="b" onClick={(event) => event.preventDefault()}>
          Beta
        </ToggleChip>
      </Chips>,
    );

    await user.click(screen.getByRole("button", { name: "Beta" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("names the group from its label when no ariaLabel is given", () => {
    render(<Chips ariaLabel={undefined} label="Panel view" />);
    expect(
      screen.getByRole("group", { name: "Panel view" }),
    ).toBeInTheDocument();
  });

  it("throws when a chip is rendered outside a group", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ToggleChip value="a">Alpha</ToggleChip>)).toThrow(
      /inside a ToggleChipGroup/,
    );
    spy.mockRestore();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<Chips label="Panel view" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
