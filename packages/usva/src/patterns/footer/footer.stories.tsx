import type { Meta, StoryObj } from "@storybook/react-vite";
import { Footer } from "./footer.js";

const meta: Meta<typeof Footer> = {
  title: "Patterns/Footer",
  component: Footer,
};
export default meta;

type Story = StoryObj<typeof Footer>;

const columns = [
  {
    title: "Index",
    links: [
      { label: "About", href: "#about" },
      { label: "Work", href: "#work" },
      { label: "Currently", href: "#currently" },
    ],
  },
  {
    title: "Elsewhere",
    tone: "accent-alt" as const,
    links: [
      { label: "GitHub", href: "https://github.com/matt-pasek" },
      { label: "Email", href: "mailto:contact@matt-pasek.dev" },
    ],
  },
];

export const Full: Story = {
  args: {
    brand: <span className="text-2xl font-black tracking-tight">usva.</span>,
    tagline: "Designer by eye, dev by hand. Currently in Lahti.",
    columns,
    copyright: "© 2026 Mateusz Pasek. All rights reserved.",
    note: "quality > quantity",
  },
};

export const WithGlow: Story = {
  args: { ...Full.args, glow: true },
};

export const Compact: Story = {
  args: {
    variant: "compact",
    brand: <span className="text-lg font-bold">sisu+</span>,
    columns,
    copyright: "© 2026 Mateusz Pasek",
  },
};
