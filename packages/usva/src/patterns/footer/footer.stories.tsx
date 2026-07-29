import type { Meta, StoryObj } from "@storybook/react-vite";
import { themeAndWidthModes } from "../../../.storybook/modes.js";
import { Footer } from "./footer.js";

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

const meta: Meta<typeof Footer> = {
  parameters: {
    chromatic: { modes: themeAndWidthModes },
  },
  title: "Patterns/Footer",
  component: Footer,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["full", "compact"],
    },
    glow: { control: { type: "boolean" } },
  },
  args: {
    brand: <span className="text-2xl font-black tracking-tight">usva.</span>,
    columns,
    variant: "full",
    glow: false,
  },
};
export default meta;

type Story = StoryObj<typeof Footer>;

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

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["full", "compact"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="px-6 font-mono text-xs text-muted">{variant}</span>
          <Footer
            variant={variant}
            brand={<span className="text-lg font-bold">usva.</span>}
            tagline="Designer by eye, dev by hand."
            columns={columns}
            copyright="© 2026 Mateusz Pasek"
          />
        </div>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["accent", "accent-alt"] as const).map((tone) => (
        <div key={tone} className="flex flex-col gap-2">
          <span className="px-6 font-mono text-xs text-muted">{tone}</span>
          <Footer
            brand={<span className="text-lg font-bold">usva.</span>}
            columns={[
              {
                title: "Elsewhere",
                tone,
                links: [
                  { label: "GitHub", href: "https://github.com/matt-pasek" },
                  { label: "Email", href: "mailto:contact@matt-pasek.dev" },
                ],
              },
            ]}
          />
        </div>
      ))}
    </div>
  ),
};
