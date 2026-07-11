import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { SulaFab, type SulaFabAction } from "./sula-fab.js";

const meta: Meta<typeof SulaFab> = {
  title: "Sula/Fab",
  component: SulaFab,
};
export default meta;

type Story = StoryObj<typeof SulaFab>;

function Glyph({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const ACTIONS: SulaFabAction[] = [
  { icon: <Glyph d="M12 5v14M5 12h14" />, label: "New note" },
  { icon: <Glyph d="M4 7h16M4 12h16M4 17h10" />, label: "New list" },
  {
    icon: (
      <Glyph d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    ),
    label: "Message",
  },
];

function Stage({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-72 items-end justify-center bg-bg p-10">
      {children}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <Stage>
      <SulaFab actions={ACTIONS} label="Create" />
    </Stage>
  ),
};

export const Arc: Story = {
  render: () => (
    <Stage>
      <SulaFab actions={ACTIONS} layout="arc" label="Create" />
    </Stage>
  ),
};

export const NoFluid: Story = {
  render: () => (
    <Stage>
      <SulaFab actions={ACTIONS} fluid={false} label="Create" />
    </Stage>
  ),
};

export const DirectionRight: Story = {
  render: () => (
    <div className="flex min-h-72 items-center justify-start bg-bg p-10">
      <SulaFab actions={ACTIONS} direction="right" label="Create" />
    </div>
  ),
};
