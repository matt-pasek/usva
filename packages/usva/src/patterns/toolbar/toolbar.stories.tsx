import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../primitives/badge/index.js";
import { Button } from "../../primitives/button/index.js";
import {
  Toolbar,
  ToolbarActions,
  ToolbarCount,
  ToolbarGroup,
  ToolbarLegend,
  ToolbarLegendItem,
} from "./toolbar.js";

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

export const LegendAndCounts: Story = {
  render: () => (
    <Toolbar>
      <ToolbarLegend max={3}>
        <ToolbarLegendItem swatch="#8b5cf6">Computer Science</ToolbarLegendItem>
        <ToolbarLegendItem swatch="#52c989">Mathematics</ToolbarLegendItem>
        <ToolbarLegendItem swatch="#e0b341">Physics</ToolbarLegendItem>
        <ToolbarLegendItem swatch="#6ea8fe">Linguistics</ToolbarLegendItem>
        <ToolbarLegendItem swatch="#e0556b">Philosophy</ToolbarLegendItem>
      </ToolbarLegend>
      <ToolbarActions>
        <ToolbarCount count={3}>unsaved</ToolbarCount>
        <ToolbarCount tone="warning" count={1}>
          issue
        </ToolbarCount>
        <Button>Confirm</Button>
      </ToolbarActions>
    </Toolbar>
  ),
};
