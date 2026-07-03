import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./select.js";

const meta: Meta<typeof Select> = {
  title: "Primitives/Select",
  component: Select,
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Closed: Story = {
  render: () => (
    <Select>
      <Select.Trigger aria-label="Fruit" className="w-56">
        <Select.Value placeholder="Pick a fruit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="cherry">Cherry</Select.Item>
      </Select.Content>
    </Select>
  ),
};

export const Open: Story = {
  render: () => (
    <Select defaultOpen>
      <Select.Trigger aria-label="Fruit" className="w-56">
        <Select.Value placeholder="Pick a fruit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="cherry">Cherry</Select.Item>
      </Select.Content>
    </Select>
  ),
};

export const Selected: Story = {
  render: () => (
    <Select defaultValue="banana">
      <Select.Trigger aria-label="Fruit" className="w-56">
        <Select.Value placeholder="Pick a fruit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="cherry">Cherry</Select.Item>
      </Select.Content>
    </Select>
  ),
};

export const DisabledItem: Story = {
  render: () => (
    <Select defaultOpen>
      <Select.Trigger aria-label="Fruit" className="w-56">
        <Select.Value placeholder="Pick a fruit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana" disabled>
          Banana (out of stock)
        </Select.Item>
        <Select.Item value="cherry">Cherry</Select.Item>
      </Select.Content>
    </Select>
  ),
};

export const LongList: Story = {
  render: () => (
    <Select defaultOpen>
      <Select.Trigger aria-label="Fruit" className="w-56">
        <Select.Value placeholder="Pick a fruit" />
      </Select.Trigger>
      <Select.Content>
        {[
          "Apple",
          "Banana",
          "Cherry",
          "Date",
          "Elderberry",
          "Fig",
          "Grape",
          "Honeydew",
          "Kiwi",
          "Lemon",
          "Mango",
          "Nectarine",
          "Orange",
          "Papaya",
          "Quince",
        ].map((fruit) => (
          <Select.Item key={fruit} value={fruit.toLowerCase()}>
            {fruit}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  ),
};
