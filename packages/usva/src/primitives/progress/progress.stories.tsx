import type { Meta, StoryObj } from "@storybook/react-vite";
import { themeModes } from "../../../.storybook/modes.js";
import { Progress } from "./progress.js";

const meta: Meta<typeof Progress> = {
  parameters: {
    chromatic: { modes: themeModes },
  },
  title: "Primitives/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    glow: { control: { type: "boolean" } },
    value: { control: { type: "number" } },
    max: { control: { type: "number" } },
  },
  args: { value: 60, max: 100, size: "md", glow: false },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {};
export const Glow: Story = { args: { value: 72, glow: true } };
export const Indeterminate: Story = { args: { value: undefined } };

export const Sizes: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-4">
      <Progress size="sm" value={40} />
      <Progress size="md" value={60} glow />
      <Progress size="lg" value={80} />
    </div>
  ),
};
