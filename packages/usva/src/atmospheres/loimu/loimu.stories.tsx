import type { Meta, StoryObj } from "@storybook/react-vite";
import { noSnapshot } from "../../../.storybook/modes.js";
import { Loimu } from "./loimu.js";

const meta: Meta<typeof Loimu> = {
  title: "Atmospheres/Loimu",
  component: Loimu,
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

type Story = StoryObj<typeof Loimu>;

export const Default: Story = {
  render: (args) => <Loimu {...args} className="h-screen w-full bg-bg" />,
};
