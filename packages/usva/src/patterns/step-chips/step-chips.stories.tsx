import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepChips } from "./step-chips.js";

const meta: Meta<typeof StepChips> = {
  title: "Patterns/StepChips",
  component: StepChips,
  tags: ["autodocs"],
  args: {
    steps: ["Install the extension", "Sign in", "Done"],
    "aria-label": "Setup steps",
  },
};
export default meta;

type Story = StoryObj<typeof StepChips>;

export const Default: Story = {};

export const SingleStep: Story = {
  args: { steps: ["That is the whole setup"], "aria-label": "Setup steps" },
};
