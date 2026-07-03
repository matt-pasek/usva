import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./segmented-control.js";

const items = [
  { value: "board", label: "Board" },
  { value: "list", label: "List" },
  { value: "timeline", label: "Timeline" },
];

describe("SegmentedControl", () => {
  it("renders a radiogroup with a radio per item and marks the active one", () => {
    render(<SegmentedControl items={items} defaultValue="list" />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "List" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("clicking a segment selects it and fires onValueChange", async () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        items={items}
        defaultValue="board"
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("radio", { name: "Timeline" }));
    expect(onValueChange).toHaveBeenCalledWith("timeline");
    expect(screen.getByRole("radio", { name: "Timeline" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("respects the controlled value prop", async () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        items={items}
        value="board"
        onValueChange={onValueChange}
      />,
    );
    await userEvent.click(screen.getByRole("radio", { name: "List" }));
    expect(onValueChange).toHaveBeenCalledWith("list");
    expect(screen.getByRole("radio", { name: "Board" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("uses roving tabindex so only the active segment is tabbable", () => {
    render(<SegmentedControl items={items} defaultValue="board" />);
    expect(screen.getByRole("radio", { name: "Board" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("radio", { name: "List" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("arrow keys move selection and wrap around", async () => {
    const onValueChange = vi.fn();
    render(
      <SegmentedControl
        items={items}
        defaultValue="board"
        onValueChange={onValueChange}
      />,
    );
    await userEvent.tab();
    expect(screen.getByRole("radio", { name: "Board" })).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "List" })).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("list");

    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("radio", { name: "Timeline" })).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("timeline");

    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("radio", { name: "Board" })).toHaveFocus();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <SegmentedControl
        items={items}
        defaultValue="board"
        aria-label="View mode"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
