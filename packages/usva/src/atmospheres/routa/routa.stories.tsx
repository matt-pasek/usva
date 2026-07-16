import type { Meta, StoryObj } from "@storybook/react-vite";
import { Routa } from "./routa.js";

const meta: Meta<typeof Routa> = {
  title: "Atmospheres/Routa",
  component: Routa,
  tags: ["autodocs"],
  argTypes: {
    speed: { control: { type: "range", min: 0, max: 3, step: 0.1 } },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    mode: { control: "inline-radio", options: ["emissive", "absorptive"] },
  },
};
export default meta;

type Story = StoryObj<typeof Routa>;

export const Default: Story = {
  render: (args) => <Routa {...args} className="h-screen w-full bg-bg" />,
};
