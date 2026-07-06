import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../primitives/badge/badge.js";
import { Panel } from "./panel.js";

const meta: Meta<typeof Panel> = {
  title: "Patterns/Panel",
  component: Panel,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Panel>;

export const Default: Story = {
  render: () => (
    <div className="h-72 w-96">
      <Panel
        eyebrow="overview"
        title="Deployments"
        badge={
          <Badge tone="accent-alt" live>
            live
          </Badge>
        }
      >
        <p className="text-sm text-muted">
          Panel fills its grid cell and scrolls its own body.
        </p>
      </Panel>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="h-72 w-96">
      <Panel eyebrow="loading" title="Fetching" loading>
        <p>hidden while loading</p>
      </Panel>
    </div>
  ),
};
