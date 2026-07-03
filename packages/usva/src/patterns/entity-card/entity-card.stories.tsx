import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../primitives/badge/badge.js";
import { Button } from "../../primitives/button/button.js";
import {
  EntityActions,
  EntityBody,
  EntityCard,
  EntityMedia,
  EntityMeta,
  EntityTitle,
} from "./entity-card.js";

const meta: Meta<typeof EntityCard> = {
  title: "Patterns/EntityCard",
  component: EntityCard,
};

export default meta;
type Story = StoryObj<typeof EntityCard>;

export const Project: Story = {
  render: () => (
    <EntityCard interactive className="w-80 cursor-pointer">
      <EntityMedia>
        <div className="h-full w-full bg-gradient-to-br from-accent/30 to-accent-2/20" />
      </EntityMedia>
      <EntityMeta>
        <Badge tone="accent" mono>
          featured
        </Badge>
        <Badge tone="neutral">Next.js</Badge>
        <Badge tone="neutral">Tailwind</Badge>
      </EntityMeta>
      <EntityTitle>usva. design language</EntityTitle>
      <EntityBody>
        A React design system published as an npm package and a
        shadcn-compatible registry from one source.
      </EntityBody>
      <EntityActions>
        <Button size="sm">View project</Button>
        <Button size="sm" variant="ghost">
          Source
        </Button>
      </EntityActions>
    </EntityCard>
  ),
};

export const Course: Story = {
  render: () => (
    <EntityCard className="w-80">
      <EntityMeta>
        <Badge tone="accent-alt" mono>
          course
        </Badge>
        <span className="text-xs tabular-nums text-faint">12 lessons</span>
      </EntityMeta>
      <EntityTitle>Building with design tokens</EntityTitle>
      <EntityBody>
        Learn to compose a themeable component library from a shared token
        vocabulary.
      </EntityBody>
      <EntityActions>
        <Button size="sm" variant="soft">
          Start learning
        </Button>
      </EntityActions>
    </EntityCard>
  ),
};
