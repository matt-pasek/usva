import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./switch.js";

const meta: Meta<typeof Switch> = {
  title: "Primitives/Switch",
  component: Switch,
  args: { label: "Notifications" },
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
