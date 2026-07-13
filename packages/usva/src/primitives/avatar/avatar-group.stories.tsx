import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar.js";
import { AvatarGroup } from "./avatar-group.js";

const meta: Meta<typeof AvatarGroup> = {
  title: "Primitives/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    tone: {
      control: { type: "select" },
      options: ["solid", "accent", "neutral"],
    },
    max: { control: { type: "number" } },
  },
  args: { max: 4, size: "md", tone: "neutral", label: "+128 students" },
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

const members = [
  { alt: "Ada", fallback: "MP" },
  { alt: "Blaise", fallback: "AK" },
  { alt: "Curie", fallback: "JL" },
  { alt: "Dijkstra", fallback: "RS" },
  { alt: "Euler", fallback: "TN" },
  { alt: "Fermat", fallback: "OK" },
];

export const Default: Story = {
  render: () => (
    <AvatarGroup max={4} label="+128 students">
      <Avatar alt="Ada" fallback="MP" />
      <Avatar alt="Blaise" fallback="AK" />
      <Avatar alt="Curie" fallback="JL" />
      <Avatar alt="Dijkstra" fallback="RS" />
      <Avatar alt="Euler" fallback="TN" />
      <Avatar alt="Fermat" fallback="OK" />
    </AvatarGroup>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-8">
      {(["sm", "md", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <AvatarGroup {...args} size={size}>
            {members.map((m) => (
              <Avatar
                key={m.alt}
                alt={m.alt}
                fallback={m.fallback}
                size={size}
              />
            ))}
          </AvatarGroup>
          <span className="text-xs text-muted">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-8">
      {(["solid", "accent", "neutral"] as const).map((tone) => (
        <div key={tone} className="flex flex-col gap-2">
          <AvatarGroup {...args} tone={tone}>
            {members.map((m) => (
              <Avatar key={m.alt} alt={m.alt} fallback={m.fallback} />
            ))}
          </AvatarGroup>
          <span className="text-xs text-muted">{tone}</span>
        </div>
      ))}
    </div>
  ),
};
