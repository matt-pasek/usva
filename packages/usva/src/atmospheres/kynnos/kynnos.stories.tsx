import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kynnos } from "./kynnos.js";

const meta: Meta<typeof Kynnos> = {
  title: "Atmospheres/Kynnos",
  component: Kynnos,
  tags: ["autodocs"],
  argTypes: {
    speed: { control: { type: "range", min: 0, max: 3, step: 0.1 } },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    mode: { control: "inline-radio", options: ["emissive", "absorptive"] },
  },
};
export default meta;

type Story = StoryObj<typeof Kynnos>;

export const Default: Story = {
  render: (args) => <Kynnos {...args} className="h-screen w-full bg-bg" />,
};
