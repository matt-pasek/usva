"use client";

import { Vare } from "@matt-pasek/usva/atmospheres/vare";
import { StatCard } from "@matt-pasek/usva/patterns/stat-card";
import { StripeCard } from "@matt-pasek/usva/patterns/stripe-card";
import { Badge } from "@matt-pasek/usva/primitives/badge";
import { Button } from "@matt-pasek/usva/primitives/button";
import { Card } from "@matt-pasek/usva/primitives/card";
import { Knob } from "@matt-pasek/usva/primitives/knob";
import * as React from "react";
import {
  HERO_CARD,
  HERO_CLUSTER,
  HERO_PAD,
  HERO_ROWS,
  HERO_SIZE,
  HERO_STATS,
  HERO_TYPE,
  HERO_VARE_PARAMS,
} from "@/lib/hero";

declare global {
  interface Window {
    __heroPointer?: { x: number; y: number };
  }
}

function useKnobCentre(
  rootRef: React.RefObject<HTMLDivElement | null>,
  knobRef: React.RefObject<HTMLDivElement | null>,
) {
  const [centre, setCentre] = React.useState<{ x: number; y: number } | null>(
    null,
  );

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    const control = knobRef.current?.querySelector('[role="slider"]');
    if (!root || !control) return;
    const box = control.getBoundingClientRect();
    const frame = root.getBoundingClientRect();
    const next = {
      x: box.left - frame.left + box.width / 2,
      y: box.top - frame.top + box.height / 2,
    };
    setCentre(next);
    window.__heroPointer = next;
  }, [rootRef, knobRef]);

  return centre;
}

const Cursor = ({ x, y }: { x: number; y: number }) => (
  <svg
    aria-hidden="true"
    width="30"
    height="30"
    viewBox="0 0 28 28"
    className="pointer-events-none absolute z-30"
    style={{ left: x, top: y }}
  >
    <title>pointer</title>
    <path
      d="M2 1.5 L2 20.5 L7.1 15.6 L10.6 23.5 L13.9 22 L10.5 14.3 L17.4 14.3 Z"
      fill="var(--usva-ink)"
      stroke="var(--usva-bg)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

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
        className="absolute flex items-center gap-4 font-mono text-faint"
        style={{
          left: HERO_PAD.left,
          bottom: HERO_PAD.bottom,
          width: HERO_CARD.x - HERO_PAD.left - 16,
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

/**
 * The cluster runs off the right edge on purpose: a frame whose edges are dead
 * reads as a square someone stretched. Flat on, never tilted, because a
 * perspective-tilted glass card is the design-system tell this image refutes.
 */
function Cluster() {
  return (
    <Card
      className="absolute flex flex-col gap-3 p-5"
      style={{
        left: HERO_CLUSTER.x,
        top: HERO_CLUSTER.y,
        width: HERO_CLUSTER.width,
      }}
    >
      {/* Left-grouped, not justify-between: the panel's right edge is off
          canvas, and a badge pinned to it would never be seen. */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-[0.6875rem] font-semibold uppercase tracking-wide text-faint">
          catalog
        </span>
        <Badge mono live>
          live
        </Badge>
      </div>

      <div className="flex gap-3">
        {HERO_STATS.map((stat) => (
          <StatCard
            key={stat.label}
            className="flex-1"
            surface="flat"
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>

      {HERO_ROWS.map((row) => (
        <StripeCard
          key={row.heading}
          surface="flat"
          heading={row.heading}
          metaLeft={row.metaLeft}
          metaRight={row.metaRight}
          stripeColor={row.stripe}
          className="px-6 py-3"
        />
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
        <Cluster />

        <Card
          className="absolute z-20 flex flex-col items-center gap-4 px-5 py-6 shadow-overlay"
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
