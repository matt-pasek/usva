import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { DropdownMenu } from "./dropdown-menu.js";

describe("DropdownMenu", () => {
  it("opens on trigger click, fires the arrow-navigated item's onSelect on Enter, and closes", async () => {
    const onSelectEdit = vi.fn();
    const onSelectDelete = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={onSelectEdit}>Edit</DropdownMenu.Item>
          <DropdownMenu.Item onSelect={onSelectDelete}>
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );

    await userEvent.click(screen.getByText("Open"));
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Enter}");

    expect(onSelectEdit).toHaveBeenCalledTimes(1);
    expect(onSelectDelete).not.toHaveBeenCalled();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("fires onOpenChange with the boolean open state as the first argument", async () => {
    const onOpenChange = vi.fn();
    render(
      <DropdownMenu onOpenChange={onOpenChange}>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Edit</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );
    await userEvent.click(screen.getByText("Open"));
    await screen.findByRole("menu");
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(true);
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
  });

  it("no a11y violations on the open menu", async () => {
    const { baseElement } = render(
      <DropdownMenu defaultOpen>
        <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Actions</DropdownMenu.Label>
          <DropdownMenu.Item>Edit</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item disabled>Delete</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>,
    );
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(
      await axe(baseElement, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
