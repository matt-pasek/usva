import type { Meta, StoryObj } from "@storybook/react-vite";
import { SulaField } from "./sula-field.js";

const meta: Meta<typeof SulaField> = {
  title: "Sula/Field",
  component: SulaField,
};
export default meta;

type Story = StoryObj<typeof SulaField>;

export const Hero: Story = {
  render: () => (
    <SulaField className="grid min-h-96 place-items-center rounded-2xl bg-bg p-10">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-semibold text-ink">
          beauty that stays usable
        </h1>
        <p className="mt-3 text-muted">
          slow glass gathers at the edges and leaves the words clear.
        </p>
      </div>
    </SulaField>
  ),
};

export const Interactive: Story = {
  render: () => (
    <SulaField
      interactive
      className="grid min-h-96 place-items-center rounded-2xl bg-bg p-10"
    >
      <p className="text-muted">move the cursor and feel the veil answer</p>
    </SulaField>
  ),
};

export const Swift: Story = {
  render: () => (
    <SulaField speed={1.6} className="min-h-96 rounded-2xl bg-bg" />
  ),
};

export const Static: Story = {
  render: () => (
    <SulaField
      fluid={false}
      className="grid min-h-96 place-items-center rounded-2xl bg-bg p-10"
    >
      <p className="text-muted">fluid off: a plain surface</p>
    </SulaField>
  ),
};
