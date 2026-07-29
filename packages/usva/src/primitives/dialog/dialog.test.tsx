import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "./dialog.js";

describe("Dialog", () => {
  it("opens on trigger, moves focus into the dialog, closes on Escape", async () => {
    render(
      <Dialog>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Hi</Dialog.Title>
          <Dialog.Close>x</Dialog.Close>
        </Dialog.Content>
      </Dialog>,
    );
    const trigger = screen.getByText("Open");
    await userEvent.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    await waitFor(() =>
      expect(dialog.contains(document.activeElement)).toBe(true),
    );
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("fires onOpenChange with the boolean open state", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog onOpenChange={onOpenChange}>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Hi</Dialog.Title>
          <Dialog.Close>x</Dialog.Close>
        </Dialog.Content>
      </Dialog>,
    );
    await userEvent.click(screen.getByText("Open"));
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
  });

  it("closes when the close button is clicked", async () => {
    render(
      <Dialog>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Hi</Dialog.Title>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog>,
    );
    await userEvent.click(screen.getByText("Open"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Close"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("no a11y violations on the open dialog with a title", async () => {
    const { baseElement } = render(
      <Dialog defaultOpen>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Description>Manage your preferences.</Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(await axe(baseElement)).toHaveNoViolations();
  });

  it("no a11y violations on an open dialog labelled via aria-label (no title)", async () => {
    const { baseElement } = render(
      <Dialog defaultOpen>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content aria-label="Quick actions">
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
