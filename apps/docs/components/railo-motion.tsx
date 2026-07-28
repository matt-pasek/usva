"use client";

import { useId } from "react";
import { cn } from "usva/cn";
import { Railo, type RailoProps } from "@/components/railo";
import { RAILO_BOX, RAILO_CUTS, RAILO_VIEW_BOX } from "@/lib/railo-geometry";

/* A mask region defaults to a shade larger than the shape referencing it, which
 * slices the outer edge off a field while it is still swinging in. */
const ROOM = {
  x: -RAILO_BOX,
  y: -RAILO_BOX,
  width: RAILO_BOX * 3,
  height: RAILO_BOX * 3,
};

const REGION = { maskUnits: "userSpaceOnUse" as const, ...ROOM };

function MaskedFields({
  cut,
  tone,
  className,
  animation,
}: RailoProps & { animation: "reveal" | "drift" }) {
  const raw = useId();
  const id = raw.replace(/[^a-zA-Z0-9]/g, "");
  const { radius, left, right } = RAILO_CUTS[cut ?? "display"];
  const twoVoice = (tone ?? "two-voice") === "two-voice";

  const timing =
    animation === "reveal"
      ? "900ms var(--usva-ease-soft, cubic-bezier(.22,1,.36,1)) both"
      : "3200ms ease-in-out infinite";
  const move = (side: "l" | "r") => ({
    transformBox: "view-box" as const,
    transformOrigin: `${side === "l" ? left : right}px 50px`,
    animation: `railo-${animation === "reveal" ? "in" : "drift"}-${side} ${timing}`,
  });

  const field = (side: "l" | "r", paint: "white" | "black") => (
    <g style={move(side)}>
      <circle
        cx={side === "l" ? left : right}
        cy={RAILO_BOX / 2}
        r={radius}
        fill={paint}
      />
    </g>
  );

  /* The fields start a full 56 units outside the viewBox, and an svg viewport
   * clips its own overflow, so the reveal arrives sliced down one side. */
  return (
    <svg
      aria-hidden="true"
      viewBox={RAILO_VIEW_BOX}
      className={cn(
        "size-7 shrink-0",
        animation === "reveal" && "overflow-visible",
        className,
      )}
    >
      <mask id={`${id}-a`} {...REGION}>
        <rect {...ROOM} fill="black" />
        {field("l", "white")}
        {field("r", "black")}
      </mask>
      <mask id={`${id}-b`} {...REGION}>
        <rect {...ROOM} fill="black" />
        {field("r", "white")}
        {field("l", "black")}
      </mask>
      <rect
        {...ROOM}
        fill={twoVoice ? "var(--usva-accent)" : "currentColor"}
        mask={`url(#${id}-a)`}
      />
      <rect
        {...ROOM}
        fill={twoVoice ? "var(--usva-accent-alt)" : "currentColor"}
        opacity={twoVoice ? undefined : 0.55}
        mask={`url(#${id}-b)`}
      />
    </svg>
  );
}

export function RailoDrift(props: RailoProps) {
  return <MaskedFields {...props} animation="drift" />;
}

export function RailoBrand(props: RailoProps) {
  return <Railo {...props} />;
}

export { MaskedFields as RailoMasked };
