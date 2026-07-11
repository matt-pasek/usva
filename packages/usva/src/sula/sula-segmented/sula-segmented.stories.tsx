import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SulaSegmented, type SulaSegmentedItem } from "./sula-segmented.js";

const meta: Meta<typeof SulaSegmented> = {
  title: "Sula/Segmented",
  component: SulaSegmented,
};
export default meta;

type Story = StoryObj<typeof SulaSegmented>;

const ITEMS: SulaSegmentedItem[] = [
  { value: "kajo", label: "Kajo" },
  { value: "sisu", label: "Sisu" },
  { value: "system", label: "System" },
];

function Demo({ fluid = true }: { fluid?: boolean }) {
  const [value, setValue] = useState("kajo");
  return (
    <div className="flex min-h-40 items-center justify-center bg-bg">
      <SulaSegmented
        fluid={fluid}
        items={ITEMS}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}

export const Default: Story = { render: () => <Demo /> };

export const NoFluid: Story = { render: () => <Demo fluid={false} /> };

export const FourSegments: Story = {
  render: () => {
    const [value, setValue] = useState("all");
    return (
      <div className="flex min-h-40 items-center justify-center bg-bg">
        <SulaSegmented
          items={[
            { value: "all", label: "All" },
            { value: "notes", label: "Notes" },
            { value: "work", label: "Work" },
            { value: "play", label: "Play" },
          ]}
          value={value}
          onValueChange={setValue}
        />
      </div>
    );
  },
};
