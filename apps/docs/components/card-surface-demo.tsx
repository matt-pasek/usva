"use client";
import { SegmentedControl } from "@usva-ui/react/patterns/segmented-control";
import {
  Card,
  CardBody,
  CardEyebrow,
  CardHeader,
  type CardSurface,
  CardTitle,
} from "@usva-ui/react/primitives/card";
import * as React from "react";

const options: { value: CardSurface; label: string }[] = [
  { value: "elevated", label: "elevated" },
  { value: "flat", label: "flat" },
  { value: "glass", label: "glass" },
  { value: "outline", label: "outline" },
];

const blurb: Record<CardSurface, string> = {
  elevated:
    "the default. lit-from-above fill, a rim light and a floating shadow.",
  flat: "a quiet surface with no lift. the dashboard workhorse.",
  glass:
    "translucent, and it blurs whatever sits behind it. it needs something worth blurring.",
  outline: "transparent, carried by its border alone.",
};

export function CardSurfaceDemo() {
  const [surface, setSurface] = React.useState<CardSurface>("elevated");

  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl
        size="sm"
        items={options}
        value={surface}
        onValueChange={(v) => setSurface(v as CardSurface)}
        aria-label="card surface"
      />
      {/* A patterned backdrop so glass and outline have something to sit against. */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface-2 p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(18rem_circle_at_20%_20%,var(--usva-accent),transparent_55%),radial-gradient(16rem_circle_at_85%_90%,var(--usva-accent-alt,var(--usva-accent)),transparent_55%)]"
        />
        <Card surface={surface} className="relative">
          <CardHeader>
            <CardEyebrow>surface = &quot;{surface}&quot;</CardEyebrow>
            <CardTitle>pick a surface</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-muted">{blurb[surface]}</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
