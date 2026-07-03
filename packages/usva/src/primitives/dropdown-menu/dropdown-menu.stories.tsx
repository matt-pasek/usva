import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownMenu } from "./dropdown-menu.js";

const meta: Meta<typeof DropdownMenu> = {
  title: "Primitives/DropdownMenu",
  component: DropdownMenu,
};
export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Closed: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenu.Trigger className="rounded-md border border-border px-3 py-1.5 text-sm text-ink">
        Open menu
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Edit</DropdownMenu.Item>
        <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Item>Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const Open: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger className="rounded-md border border-border px-3 py-1.5 text-sm text-ink">
        Open menu
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Edit</DropdownMenu.Item>
        <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Item>Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const WithSeparator: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger className="rounded-md border border-border px-3 py-1.5 text-sm text-ink">
        Open menu
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Edit</DropdownMenu.Item>
        <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger className="rounded-md border border-border px-3 py-1.5 text-sm text-ink">
        Open menu
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Edit</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Duplicate (unavailable)</DropdownMenu.Item>
        <DropdownMenu.Item>Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const WithLabels: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <DropdownMenu.Trigger className="rounded-md border border-border px-3 py-1.5 text-sm text-ink">
        Open menu
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>Actions</DropdownMenu.Label>
        <DropdownMenu.Item>Edit</DropdownMenu.Item>
        <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Label>Danger zone</DropdownMenu.Label>
        <DropdownMenu.Item>Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};
