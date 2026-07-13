import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./switch.js";

const meta: Meta<typeof Switch> = {
  title: "Primitives/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md"] },
    disabled: { control: { type: "boolean" } },
    defaultChecked: { control: { type: "boolean" } },
  },
  args: {
    label: "Notifications",
    size: "md",
    disabled: false,
    defaultChecked: false,
  },
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Off: Story = {};

export const On: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Medium: Story = {
  args: { size: "md" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      {(["sm", "md"] as const).map((size) => (
        <Switch key={size} size={size} defaultChecked label={size} />
      ))}
    </div>
  ),
};
