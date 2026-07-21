"use client";
import {
  Button,
  PageHeader,
  PageHeaderMetric,
  PageHeaderStat,
  PageHeaderStats,
  Progress,
  ToggleChip,
  ToggleChipGroup,
} from "@matt-pasek/usva";
import { Check, Pencil } from "lucide-react";
import { useState } from "react";

const ALL_STATS = [
  ["grade-avg", "Grade avg.", "4.1", "4 graded"],
  ["active-courses", "Active courses", "4", "Enrolled"],
  ["credits-left", "Credits left", "104 cr", "To target"],
  ["study-right", "Study right", "2028", "Until 31 Jul"],
  ["deadlines", "Urgent deadlines", "2", "This week"],
] as const;

export function EditableDemo() {
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState<string[]>([
    "grade-avg",
    "active-courses",
    "credits-left",
  ]);
  const [panel, setPanel] = useState("trajectory");

  const visible = ALL_STATS.filter(([id]) => stats.includes(id));

  return (
    <PageHeader
      headingLevel="h2"
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
      action={
        <Button
          variant="outline"
          iconOnly
          aria-label={editing ? "Done editing" : "Edit header"}
          active={editing}
          onClick={() => setEditing((current) => !current)}
        >
          {editing ? (
            <Check aria-hidden="true" strokeWidth={1.8} className="size-4" />
          ) : (
            <Pencil aria-hidden="true" strokeWidth={1.8} className="size-4" />
          )}
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
            {ALL_STATS.map(([id, label]) => (
              <ToggleChip key={id} value={id}>
                {label}
              </ToggleChip>
            ))}
          </ToggleChipGroup>
          <ToggleChipGroup
            type="single"
            value={panel}
            onValueChange={setPanel}
            label="Panel view"
          >
            <ToggleChip value="ring">Progress ring</ToggleChip>
            <ToggleChip value="upcoming">Upcoming</ToggleChip>
            <ToggleChip value="trajectory">Credit trajectory</ToggleChip>
          </ToggleChipGroup>
        </>
      }
    >
      <PageHeaderStats>
        {visible.map(([id, label, value, sub], index) => (
          <PageHeaderStat
            key={id}
            variant={index === 0 ? "featured" : "plain"}
            tone={index === 0 ? "accent" : "default"}
            label={label}
            value={value}
            sub={sub}
          />
        ))}
      </PageHeaderStats>
    </PageHeader>
  );
}

export function MetricDemo() {
  return (
    <PageHeader
      headingLevel="h2"
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
  );
}

export function CompactDemo() {
  return (
    <PageHeader
      size="compact"
      headingLevel="h2"
      eyebrow="Open"
      title="Summer to Spring 2025-2026"
      meta={
        <>
          <span className="inline-flex items-center gap-2 font-semibold text-accent">
            <span className="size-1.5 rounded-full bg-accent" />
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
  );
}

export function BackgroundDemo() {
  return (
    <PageHeader
      headingLevel="h2"
      title="Bring your own"
      titleAccent="background."
      meta="A gradient, a canvas, a shader. Anything you can render."
      background={
        <div className="absolute inset-0 bg-[radial-gradient(120%_160%_at_0%_0%,var(--color-accent),transparent_55%)]" />
      }
      aside={<PageHeaderMetric value="1" caption="prop" />}
    />
  );
}
