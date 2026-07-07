import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "../../primitives/chip/chip.js";
import { CaseStudyHero } from "./case-study-hero.js";

const meta: Meta<typeof CaseStudyHero> = {
  title: "Patterns/CaseStudyHero",
  component: CaseStudyHero,
};
export default meta;

type Story = StoryObj<typeof CaseStudyHero>;

const metaPairs = [
  { label: "Role", value: "Design engineer" },
  { label: "Timeline", value: "6 weeks" },
  { label: "Surface", value: "Web, extension" },
  { label: "Users", value: "2,400" },
];

export const Default: Story = {
  args: {
    eyebrow: "Case study",
    kicker: "Acme University · 2026",
    headline: "Students could not see",
    headlineAccent: "their whole degree.",
    tagline:
      "Four registries, one planner. Reconciling the systems nobody wanted to own.",
    link: { href: "https://example.com", label: "Visit site", external: true },
    meta: metaPairs,
  },
};

/** The accent color is categorical: it keys to the study, not to a meaning. */
export const CustomAccentColor: Story = {
  args: {
    ...Default.args,
    accentColor: "#f2b8ff",
  },
};

export const WithTagsAndMedia: Story = {
  args: {
    ...Default.args,
    tags: (
      <>
        <Chip>React</Chip>
        <Chip>Tailwind</Chip>
        <Chip>Base UI</Chip>
      </>
    ),
    children: (
      <div className="flex aspect-video items-center justify-center rounded-2xl bg-surface text-sm text-muted">
        media slot
      </div>
    ),
  },
};

export const HeadlineOnly: Story = {
  args: { headline: "A hero with nothing but a headline." },
};
