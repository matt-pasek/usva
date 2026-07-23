import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "../../primitives/button/index.js";
import { Progress } from "../../primitives/progress/index.js";
import {
  ToggleChip,
  ToggleChipGroup,
} from "../../primitives/toggle-chip/index.js";
import {
  PageHeader,
  PageHeaderMetric,
  PageHeaderStat,
  PageHeaderStats,
} from "./page-header.js";

const meta: Meta<typeof PageHeader> = {
  title: "Patterns/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["default", "compact"],
    },
    headingLevel: {
      control: { type: "select" },
      options: ["h1", "h2", "h3"],
    },
    controlsOpen: { control: { type: "boolean" } },
  },
  args: {
    eyebrow: "Lut University · Summer 2026",
    title: "Good afternoon,",
    titleAccent: "Mateusz.",
    size: "default",
    headingLevel: "h1",
    controlsOpen: false,
  },
};
export default meta;

type Story = StoryObj<typeof PageHeader>;

const Dot = () => (
  <span className="size-1.5 rounded-full bg-accent shadow-[0_0_9px_var(--color-accent)]" />
);

const PencilIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
    aria-hidden="true"
  >
    <path d="m14.5 5 4.5 4.5M4 20l4.2-1 10.1-10.1a3.2 3.2 0 0 0-4.5-4.5L3.7 14.5 3 20h1Z" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
    aria-hidden="true"
  >
    <path d="M5 12.5 9.5 17 19 7" />
  </svg>
);

export const Dashboard: Story = {
  render: () => (
    <PageHeader
      eyebrow={
        <>
          <span className="text-accent">Lut University</span>
          <span aria-hidden="true">·</span>
          <span>Summer 2026</span>
        </>
      }
      title="Good afternoon,"
      titleAccent="Mateusz."
      aside={<PageHeaderMetric value="42%" caption="Credit trajectory" />}
    >
      <PageHeaderStats>
        <PageHeaderStat
          variant="featured"
          tone="accent"
          label="Grade avg."
          value="4.1"
          sub="4 graded"
        />
        <PageHeaderStat label="Active courses" value="4" sub="Enrolled" />
        <PageHeaderStat label="Credits left" value="104 cr" sub="To target" />
      </PageHeaderStats>
    </PageHeader>
  ),
};

export const Editable: Story = {
  render: () => {
    const [editing, setEditing] = useState(true);
    const [stats, setStats] = useState(["grade-avg", "active", "credits-left"]);
    const [panel, setPanel] = useState("trajectory");

    return (
      <PageHeader
        eyebrow="Lut University · Summer 2026"
        title="Good afternoon,"
        titleAccent="Mateusz."
        aside={<PageHeaderMetric value="42%" caption="Credit trajectory" />}
        action={
          <Button
            variant="outline"
            iconOnly
            aria-label={editing ? "Done editing" : "Edit header"}
            active={editing}
            onClick={() => setEditing((current) => !current)}
          >
            {editing ? <CheckIcon /> : <PencilIcon />}
          </Button>
        }
        controlsOpen={editing}
        controls={
          <>
            <ToggleChipGroup
              value={stats}
              onValueChange={setStats}
              min={2}
              max={4}
              ariaLabel="Visible stats"
            >
              <ToggleChip value="grade-avg">Grade avg.</ToggleChip>
              <ToggleChip value="active">Active courses</ToggleChip>
              <ToggleChip value="credits-left">Credits left</ToggleChip>
              <ToggleChip value="study-right">Study right</ToggleChip>
              <ToggleChip value="deadlines">Urgent deadlines</ToggleChip>
            </ToggleChipGroup>
            <ToggleChipGroup
              type="single"
              value={panel}
              onValueChange={setPanel}
              label="Panel view"
            >
              <ToggleChip value="ring">Progress ring</ToggleChip>
              <ToggleChip value="upcoming">Upcoming</ToggleChip>
              <ToggleChip value="trend">Grade trend</ToggleChip>
              <ToggleChip value="trajectory">Credit trajectory</ToggleChip>
            </ToggleChipGroup>
          </>
        }
      >
        <PageHeaderStats>
          <PageHeaderStat
            variant="featured"
            tone="accent"
            label="Grade avg."
            value="4.1"
            sub="4 graded"
          />
          <PageHeaderStat label="Active courses" value="4" sub="Enrolled" />
          <PageHeaderStat label="Credits left" value="104 cr" sub="To target" />
        </PageHeaderStats>
      </PageHeader>
    );
  },
};

export const WithMetricAndProgress: Story = {
  render: () => (
    <PageHeader
      eyebrow="Primary · 2024 curriculum"
      title="Software and Systems Engineering"
      meta="2024 to 2028 · modified on 3 Jul 2026"
      aside={
        <PageHeaderMetric
          value={76}
          total={193}
          caption="credits earned · 39% of curriculum"
        />
      }
      progress={<Progress value={39} aria-label="Curriculum progress" />}
      footer={
        <>
          <span>104 cr to the degree minimum</span>
          <span aria-hidden="true">·</span>
          <span>
            Study right until{" "}
            <b className="font-mono font-semibold text-ink">31 Jul 2028</b>
          </span>
        </>
      }
    />
  ),
};

export const CompactWithPanels: Story = {
  render: () => (
    <PageHeader
      size="compact"
      headingLevel="h2"
      eyebrow="Open"
      title="Summer - Spring 2025 to 2026"
      meta={
        <>
          <span className="inline-flex items-center gap-2 font-semibold text-accent">
            <Dot />
            Open
          </span>
          <span>1 Jun 2025 to 31 May 2026</span>
        </>
      }
      aside={
        <PageHeaderStats>
          <PageHeaderStat
            variant="panel"
            label="Course registration"
            value="3"
          />
          <PageHeaderStat variant="panel" label="Exam registration" value="0" />
          <PageHeaderStat
            variant="panel"
            tone="accent"
            label="Processed"
            value="3"
          />
        </PageHeaderStats>
      }
    />
  ),
};

export const WithBackground: Story = {
  render: () => (
    <PageHeader
      title="Bring your own"
      titleAccent="background."
      meta="A gradient, a canvas, a shader. Anything."
      background={
        <div className="absolute inset-0 bg-[radial-gradient(120%_160%_at_0%_0%,var(--color-accent),transparent_55%)]" />
      }
      aside={<PageHeaderMetric value="1" caption="prop" />}
    />
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(["default", "compact"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted">{size}</span>
          <PageHeader
            size={size}
            eyebrow="Lut University · Summer 2026"
            title="Good afternoon,"
            titleAccent="Mateusz."
            meta="2024 to 2028 · modified on 3 Jul 2026"
            aside={<PageHeaderMetric value="42%" caption="Credit trajectory" />}
          />
        </div>
      ))}
    </div>
  ),
};

export const StatTones: Story = {
  render: () => (
    <PageHeaderStats>
      {(["default", "accent", "warning", "danger"] as const).map((tone) => (
        <PageHeaderStat
          key={tone}
          variant="featured"
          tone={tone}
          label={tone}
          value="4.1"
          sub="4 graded"
        />
      ))}
    </PageHeaderStats>
  ),
};

export const StatVariants: Story = {
  render: () => (
    <PageHeaderStats>
      {(["plain", "featured", "panel"] as const).map((variant) => (
        <PageHeaderStat
          key={variant}
          variant={variant}
          tone="accent"
          label={variant}
          value="4.1"
          sub="4 graded"
        />
      ))}
    </PageHeaderStats>
  ),
};
