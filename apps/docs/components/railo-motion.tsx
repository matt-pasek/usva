"use client";

import { cn } from "@matt-pasek/usva/cn";
import { useEffect, useId, useState } from "react";
import { Railo, type RailoProps } from "@/components/railo";
import { RAILO_BOX, RAILO_CUTS, RAILO_VIEW_BOX } from "@/lib/railo-geometry";

const SEEN_KEY = "usva:railo-revealed";

/**
 * The fields have to be masked rather than drawn while they move: a crescent is
 * only a crescent where the two circles overlap, so the subtraction has to be
 * redone every frame. The settled mark uses plain paths instead (see railo.tsx).
 */
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

  return (
    <svg
      aria-hidden="true"
      viewBox={RAILO_VIEW_BOX}
      className={cn("size-7 shrink-0", className)}
    >
      <mask id={`${id}-a`}>
        <rect width={RAILO_BOX} height={RAILO_BOX} fill="black" />
        {field("l", "white")}
        {field("r", "black")}
      </mask>
      <mask id={`${id}-b`}>
        <rect width={RAILO_BOX} height={RAILO_BOX} fill="black" />
        {field("r", "white")}
        {field("l", "black")}
      </mask>
      <rect
        width={RAILO_BOX}
        height={RAILO_BOX}
        fill={twoVoice ? "var(--usva-accent)" : "currentColor"}
        mask={`url(#${id}-a)`}
      />
      <rect
        width={RAILO_BOX}
        height={RAILO_BOX}
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
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      return;
    }
    setPlay(true);
  }, []);

  if (!play) return <Railo {...props} />;
  return <MaskedFields {...props} animation="reveal" />;
}

export { MaskedFields as RailoMasked };
