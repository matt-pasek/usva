"use client";

import { Vare } from "@usva-ui/react/atmospheres/vare";
import { StatCard } from "@usva-ui/react/patterns/stat-card";
import { StripeCard } from "@usva-ui/react/patterns/stripe-card";
import { Badge } from "@usva-ui/react/primitives/badge";
import { Button } from "@usva-ui/react/primitives/button";
import { Card } from "@usva-ui/react/primitives/card";
import { Knob } from "@usva-ui/react/primitives/knob";
import * as React from "react";
import { Cursor, useKnobCentre } from "@/components/hero/hero-pointer";
import {
  HERO_CARD,
  HERO_FOOT_WIDTH,
  HERO_PAD,
  HERO_PANEL,
  HERO_PANEL_PAD,
  HERO_ROW_COLUMN,
  HERO_ROWS,
  HERO_SIZE,
  HERO_SNIPPET,
  HERO_SNIPPET_LINES,
  HERO_SNIPPET_SIZE,
  HERO_STAT_COLUMN,
  HERO_STATS,
  HERO_TYPE,
  HERO_VARE_PARAMS,
} from "@/lib/hero";

function TypeColumn() {
  return (
    <>
      <div
        className="absolute"
        style={{
          left: HERO_PAD.left,
          top: HERO_PAD.top,
          width: HERO_TYPE.tagline.maxWidth,
        }}
      >
        <div
          className="font-mono text-accent"
          style={{
            fontSize: HERO_TYPE.eyebrow.size,
            letterSpacing: HERO_TYPE.eyebrow.tracking,
          }}
        >
          usva.build
        </div>
        <div
          className="mt-8 font-extrabold text-ink"
          style={{
            fontSize: HERO_TYPE.wordmark.size,
            letterSpacing: HERO_TYPE.wordmark.tracking,
            lineHeight: HERO_TYPE.wordmark.leading,
          }}
        >
          usva<span className="text-accent-alt">.</span>
        </div>
        <p
          className="mt-5 text-muted"
          style={{
            fontSize: HERO_TYPE.tagline.size,
            letterSpacing: HERO_TYPE.tagline.tracking,
            lineHeight: HERO_TYPE.tagline.leading,
          }}
        >
          a react design language, and the component library that speaks it.
        </p>
      </div>

      <div
        className="absolute flex items-center gap-4 whitespace-nowrap font-mono text-muted"
        style={{
          left: HERO_PAD.left,
          bottom: HERO_PAD.bottom,
          width: HERO_FOOT_WIDTH,
          fontSize: HERO_TYPE.foot.size - 2,
          letterSpacing: HERO_TYPE.foot.tracking,
        }}
      >
        <span>npm + registry</span>
        <span className="h-px flex-1 bg-border-strong" />
        <span>mit + commons clause</span>
      </div>
    </>
  );
}

function Panel() {
  return (
    <Card
      className="absolute flex flex-col rounded-3xl shadow-raised"
      style={{
        left: HERO_PANEL.x,
        top: HERO_PANEL.y,
        width: HERO_PANEL.width,
        height: HERO_PANEL.height,
        padding: HERO_PANEL_PAD,
      }}
    >
      <div className="flex items-center gap-3 px-1">
        <span className="font-mono text-[0.6875rem] font-semibold uppercase tracking-wide text-muted">
          catalog
        </span>
        <Badge mono live>
          live
        </Badge>
      </div>

      <div className="mt-4 flex gap-5">
        <div
          className="flex flex-col gap-1"
          style={{ width: HERO_STAT_COLUMN }}
        >
          {HERO_STATS.map((stat) => (
            <StatCard
              key={stat.label}
              size="sm"
              surface="flat"
              className="rounded-lg border-transparent bg-surface-2 [&>div]:p-2.5"
              label={stat.label}
              value={stat.value}
            />
          ))}
        </div>

        <div className="flex flex-col gap-4" style={{ width: HERO_ROW_COLUMN }}>
          {HERO_ROWS.map((row) => (
            <StripeCard
              key={row.heading}
              surface="flat"
              className="rounded-lg border-transparent bg-surface-2"
              heading={row.heading}
              metaLeft={row.metaLeft}
              badge={<Badge mono>{row.badge}</Badge>}
              stripeColor={row.stripe}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

function Snippet() {
  return (
    <Card
      className="absolute z-30 flex flex-col gap-2 px-6 py-6 font-mono shadow-floating"
      style={{
        left: HERO_SNIPPET.x,
        top: HERO_SNIPPET.y,
        width: HERO_SNIPPET.width,
        fontSize: HERO_SNIPPET_SIZE,
      }}
    >
      {HERO_SNIPPET_LINES.map((line) => (
        <div key={line} className="flex gap-3 whitespace-nowrap">
          <span className="text-accent-alt">$</span>
          <span className="text-muted">{line}</span>
        </div>
      ))}
    </Card>
  );
}

export function HeroStill() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const knobRef = React.useRef<HTMLDivElement>(null);
  const centre = useKnobCentre(rootRef, knobRef);

  return (
    <div
      ref={rootRef}
      data-hero=""
      className="relative overflow-hidden bg-bg"
      style={{ width: HERO_SIZE.width, height: HERO_SIZE.height }}
    >
      <Vare className="absolute inset-0" params={HERO_VARE_PARAMS}>
        <TypeColumn />
        <Panel />
        <Snippet />

        <Card
          className="absolute z-20 flex flex-col items-center gap-3 px-5 py-5 shadow-overlay"
          style={{
            left: HERO_CARD.x,
            top: HERO_CARD.y,
            width: HERO_CARD.width,
          }}
        >
          <Knob
            ref={knobRef}
            size="lg"
            defaultValue={62}
            label="intensity"
            showValue
          />
          <Button variant="solid" size="md" className="w-full">
            preview
          </Button>
        </Card>

        {centre ? <Cursor x={centre.x} y={centre.y} /> : null}
      </Vare>
    </div>
  );
}
