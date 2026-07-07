"use client";
import { Button, Drawer, type DrawerSide } from "@matt-pasek/usva";

export function DrawerDemo({ side }: { side: DrawerSide }) {
  return (
    <Drawer>
      <Drawer.Trigger render={<Button variant="ghost">{side}</Button>} />
      <Drawer.Content side={side}>
        <Drawer.Title>Widget library</Drawer.Title>
        <Drawer.Description>
          Base UI owns the focus trap, the scroll lock and Escape. usva adds the
          edge anchoring and the slide.
        </Drawer.Description>
        <div className="flex-1" />
        <Drawer.Close render={<Button variant="ghost">Done</Button>} />
      </Drawer.Content>
    </Drawer>
  );
}

export function BottomSheetDemo() {
  return (
    <Drawer>
      <Drawer.Trigger render={<Button>Read the case study</Button>} />
      <Drawer.Content side="bottom" size="lg">
        <Drawer.Title>Rebuilding the degree planner</Drawer.Title>
        <Drawer.Description>
          The slide-up sheet is the same primitive anchored to another edge.
        </Drawer.Description>
        <div className="flex-1" />
        <Drawer.Close render={<Button variant="ghost">Close</Button>} />
      </Drawer.Content>
    </Drawer>
  );
}
