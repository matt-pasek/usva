import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/index.js";
import { Drawer } from "./drawer.js";

const meta: Meta<typeof Drawer> = {
  title: "Primitives/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: { control: { type: "boolean" } },
    modal: { control: { type: "boolean" } },
  },
  args: {
    defaultOpen: true,
    modal: true,
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

const sizeLane: Record<string, string> = {
  sm: "left-[2%] w-[30%]",
  md: "left-[35%] w-[30%]",
  lg: "left-[68%] w-[30%]",
};

const surfaceLane: Record<string, string> = {
  elevated: "left-[1%] w-[23%]",
  flat: "left-[26%] w-[23%]",
  glass: "left-[51%] w-[23%]",
  outline: "left-[76%] w-[23%]",
};

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

export const Sides: Story = {
  render: () => (
    <div className="min-h-96">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Drawer key={side} defaultOpen modal={false}>
          <Drawer.Content side={side} size="sm" backdropClassName="hidden">
            <Drawer.Title>{side}</Drawer.Title>
            <Drawer.Description>
              Anchored to the {side} edge.
            </Drawer.Description>
          </Drawer.Content>
        </Drawer>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="min-h-96">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Drawer key={size} defaultOpen modal={false}>
          <Drawer.Content
            side="bottom"
            size={size}
            backdropClassName="hidden"
            className={sizeLane[size]}
          >
            <Drawer.Title>{size}</Drawer.Title>
            <Drawer.Description>
              Clamped to its size ceiling.
            </Drawer.Description>
            <div className="h-[80vh] shrink-0" />
          </Drawer.Content>
        </Drawer>
      ))}
    </div>
  ),
};

export const Surfaces: Story = {
  render: () => (
    <div className="min-h-96">
      {(["elevated", "flat", "glass", "outline"] as const).map((surface) => (
        <Drawer key={surface} defaultOpen modal={false}>
          <Drawer.Content
            side="bottom"
            size="sm"
            surface={surface}
            backdropClassName="hidden"
            className={surfaceLane[surface]}
          >
            <Drawer.Title>{surface}</Drawer.Title>
            <Drawer.Description>
              The panel skin above the scrim.
            </Drawer.Description>
          </Drawer.Content>
        </Drawer>
      ))}
    </div>
  ),
};
