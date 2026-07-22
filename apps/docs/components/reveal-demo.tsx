"use client";
import {
  Button,
  Card,
  CardBody,
  Reveal,
  type RevealVariant,
} from "@matt-pasek/usva";
import * as React from "react";

const items: { v: RevealVariant; fits: string }[] = [
  { v: "cast", fits: "headings · titles · eyebrows" },
  { v: "veil", fits: "prose · sections · footers (default)" },
  { v: "surface", fits: "cards · panels · CTAs · hero" },
  { v: "focus", fits: "images · media frames" },
  { v: "tick", fits: "stats · tables (grouped)" },
  { v: "lean", fits: "quotes · asides · callouts" },
];

export function RevealDemo() {
  const [run, setRun] = React.useState(0);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button size="sm" variant="soft" onClick={() => setRun((n) => n + 1)}>
          replay
        </Button>
        <span className="text-xs text-muted">
          each reveal is assigned by content role, not position.
        </span>
      </div>
      <div key={run} className="grid gap-3 sm:grid-cols-2">
        {items.map(({ v, fits }, i) => (
          <Reveal key={v} variant={v} delay={i * 0.09} force>
            <Card>
              <CardBody>
                <div className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                  {v}
                </div>
                <div className="mt-1.5 text-sm text-muted">{fits}</div>
              </CardBody>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
