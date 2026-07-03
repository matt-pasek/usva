import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionLabel } from "./section-label.js";

const meta: Meta<typeof SectionLabel> = {
  title: "Patterns/SectionLabel",
  component: SectionLabel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    index: "01",
    title: "Selected work",
  },
};

export default meta;
type Story = StoryObj<typeof SectionLabel>;

export const Default: Story = {};

export const WithoutIndex: Story = {
  args: { index: undefined, title: "About" },
};

export const WithAside: Story = {
  args: { index: "03", title: "Writing", aside: "12 posts" },
};
