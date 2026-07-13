import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox.js";

const meta: Meta<typeof Checkbox> = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md"] },
    disabled: { control: { type: "boolean" } },
    defaultChecked: { control: { type: "boolean" } },
    indeterminate: { control: { type: "boolean" } },
  },
  args: { label: "Accept terms", size: "md", disabled: false },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithDescription: Story = {
  args: {
    description: "You agree to our terms of service and privacy policy.",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      {(["sm", "md"] as const).map((size) => (
        <Checkbox {...args} key={size} size={size} label={size} />
      ))}
    </div>
  ),
};
