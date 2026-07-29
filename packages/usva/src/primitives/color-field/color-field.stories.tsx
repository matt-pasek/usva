import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorField } from "./color-field.js";

const meta: Meta<typeof ColorField> = {
  title: "Primitives/ColorField",
  component: ColorField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "A swatch and a hex field. Use it to override a role token, not to set a raw hex on a component. A component that hardcodes a color cannot be rethemed, which is the whole point of the role tokens.",
      },
    },
  },
  argTypes: {
    label: { control: { type: "text" } },
    defaultValue: { control: { type: "text" } },
    swatchLabel: { control: { type: "text" } },
    disabled: { control: { type: "boolean" } },
  },
  args: {
    label: "Accent",
    defaultValue: "#a78bfa",
    disabled: false,
  },
};
export default meta;

type Story = StoryObj<typeof ColorField>;

export const Default: Story = {};

export const Invalid: Story = {
  args: { defaultValue: "#zzz" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(
        [
          ["default", { defaultValue: "#a78bfa" }],
          ["invalid", { defaultValue: "#zzz" }],
          ["disabled", { defaultValue: "#a78bfa", disabled: true }],
        ] as const
      ).map(([name, args]) => (
        <div key={name} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted">{name}</span>
          <ColorField label="Accent" {...args} />
        </div>
      ))}
    </div>
  ),
};
