import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../primitives/badge/badge.js";
import { Panel } from "./panel.js";

const meta: Meta<typeof Panel> = {
  title: "Patterns/Panel",
  component: Panel,
  tags: ["autodocs"],
  argTypes: {
    surface: {
      control: { type: "select" },
      options: ["elevated", "flat", "glass", "outline"],
    },
    loading: { control: { type: "boolean" } },
  },
  args: {
    eyebrow: "overview",
    title: "Deployments",
    surface: "elevated",
    loading: false,
    children: (
      <p className="text-sm text-muted">
        Panel fills its grid cell and scrolls its own body.
      </p>
    ),
  },
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

export const Surfaces: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      {(["elevated", "flat", "glass", "outline"] as const).map((surface) => (
        <div key={surface} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted">{surface}</span>
          <div className="h-56 w-80">
            <Panel surface={surface} eyebrow="overview" title="Deployments">
              <p className="text-sm text-muted">
                The panel body sits on the {surface} skin.
              </p>
            </Panel>
          </div>
        </div>
      ))}
    </div>
  ),
};
