import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepList } from "./step-list.js";

const meta: Meta<typeof StepList> = {
  title: "Patterns/StepList",
  component: StepList,
  tags: ["autodocs"],
  args: {
    steps: [
      {
        title: "Sketch the flow",
        body: "Rough the screens and the path between them.",
      },
      {
        title: "Build the primitives",
        body: "Wire the tokens and the core components.",
      },
      { title: "Ship it", body: "Push to the registry and migrate the apps." },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof StepList>;

export const Default: Story = {
  render: () => (
    <StepList
      steps={[
        {
          title: "Sketch the flow",
          body: "Rough the screens and the path between them.",
        },
        {
          title: "Build the primitives",
          body: "Wire the tokens and the core components.",
        },
        {
          title: "Ship it",
          body: "Push to the registry and migrate the apps.",
        },
      ]}
    />
  ),
};
