import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/index.js";
import { Drawer } from "./drawer.js";

const meta: Meta<typeof Drawer> = {
  title: "Primitives/Drawer",
  component: Drawer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Right: Story = {
  render: () => (
    <Drawer>
      <Drawer.Trigger render={<Button>Edit layout</Button>} />
      <Drawer.Content side="right">
        <Drawer.Title>Widget library</Drawer.Title>
        <Drawer.Description>Drag a widget onto the grid.</Drawer.Description>
        <div className="mt-6 flex-1" />
        <Drawer.Close render={<Button variant="ghost">Done</Button>} />
      </Drawer.Content>
    </Drawer>
  ),
};

export const BottomSheet: Story = {
  render: () => (
    <Drawer>
      <Drawer.Trigger render={<Button>Read the case study</Button>} />
      <Drawer.Content side="bottom" size="lg">
        <Drawer.Title>Rebuilding the degree planner</Drawer.Title>
        <Drawer.Description>
          The slide-up sheet, which is the same primitive anchored to another
          edge.
        </Drawer.Description>
        <div className="mt-6 flex-1" />
        <Drawer.Close render={<Button variant="ghost">Close</Button>} />
      </Drawer.Content>
    </Drawer>
  ),
};
