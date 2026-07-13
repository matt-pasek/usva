import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ProgressRow } from "../progress-row/index.js";
import { DisclosureRow } from "./disclosure-row.js";

const meta: Meta<typeof DisclosureRow> = {
  title: "Patterns/DisclosureRow",
  component: DisclosureRow,
};
export default meta;

type Story = StoryObj<typeof DisclosureRow>;

const body = (
  <div className="flex flex-col gap-2 px-4 pb-4 text-sm text-muted">
    <p>Introduction to Software Engineering, 5 cr</p>
    <p>Data Structures and Algorithms, 5 cr</p>
    <p>Operating Systems, 5 cr</p>
  </div>
);

export const Default: Story = {
  args: {
    summary: "Core studies",
    aside: (
      <span className="font-mono text-sm tabular-nums">
        <span className="font-bold text-accent">45</span>
        <span className="text-muted"> / 60 cr</span>
      </span>
    ),
    children: body,
  },
};

export const WithRail: Story = {
  args: { ...Default.args, railColor: "#52c989" },
};

export const OpenByDefault: Story = {
  args: { ...Default.args, defaultOpen: true },
};

export const Disabled: Story = {
  args: { ...Default.args, disabled: true },
};

export const Accordion: Story = {
  render: () => {
    const [open, setOpen] = useState<string | null>("core");
    const sections = [
      ["core", "Core studies", "#52c989", 45, 60],
      ["minor", "Minor studies", "#7ea0ff", 20, 25],
      ["free", "Free-choice studies", "#a98cff", 11, 20],
    ] as const;

    return (
      <div className="flex flex-col gap-2">
        {sections.map(([id, title, color, done, total]) => (
          <DisclosureRow
            key={id}
            railColor={color}
            open={open === id}
            onOpenChange={(next) => setOpen(next ? id : null)}
            summary={
              <ProgressRow
                label={title}
                value={done}
                max={total}
                barColor={color}
              />
            }
          >
            {body}
          </DisclosureRow>
        ))}
      </div>
    );
  },
};
