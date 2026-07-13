import type { Meta, StoryObj } from "@storybook/react-vite";
import { FeatureCarousel } from "./feature-carousel.js";

const cards = [
  {
    title: "Owns your data",
    body: "Everything stays local, nothing phones home.",
  },
  {
    title: "Reads at a glance",
    body: "Dense dashboards that still breathe.",
  },
  {
    title: "Yours to fork",
    body: "Copy the source in, or install the package.",
  },
  {
    title: "Fast by default",
    body: "The 20ms most people skip, and everyone feels.",
  },
];

const meta: Meta<typeof FeatureCarousel> = {
  title: "Patterns/FeatureCarousel",
  component: FeatureCarousel,
  tags: ["autodocs"],
  args: { cards, autoAdvanceMs: 4600 },
};

export default meta;
type Story = StoryObj<typeof FeatureCarousel>;

export const Default: Story = {
  render: () => (
    <div className="max-w-xl">
      <FeatureCarousel
        cards={[
          {
            title: "Owns your data",
            body: "Everything stays local, nothing phones home.",
          },
          {
            title: "Reads at a glance",
            body: "Dense dashboards that still breathe.",
          },
          {
            title: "Yours to fork",
            body: "Copy the source in, or install the package.",
          },
          {
            title: "Fast by default",
            body: "The 20ms most people skip, and everyone feels.",
          },
        ]}
      />
    </div>
  ),
};
