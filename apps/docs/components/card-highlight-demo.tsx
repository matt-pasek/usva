"use client";
import {
  Card,
  CardBody,
  CardEyebrow,
  CardHeader,
  type CardHighlight,
  CardTitle,
  SegmentedControl,
} from "@matt-pasek/usva";
import * as React from "react";

const options: { value: CardHighlight; label: string }[] = [
  { value: "none", label: "none" },
  { value: "wash", label: "wash" },
  { value: "edge", label: "edge" },
  { value: "ring", label: "ring" },
];

const blurb: Record<CardHighlight, string> = {
  none: "the default surface. rim light and floating shadow, no accent.",
  wash: "a radial accent wash bleeds atmosphere across the surface.",
  edge: "a single accent hairline lights the top edge.",
  ring: "the accent glow ring hugs the whole border. reads as selected.",
};

export function CardHighlightDemo() {
  const [highlight, setHighlight] = React.useState<CardHighlight>("wash");

  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl
        size="sm"
        items={options}
        value={highlight}
        onValueChange={(v) => setHighlight(v as CardHighlight)}
        aria-label="card highlight"
      />
      <Card highlight={highlight}>
        <CardHeader>
          <CardEyebrow>highlight = &quot;{highlight}&quot;</CardEyebrow>
          <CardTitle>pick a highlight</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="text-sm text-muted">{blurb[highlight]}</p>
        </CardBody>
      </Card>
    </div>
  );
}
