import type { Meta, StoryObj } from "@storybook/react-vite";
import { noSnapshot } from "../../../.storybook/modes.js";
import { Kuulto } from "./kuulto.js";

const meta: Meta<typeof Kuulto> = {
  title: "Atmospheres/Kuulto",
  component: Kuulto,
  parameters: { chromatic: noSnapshot },
  tags: ["autodocs"],
  argTypes: {
    speed: { control: { type: "range", min: 0, max: 3, step: 0.1 } },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    interactive: { control: "boolean" },
    mode: { control: "inline-radio", options: ["emissive", "absorptive"] },
  },
};
export default meta;

type Story = StoryObj<typeof Kuulto>;

export const Default: Story = {
  render: (args) => <Kuulto {...args} className="h-screen w-full bg-bg" />,
};
