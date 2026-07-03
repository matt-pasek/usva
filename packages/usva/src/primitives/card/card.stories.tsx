import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.js";
import { Card, CardBody, CardFooter, CardHeader } from "./card.js";

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card,
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
