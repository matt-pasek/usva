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
    title: "Add it to Chrome",
    body: "Nothing to configure. Sign in once and the planner fills itself in.",
  },
};
export default meta;

type Story = StoryObj<typeof CtaBanner>;

export const Default: Story = {
  args: {
    title: "Add it to Chrome",
    body: "Nothing to configure. Sign in once and the planner fills itself in.",
    action: <Button>Add to Chrome</Button>,
  },
};

export const WithSteps: Story = {
  args: {
    ...Default.args,
    steps: ["Install the extension", "Sign in", "Done"],
    stepsLabel: "Setup steps",
  },
};

export const WithProofRow: Story = {
  args: {
    ...WithSteps.args,
    footerLabel: "Confirmed at",
    footer: (
      <>
        <Chip>Aalto</Chip>
        <Chip>Helsinki</Chip>
        <Chip>TUNI</Chip>
      </>
    ),
  },
};
