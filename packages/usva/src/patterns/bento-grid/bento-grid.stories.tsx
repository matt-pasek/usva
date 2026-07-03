import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CardBody,
  CardEyebrow,
  CardHeader,
  CardTitle,
} from "../../primitives/card/card.js";
import { BentoCard, BentoGrid } from "./bento-grid.js";

const meta: Meta<typeof BentoGrid> = {
  title: "Patterns/BentoGrid",
  component: BentoGrid,
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
