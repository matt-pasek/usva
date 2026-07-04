"use client";
import {
  Card,
  CardBody,
  CardEyebrow,
  CardHeader,
  type CardSurface,
  CardTitle,
  SegmentedControl,
} from "@matt-pasek/usva";
import * as React from "react";

const options: { value: CardSurface; label: string }[] = [
  { value: "elevated", label: "Elevated" },
  { value: "flat", label: "Flat" },
  { value: "glass", label: "Glass" },
  { value: "outline", label: "Outline" },
];

const blurb: Record<CardSurface, string> = {
  elevated:
    "The default — lit-from-above fill, rim light, and a floating shadow.",
  flat: "A quiet surface with no lift. The dashboard workhorse.",
  glass: "Translucent, blurring whatever sits behind it. Use it purposefully.",
  outline: "Transparent, carried by its border alone.",
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
        aria-label="Card surface"
      />
      {/* A patterned backdrop so glass + outline read honestly against something. */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-surface-2 p-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(18rem_circle_at_20%_20%,var(--usva-accent),transparent_55%),radial-gradient(16rem_circle_at_85%_90%,var(--usva-accent-alt,var(--usva-accent)),transparent_55%)]"
        />
        <Card surface={surface} className="relative">
          <CardHeader>
            <CardEyebrow>surface = &quot;{surface}&quot;</CardEyebrow>
            <CardTitle>Pick a surface</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-muted">{blurb[surface]}</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
