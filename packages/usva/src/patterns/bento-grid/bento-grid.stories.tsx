import type { Meta, StoryObj } from "@storybook/react-vite";
import { themeAndWidthModes } from "../../../.storybook/modes.js";
import {
  CardBody,
  CardEyebrow,
  CardHeader,
  CardTitle,
} from "../../primitives/card/card.js";
import { BentoCard, BentoGrid, BentoMetric } from "./bento-grid.js";

const meta: Meta<typeof BentoGrid> = {
  parameters: {
    chromatic: { modes: themeAndWidthModes },
  },
  title: "Patterns/BentoGrid",
  component: BentoGrid,
  tags: ["autodocs"],
  argTypes: {
    columns: { control: { type: "number" } },
  },
  args: {
    columns: 4,
  },
};

export default meta;
type Story = StoryObj<typeof BentoGrid>;

function Cell({ index, title }: { index: string; title: string }) {
  return (
    <>
      <CardHeader>
        <CardEyebrow>{index}</CardEyebrow>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-muted">
          Cells share one wash across the grid, each keeping its own rim light.
        </p>
      </CardBody>
    </>
  );
}

export const Default: Story = {
  render: () => (
    <BentoGrid columns={4} className="max-w-3xl">
      <BentoCard span={2} rowSpan={2} highlight="edge">
        <Cell index="01" title="Feature tile" />
      </BentoCard>
      <BentoCard span={2}>
        <Cell index="02" title="Wide tile" />
      </BentoCard>
      <BentoCard>
        <Cell index="03" title="Unit" />
      </BentoCard>
      <BentoCard highlight="ring">
        <Cell index="04" title="Selected" />
      </BentoCard>
      <BentoCard span={2}>
        <Cell index="05" title="Wide tile" />
      </BentoCard>
    </BentoGrid>
  ),
};

export const Responsive: Story = {
  render: () => (
    <BentoGrid className="max-w-3xl">
      {["01", "02", "03", "04", "05", "06"].map((i) => (
        <BentoCard key={i}>
          <Cell index={i} title="Auto fit" />
        </BentoCard>
      ))}
    </BentoGrid>
  ),
};

export const Highlights: Story = {
  render: () => (
    <BentoGrid columns={4} className="max-w-3xl">
      {(["none", "wash", "edge", "ring"] as const).map((highlight) => (
        <BentoCard key={highlight} highlight={highlight}>
          <Cell index="highlight" title={highlight} />
        </BentoCard>
      ))}
    </BentoGrid>
  ),
};

export const Sizes: Story = {
  render: () => (
    <BentoGrid columns={4} className="max-w-3xl">
      {(["md", "lg"] as const).map((size) => (
        <BentoCard key={size} span={2}>
          <BentoMetric
            value="128"
            suffix="k"
            label={`size ${size}`}
            size={size}
          />
        </BentoCard>
      ))}
    </BentoGrid>
  ),
};
