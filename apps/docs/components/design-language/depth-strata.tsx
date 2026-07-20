"use client";

import { Button, SegmentedControl } from "@matt-pasek/usva";
import * as React from "react";
import { THEMES } from "@/lib/catalog";

const STRATA = [
  {
    role: "overlay",
    note: "a dialog, a popover. it floats clear of everything",
  },
  { role: "surface-2", note: "raised again: a row in a card, a hovered cell" },
  { role: "surface", note: "a card, a panel, lifted off the ground" },
  { role: "bg", note: "the ground. one per document" },
  { role: "sunken", note: "below the ground: wells, code, inset areas" },
];

export function DepthStrata() {
  const [theme, setTheme] = React.useState<string>(THEMES[0]);
  const [scrim, setScrim] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          aria-label="theme"
          value={theme}
          items={THEMES.map((t) => ({ value: t, label: t }))}
          onValueChange={setTheme}
        />
        <Button
          variant={scrim ? "onSurface" : "outline"}
          size="sm"
          onClick={() => setScrim((current) => !current)}
        >
          scrim {scrim ? "on" : "off"}
        </Button>
      </div>

      <div
        data-theme={theme}
        className="relative overflow-hidden rounded-lg border"
        style={{ borderColor: "var(--usva-border)" }}
      >
        {STRATA.map(({ role, note }) => (
          <div
            key={role}
            className="flex items-center justify-between gap-4 border-b px-5 py-6 last:border-b-0"
            style={{
              background: `var(--usva-${role})`,
              borderColor: "var(--usva-border)",
            }}
          >
            <code
              className="font-mono text-xs"
              style={{ color: "var(--usva-ink)" }}
            >
              {role}
            </code>
            <span
              className="text-right text-sm"
              style={{ color: "var(--usva-muted)" }}
            >
              {note}
            </span>
          </div>
        ))}

        {scrim ? (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            style={{ background: "var(--usva-scrim)" }}
          >
            <code
              className="rounded-full px-3 py-1 font-mono text-xs"
              style={{
                background: "var(--usva-overlay)",
                color: "var(--usva-ink)",
              }}
            >
              scrim
            </code>
          </div>
        ) : null}
      </div>
    </div>
  );
}
