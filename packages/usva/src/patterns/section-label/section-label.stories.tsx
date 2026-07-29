import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionLabel } from "./section-label.js";

const meta: Meta<typeof SectionLabel> = {
  title: "Patterns/SectionLabel",
  component: SectionLabel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    tone: {
      control: { type: "select" },
      options: ["accent", "accent-alt"],
    },
  },
  args: {
    index: "01",
    title: "Selected work",
    tone: "accent",
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

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["accent", "accent-alt"] as const).map((tone, i) => (
        <SectionLabel
          key={tone}
          tone={tone}
          index={`0${i + 1}`}
          title={tone}
          aside="tone"
        />
      ))}
    </div>
  ),
};
