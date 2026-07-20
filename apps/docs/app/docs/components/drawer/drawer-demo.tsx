"use client";
import {
  Button,
  Drawer,
  type DrawerSide,
  type DrawerSize,
} from "@matt-pasek/usva";
import { Playground } from "@/components/docs/playground";

const SIDES = ["top", "right", "bottom", "left"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const SURFACES = ["elevated", "flat", "glass"] as const;
const HIGHLIGHTS = ["none", "wash", "edge", "ring"] as const;

type Config = {
  side: DrawerSide;
  size: DrawerSize;
  surface: (typeof SURFACES)[number];
  highlight: (typeof HIGHLIGHTS)[number];
  title: string;
  description: string;
};

const base: Config = {
  side: "right",
  size: "md",
  surface: "elevated",
  highlight: "none",
  title: "Widget library",
  description: "Drag a widget onto the grid to add it.",
};

const templates: Record<string, Config> = {
  panel: base,
  "bottom sheet": {
    ...base,
    side: "bottom",
    size: "lg",
    title: "Rebuilding the degree planner",
    description:
      "The slide-up sheet is the same primitive anchored to another edge.",
  },
  glass: { ...base, surface: "glass", title: "Filters" },
  "left rail": { ...base, side: "left", size: "sm", title: "Settings" },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.side !== "right" && `side="${c.side}"`,
    c.size !== "md" && `size="${c.size}"`,
    c.surface !== "elevated" && `surface="${c.surface}"`,
    c.highlight !== "none" && `highlight="${c.highlight}"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `import { Drawer, Button } from "@matt-pasek/usva";

<Drawer>
  <Drawer.Trigger render={<Button>Open</Button>} />
  <Drawer.Content${attrs ? ` ${attrs}` : ""}>
    <Drawer.Title>${c.title}</Drawer.Title>
    <Drawer.Description>${c.description}</Drawer.Description>
    <Drawer.Close render={<Button variant="ghost">Done</Button>} />
  </Drawer.Content>
</Drawer>`;
};

export function DrawerDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "side",
          label: "side",
          sub: "which edge it pins to",
          options: SIDES,
        },
        {
          kind: "select",
          key: "size",
          label: "size",
          sub: "inline size, or block size on horizontal edges",
          options: SIZES,
        },
        {
          kind: "select",
          key: "surface",
          label: "surface",
          sub: "how the panel sits above the scrim",
          options: SURFACES,
        },
        {
          kind: "select",
          key: "highlight",
          label: "highlight",
          sub: "wash, inner edge, or glow ring",
          options: HIGHLIGHTS,
        },
        {
          kind: "text",
          key: "title",
          label: "title",
          sub: "the heading that names the dialog",
        },
        {
          kind: "text",
          key: "description",
          label: "description",
          sub: "supporting line under the title",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Drawer>
          <Drawer.Trigger render={<Button>Open drawer</Button>} />
          <Drawer.Content
            side={c.side}
            size={c.size}
            surface={c.surface}
            highlight={c.highlight}
          >
            <Drawer.Title>{c.title}</Drawer.Title>
            <Drawer.Description>{c.description}</Drawer.Description>
            <div className="flex-1" />
            <Drawer.Close render={<Button variant="ghost">Done</Button>} />
          </Drawer.Content>
        </Drawer>
      )}
    />
  );
}
