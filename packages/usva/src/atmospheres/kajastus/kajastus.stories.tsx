import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kajastus } from "./kajastus.js";

const meta: Meta<typeof Kajastus> = {
  title: "Atmospheres/Kajastus",
  component: Kajastus,
  tags: ["autodocs"],
  argTypes: {
    speed: { control: { type: "range", min: 0, max: 3, step: 0.1 } },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    mode: { control: "inline-radio", options: ["emissive", "absorptive"] },
  },
};
export default meta;

type Story = StoryObj<typeof Kajastus>;

export const Default: Story = {
  render: (args) => <Kajastus {...args} className="h-screen w-full bg-bg" />,
};
