import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepChips } from "./step-chips.js";

const meta: Meta<typeof StepChips> = {
  title: "Patterns/StepChips",
  component: StepChips,
};
export default meta;

type Story = StoryObj<typeof StepChips>;

export const Default: Story = {
  args: {
    steps: ["Install the extension", "Sign in", "Done"],
    "aria-label": "Setup steps",
  },
};

export const SingleStep: Story = {
  args: { steps: ["That is the whole setup"], "aria-label": "Setup steps" },
};
