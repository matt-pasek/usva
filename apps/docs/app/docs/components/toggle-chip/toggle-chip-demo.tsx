"use client";
import { ToggleChip, ToggleChipGroup } from "@matt-pasek/usva";
import { useState } from "react";

const STATS = [
  ["grade-avg", "Grade avg."],
  ["active-courses", "Active courses"],
  ["credits-left", "Credits left"],
  ["study-right", "Study right"],
  ["urgent-deadlines", "Urgent deadlines"],
  ["completion", "Completion"],
] as const;

const PANELS = [
  ["progress-ring", "Progress ring"],
  ["upcoming", "Upcoming"],
  ["grade-trend", "Grade trend"],
  ["credit-trajectory", "Credit trajectory"],
] as const;

export function MultipleDemo() {
  const [value, setValue] = useState<string[]>([
    "grade-avg",
    "active-courses",
    "credits-left",
  ]);
  return (
    <ToggleChipGroup
      value={value}
      onValueChange={setValue}
      min={2}
      max={4}
      ariaLabel="Visible stats"
    >
      {STATS.map(([id, label]) => (
        <ToggleChip key={id} value={id}>
          {label}
        </ToggleChip>
      ))}
    </ToggleChipGroup>
  );
}

export function SingleDemo() {
  const [value, setValue] = useState("credit-trajectory");
  return (
    <ToggleChipGroup
      type="single"
      value={value}
      onValueChange={setValue}
      label="Panel view"
    >
      {PANELS.map(([id, label]) => (
        <ToggleChip key={id} value={id}>
          {label}
        </ToggleChip>
      ))}
    </ToggleChipGroup>
  );
}
