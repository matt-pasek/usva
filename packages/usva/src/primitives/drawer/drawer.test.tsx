import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Drawer } from "./drawer.js";

function Sample({ side }: { side?: "top" | "right" | "bottom" | "left" }) {
  return (
    <Drawer defaultOpen>
      <Drawer.Trigger>Open</Drawer.Trigger>
      <Drawer.Content side={side}>
        <Drawer.Title>Widget library</Drawer.Title>
        <Drawer.Description>Drag a widget onto the grid.</Drawer.Description>
        <Drawer.Close>Close</Drawer.Close>
      </Drawer.Content>
    </Drawer>
  );
}

describe("Drawer", () => {
  it("renders its content when open", () => {
    render(<Sample />);
    expect(screen.getByText("Widget library")).toBeInTheDocument();
    expect(
      screen.getByText("Drag a widget onto the grid."),
    ).toBeInTheDocument();
  });

  it("is a modal dialog with an accessible name", () => {
    render(<Sample />);
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Widget library");
  });

  it("defaults to the right edge", () => {
    render(<Sample />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "right");
  });

  it("anchors to the requested edge", () => {
    render(<Sample side="bottom" />);
    const panel = screen.getByRole("dialog");
    expect(panel).toHaveAttribute("data-side", "bottom");
    expect(panel.className).toContain("inset-x-0");
    expect(panel.className).toContain("bottom-0");
  });

  it("closes on the close button", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("has no a11y violations", async () => {
    const { baseElement } = render(<Sample />);
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
