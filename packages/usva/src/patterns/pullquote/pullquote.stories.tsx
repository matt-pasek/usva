import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pullquote } from "./pullquote.js";

const meta: Meta<typeof Pullquote> = {
  title: "Patterns/Pullquote",
  component: Pullquote,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Pullquote>;

export const Default: Story = {
  args: {
    children: "Beauty that stays usable.",
    attribution: "usva, design principles",
  },
};

export const Unattributed: Story = {
  args: { children: "A quote that speaks for itself." },
};

export const WithOrnament: Story = {
  render: () => (
    <Pullquote
      attribution="usva, design principles"
      ornament={
        <div className="size-full rounded-full bg-accent-tint [filter:drop-shadow(var(--usva-glow-accent))]" />
      }
    >
      Beauty that stays usable.
    </Pullquote>
  ),
};
