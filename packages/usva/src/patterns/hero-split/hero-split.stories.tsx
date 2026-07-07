import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "../../primitives/avatar/avatar.js";
import { AvatarGroup } from "../../primitives/avatar/avatar-group.js";
import { Button } from "../../primitives/button/button.js";
import { HeroSplit } from "./hero-split.js";

const meta: Meta<typeof HeroSplit> = {
  title: "Patterns/HeroSplit",
  component: HeroSplit,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof HeroSplit>;

const visual = (
  <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-surface text-sm text-muted lg:w-[26rem]">
    product shot
  </div>
);

export const Default: Story = {
  args: {
    title: "Your whole degree,",
    titleAccent: "in one place.",
    body: "Four registries reconciled into one planner. Nothing to configure.",
    actions: (
      <>
        <Button>Add to Chrome</Button>
        <Button variant="onSurface">Source code</Button>
      </>
    ),
    visual,
  },
};

export const WithBadgeAndProof: Story = {
  args: {
    ...Default.args,
    badge: (
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-ink/[0.055] py-1 pr-3 pl-1 text-xs text-muted">
        <span className="rounded-full bg-accent-alt px-2 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-on-accent">
          New
        </span>
        Shipped v1.2
      </span>
    ),
    proof: (
      <AvatarGroup max={3} tone="accent" label="2,400 active users">
        <Avatar alt="Mateusz Pasek" />
        <Avatar alt="Anna Korhonen" />
        <Avatar alt="Jussi Laine" />
        <Avatar alt="Liisa Virtanen" />
      </AvatarGroup>
    ),
    note: "Desktop browsers only for now.",
  },
};

/** sisu paints a WebGL Plasma here. That one is provenance-locked, so it is a slot. */
export const WithBackground: Story = {
  args: {
    ...Default.args,
    background: (
      <div className="size-full bg-[radial-gradient(ellipse_at_30%_40%,var(--color-accent),transparent_60%)]" />
    ),
  },
};
