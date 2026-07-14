import type { Meta, StoryObj } from "@storybook/react-vite";
import { Vare } from "./vare.js";

const meta: Meta<typeof Vare> = {
  title: "Atmospheres/Vare",
  component: Vare,
  tags: ["autodocs"],
  argTypes: {
    speed: { control: { type: "range", min: 0, max: 3, step: 0.1 } },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    interactive: { control: "boolean" },
    mode: { control: "inline-radio", options: ["emissive", "absorptive"] },
  },
};
export default meta;

type Story = StoryObj<typeof Vare>;

export const Default: Story = {
  render: (args) => <Vare {...args} className="h-screen w-full bg-bg" />,
};
