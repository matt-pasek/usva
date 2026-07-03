import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../primitives/badge/index.js";
import { Button } from "../../primitives/button/index.js";
import { Toolbar, ToolbarActions, ToolbarGroup } from "./toolbar.js";

const meta: Meta<typeof Toolbar> = {
  title: "Patterns/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Toolbar>;

export const Default: Story = {
  render: () => (
    <Toolbar>
      <ToolbarGroup>
        <strong className="text-sm font-medium">Projects</strong>
        <Badge tone="accent">12</Badge>
      </ToolbarGroup>
      <ToolbarActions>
        <Button variant="ghost">Filter</Button>
        <Button>New</Button>
      </ToolbarActions>
    </Toolbar>
  ),
};

export const ChipList: Story = {
  render: () => (
    <Toolbar>
      <ToolbarGroup>
        <Badge tone="neutral">All</Badge>
        <Badge tone="accent">Active</Badge>
        <Badge tone="success">Shipped</Badge>
        <Badge tone="warning">Blocked</Badge>
      </ToolbarGroup>
      <ToolbarActions>
        <Button variant="ghost">Clear</Button>
      </ToolbarActions>
    </Toolbar>
  ),
};
