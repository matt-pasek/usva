import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../primitives/button/button.js";
import { Chip } from "../../primitives/chip/chip.js";
import { CtaBanner } from "./cta-banner.js";

const meta: Meta<typeof CtaBanner> = {
  title: "Patterns/CtaBanner",
  component: CtaBanner,
  tags: ["autodocs"],
  argTypes: {
    headingLevel: {
      control: { type: "select" },
      options: ["h2", "h3", "h4"],
    },
  },
  args: {
    title: "Have something in mind?",
    body: "Design engineering for teams that sweat the details. A short call is the fastest way to start.",
  },
};
export default meta;

type Story = StoryObj<typeof CtaBanner>;

export const Default: Story = {
  args: {
    title: "Have something in mind?",
    body: "Design engineering for teams that sweat the details. A short call is the fastest way to start.",
    action: <Button>Start a project</Button>,
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Ready when you are.",
    action: <Button>Get in touch</Button>,
  },
};

export const WithProofRow: Story = {
  args: {
    ...Default.args,
    footerLabel: "Recent work",
    footer: (
      <>
        <Chip>Fintech</Chip>
        <Chip>Health</Chip>
        <Chip>Developer tools</Chip>
      </>
    ),
  },
};
