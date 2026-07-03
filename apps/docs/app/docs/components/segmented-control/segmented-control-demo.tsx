"use client";
import { SegmentedControl } from "@matt-pasek/usva";
import { useState } from "react";

const views = [
  { value: "board", label: "Board" },
  { value: "list", label: "List" },
  { value: "calendar", label: "Calendar" },
];

const themes = [
  { value: "kajo", label: "kajo" },
  { value: "sisu", label: "sisu" },
];

export function SegmentedControlDemo() {
  const [view, setView] = useState("board");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SegmentedControl items={views} value={view} onValueChange={setView} />
        <p className="text-sm text-muted">
          Controlled value: <code>{view}</code>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <SegmentedControl items={themes} defaultValue="kajo" size="sm" />
        <SegmentedControl items={themes} defaultValue="sisu" size="md" />
      </div>
    </div>
  );
}
