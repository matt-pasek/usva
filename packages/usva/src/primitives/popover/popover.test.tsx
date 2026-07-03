import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Popover } from "./popover.js";

describe("Popover", () => {
  it("opens positioned content on trigger click, closes on click-outside", async () => {
    render(
      <div>
        <Popover>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>Popover body</Popover.Content>
        </Popover>
        <button type="button">Outside</button>
      </div>,
    );
    expect(screen.queryByText("Popover body")).not.toBeInTheDocument();
    await userEvent.click(screen.getByText("Open"));
    expect(await screen.findByText("Popover body")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Outside"));
    expect(screen.queryByText("Popover body")).not.toBeInTheDocument();
  });

  it("fires onOpenChange with the boolean open state as the first argument", async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover onOpenChange={onOpenChange}>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>Popover body</Popover.Content>
      </Popover>,
    );
    await userEvent.click(screen.getByText("Open"));
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
  });

  it("no a11y violations on the open popover", async () => {
    const { container } = render(
      <Popover defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>
          <Popover.Title>Details</Popover.Title>
          <Popover.Description>More info here.</Popover.Description>
        </Popover.Content>
      </Popover>,
    );
    expect(await screen.findByText("Details")).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
