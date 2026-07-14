import type { Meta, StoryObj } from "@storybook/react-vite";
import { Hehku } from "./hehku.js";

const meta: Meta<typeof Hehku> = {
  title: "Atmospheres/Hehku",
  component: Hehku,
  tags: ["autodocs"],
  argTypes: {
    speed: { control: { type: "range", min: 0, max: 3, step: 0.1 } },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    mode: { control: "inline-radio", options: ["emissive", "absorptive"] },
  },
};
export default meta;

type Story = StoryObj<typeof Hehku>;

export const Default: Story = {
  render: (args) => <Hehku {...args} className="h-screen w-full bg-bg" />,
};
