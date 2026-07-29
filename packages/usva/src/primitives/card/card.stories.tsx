import type { Meta, StoryObj } from "@storybook/react-vite";
import { themeModes } from "../../../.storybook/modes.js";
import { Button } from "../button/button.js";
import {
  Card,
  CardActions,
  CardBadge,
  CardBody,
  CardEyebrow,
  CardFooter,
  CardHeader,
  CardIcon,
  CardTitle,
} from "./card.js";

const meta: Meta<typeof Card> = {
  parameters: {
    chromatic: { modes: themeModes },
  },
  title: "Primitives/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    highlight: {
      control: { type: "select" },
      options: ["none", "wash", "edge", "ring"],
    },
    surface: {
      control: { type: "select" },
      options: ["elevated", "flat", "glass", "outline"],
    },
    interactive: { control: { type: "boolean" } },
  },
  args: { highlight: "none", surface: "elevated", interactive: false },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <h3 className="text-sm font-semibold text-ink">Project usva.</h3>
        <p className="text-sm text-muted">
          Design language + component library.
        </p>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-muted">
          Tokens, primitives, and a shadcn-compatible registry, published from
          one source.
        </p>
      </CardBody>
      <CardFooter>
        <Button size="sm" variant="soft">
          Dismiss
        </Button>
        <Button size="sm">View docs</Button>
      </CardFooter>
    </Card>
  ),
};

export const HeaderAndBody: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <h3 className="text-sm font-semibold text-ink">Kajo theme</h3>
        <p className="text-sm text-muted">Aurora palette, faint glow.</p>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-muted">No footer actions on this card.</p>
      </CardBody>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card interactive className="w-80 cursor-pointer">
      <CardHeader>
        <h3 className="text-sm font-semibold text-ink">Hover me</h3>
        <p className="text-sm text-muted">Lifts on hover, rests floating.</p>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-muted">
          Pass <code>interactive</code> to make the card feel clickable.
        </p>
      </CardBody>
    </Card>
  ),
};

export const ComposedHeader: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader row>
        <CardIcon>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 4h12M2 8h12M2 12h8" />
          </svg>
        </CardIcon>
        <div className="flex flex-col gap-1">
          <CardEyebrow>Design system</CardEyebrow>
          <CardTitle>Component library</CardTitle>
        </div>
        <CardActions>
          <CardBadge tone="accent" mono>
            live
          </CardBadge>
        </CardActions>
      </CardHeader>
      <CardBody>
        <p className="text-sm text-muted">
          A row header composes an icon slot, an eyebrow + title stack, and a
          right-aligned action row.
        </p>
      </CardBody>
      <CardFooter>
        <Button size="sm" variant="soft">
          Docs
        </Button>
        <Button size="sm">Install</Button>
      </CardFooter>
    </Card>
  ),
};

export const BodyOnly: Story = {
  render: () => (
    <Card className="w-80">
      <CardBody>
        <p className="text-sm text-muted">
          A minimal card with only a body region.
        </p>
      </CardBody>
    </Card>
  ),
};

export const Surfaces: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["elevated", "flat", "glass", "outline"] as const).map((s) => (
        <Card key={s} surface={s} className="w-64">
          <CardHeader>
            <CardEyebrow>surface</CardEyebrow>
            <CardTitle>{s}</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-muted">
              {s === "elevated" && "Lit from above, rim light and shadow."}
              {s === "flat" && "Quiet surface fill, no lift."}
              {s === "glass" && "Translucent, blurs what sits behind it."}
              {s === "outline" && "Transparent, carried by its border alone."}
            </p>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

export const Highlights: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["none", "wash", "edge", "ring"] as const).map((h) => (
        <Card key={h} highlight={h} className="w-64">
          <CardHeader>
            <CardEyebrow>highlight</CardEyebrow>
            <CardTitle>{h}</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-muted">
              {h === "none" && "Plain floating surface."}
              {h === "wash" && "Radial accent atmosphere."}
              {h === "edge" && "Accent hairline on the top edge."}
              {h === "ring" && "Border reads as a glow ring."}
            </p>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};
