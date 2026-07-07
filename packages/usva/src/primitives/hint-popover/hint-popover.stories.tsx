import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../badge/index.js";
import { Button } from "../button/index.js";
import { HintPopover } from "./hint-popover.js";

const meta: Meta<typeof HintPopover> = {
  title: "Primitives/HintPopover",
  component: HintPopover,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HintPopover>;

export const Warning: Story = {
  render: () => (
    <div className="grid min-h-48 place-items-center">
      <HintPopover
        tone="warning"
        title="Prerequisite not met"
        trigger={
          <button type="button" className="min-h-11">
            <Badge tone="warning" mono>
              2 warnings
            </Badge>
          </button>
        }
        action={
          <Button size="sm" variant="ghost">
            Dismiss
          </Button>
        }
      >
        MATH-201 must be completed before MATH-305.
      </HintPopover>
    </div>
  ),
};

export const Plain: Story = {
  render: () => (
    <div className="grid min-h-48 place-items-center">
      <HintPopover
        tone="neutral"
        trigger={<Button variant="ghost">What counts as active?</Button>}
      >
        A student who has logged in during the last 30 days.
      </HintPopover>
    </div>
  ),
};
