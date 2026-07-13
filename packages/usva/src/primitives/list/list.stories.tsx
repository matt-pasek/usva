import type { Meta, StoryObj } from "@storybook/react-vite";
import { List, ListItem } from "./list.js";

const meta: Meta<typeof List> = {
  title: "Primitives/List",
  component: List,
  tags: ["autodocs"],
  argTypes: {
    as: {
      control: { type: "select" },
      options: ["ul", "ol"],
    },
    divided: { control: { type: "boolean" } },
  },
  args: {
    as: "ul",
    divided: false,
  },
};
export default meta;

type Story = StoryObj<typeof List>;

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export const Plain: Story = {
  render: () => (
    <List>
      <ListItem>Runs entirely on your machine</ListItem>
      <ListItem>No tracking, no analytics</ListItem>
      <ListItem>Open source, end to end</ListItem>
    </List>
  ),
};

export const WithMarker: Story = {
  render: () => (
    <List marker={<CheckIcon />}>
      <ListItem>Runs entirely on your machine</ListItem>
      <ListItem>No tracking, no analytics</ListItem>
      <ListItem>Open source, end to end</ListItem>
    </List>
  ),
};

export const Divided: Story = {
  render: () => (
    <List marker={<CheckIcon />} divided>
      <ListItem>Runs entirely on your machine</ListItem>
      <ListItem>No tracking, no analytics</ListItem>
      <ListItem>Open source, end to end</ListItem>
    </List>
  ),
};

export const Ordered: Story = {
  render: () => (
    <List as="ol" divided>
      <ListItem marker={<span className="font-mono text-xs">01</span>}>
        Install the extension
      </ListItem>
      <ListItem marker={<span className="font-mono text-xs">02</span>}>
        Sign in with your university account
      </ListItem>
    </List>
  ),
};
