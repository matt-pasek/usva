import type { Meta, StoryObj } from "@storybook/react-vite";
import { themeModes } from "../../../.storybook/modes.js";
import { Textarea } from "./textarea.js";

const meta: Meta<typeof Textarea> = {
  parameters: {
    chromatic: { modes: themeModes },
  },
  title: "Primitives/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    autoGrow: { control: { type: "boolean" } },
    minRows: { control: { type: "number" } },
    maxRows: { control: { type: "number" } },
    disabled: { control: { type: "boolean" } },
  },
  args: {
    placeholder: "Tell us about yourself…",
    autoGrow: false,
    minRows: 3,
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const AutoGrow: Story = {
  args: { autoGrow: true, minRows: 2, maxRows: 10 },
};

export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "Too short." },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Read only for now." },
};

export const States: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Textarea placeholder="Resting" rows={3} />
      <Textarea aria-invalid defaultValue="Enter at least 40 characters." />
      <Textarea disabled defaultValue="Disabled" />
    </div>
  ),
};
