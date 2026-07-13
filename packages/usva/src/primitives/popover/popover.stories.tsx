import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover } from "./popover.js";

const meta: Meta<typeof Popover> = {
  title: "Primitives/Popover",
  component: Popover,
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: { control: { type: "boolean" } },
    modal: { control: { type: "boolean" } },
  },
  args: { defaultOpen: true, modal: false },
};
export default meta;

type Story = StoryObj<typeof Popover>;

const triggerClassName =
  "rounded-md border border-border bg-surface px-4 py-2 text-sm text-ink";

export const Closed: Story = {
  render: () => (
    <Popover>
      <Popover.Trigger className={triggerClassName}>
        Open popover
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Details</Popover.Title>
        <Popover.Description>
          Non-modal, positioned content.
        </Popover.Description>
      </Popover.Content>
    </Popover>
  ),
};

export const OpenSideTop: Story = {
  render: () => (
    <Popover defaultOpen>
      <Popover.Trigger className={triggerClassName}>
        Open popover
      </Popover.Trigger>
      <Popover.Content side="top">
        <Popover.Title>Top</Popover.Title>
        <Popover.Description>Positioned above the trigger.</Popover.Description>
      </Popover.Content>
    </Popover>
  ),
};

export const OpenSideRight: Story = {
  render: () => (
    <Popover defaultOpen>
      <Popover.Trigger className={triggerClassName}>
        Open popover
      </Popover.Trigger>
      <Popover.Content side="right">
        <Popover.Title>Right</Popover.Title>
        <Popover.Description>
          Positioned to the right of the trigger.
        </Popover.Description>
      </Popover.Content>
    </Popover>
  ),
};

export const OpenSideBottom: Story = {
  render: () => (
    <Popover defaultOpen>
      <Popover.Trigger className={triggerClassName}>
        Open popover
      </Popover.Trigger>
      <Popover.Content side="bottom">
        <Popover.Title>Bottom</Popover.Title>
        <Popover.Description>Positioned below the trigger.</Popover.Description>
      </Popover.Content>
    </Popover>
  ),
};

export const OpenSideLeft: Story = {
  render: () => (
    <Popover defaultOpen>
      <Popover.Trigger className={triggerClassName}>
        Open popover
      </Popover.Trigger>
      <Popover.Content side="left">
        <Popover.Title>Left</Popover.Title>
        <Popover.Description>
          Positioned to the left of the trigger.
        </Popover.Description>
      </Popover.Content>
    </Popover>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-40 p-40">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Popover key={side} defaultOpen>
          <Popover.Trigger className={triggerClassName}>{side}</Popover.Trigger>
          <Popover.Content side={side}>
            <Popover.Title>{side}</Popover.Title>
            <Popover.Description>
              Positioned on the {side} side.
            </Popover.Description>
          </Popover.Content>
        </Popover>
      ))}
    </div>
  ),
};

export const WithArrow: Story = {
  render: () => (
    <Popover defaultOpen>
      <Popover.Trigger className={triggerClassName}>
        Open popover
      </Popover.Trigger>
      <Popover.Content side="bottom">
        <Popover.Arrow />
        <Popover.Title>With arrow</Popover.Title>
        <Popover.Description>
          The arrow points back at the trigger.
        </Popover.Description>
      </Popover.Content>
    </Popover>
  ),
};
