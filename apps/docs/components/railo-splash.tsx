"use client";

import { type CSSProperties, useEffect, useId, useState } from "react";
import {
  RAILO_BOX,
  RAILO_CUTS,
  RAILO_VIEW_BOX,
  railoLens,
  railoPaths,
} from "@/lib/railo-geometry";
import { SPLASH_MS } from "@/lib/splash-script";

const CUT = RAILO_CUTS.display;

/** The mark's share of the covered box. Everything else is derived from it. */
const MARK = 0.1;

/** Scale at which the lens has swallowed a box it only has to cover. */
const OPEN = 40;

/** Wide enough that the wall still covers the box once shrunk to mark scale. */
const WALL = RAILO_BOX * 20;

/**
 * Deliberately not ease-soft. That curve spends 80% of its travel in the first
 * fifth, which on a scale this large is a pop rather than an opening. An
 * aperture wants the opposite: hold, then go.
 */
const APERTURE = {
  transformBox: "view-box",
  transformOrigin: `${RAILO_BOX / 2}px ${RAILO_BOX / 2}px`,
  animation: "railo-aperture 600ms cubic-bezier(.62,0,.86,.4) 1100ms both",
  "--railo-open": OPEN,
} as CSSProperties;

/** Fields settle, and the drawn form takes over from the moving one. */
const SETTLED = { animation: "railo-settle 1ms linear 900ms backwards" };
const MOVING = { animation: "railo-clear 1ms linear 900ms forwards" };

/**
 * The gap stops being wall and becomes window. It waits until the aperture is
 * already moving, so the mark holds whole a beat longer.
 */
const PLUG = { animation: "railo-clear 220ms linear 1080ms forwards" };

const ROOM = {
  x: -RAILO_BOX,
  y: -RAILO_BOX,
  width: RAILO_BOX * 3,
  height: RAILO_BOX * 3,
};

const REGION = { maskUnits: "userSpaceOnUse" as const, ...ROOM };

const centred = `translate(${RAILO_BOX / 2} ${RAILO_BOX / 2}) scale(${MARK}) translate(${-RAILO_BOX / 2} ${-RAILO_BOX / 2})`;

/** Everything, with the lens punched out of it. */
const wall = `M${-WALL} ${-WALL}H${WALL}V${WALL}H${-WALL}Z${railoLens(CUT)}`;

/**
 * The session's entrance: two fields converge and the lens between them opens
 * until the page is what is left.
 *
 * The aperture is a hole in this cover, never a window onto the page. Chrome
 * blanks a live canvas while an ancestor animates a transform or a clip, and the
 * homepage hero is exactly that canvas, so nothing below this layer moves.
 *
 * Nothing masked is ever scaled, either. Safari does not composite masked SVG
 * content, so a mask riding a 40x scale is re-rasterised at full size every
 * frame. Masks are what make a crescent out of two circles, so they do the
 * converge, and then plain paths of the same geometry take over for the opening.
 *
 * The cover renders on the server every time and hides itself in CSS, keyed off
 * the attribute the blocking script sets. A repeat visit therefore never shows a
 * frame of it.
 */
export function RailoSplash() {
  const raw = useId();
  const id = raw.replace(/[^a-zA-Z0-9]/g, "");
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.splash !== "1") {
      setGone(true);
      return;
    }

    const root = document.documentElement;
    const held = root.style.overflow;
    root.style.overflow = "hidden";

    const done = setTimeout(() => setGone(true), SPLASH_MS);
    return () => {
      clearTimeout(done);
      root.style.overflow = held;
    };
  }, []);

  if (gone) return null;

  const { radius, left, right } = CUT;
  const paths = railoPaths(CUT);

  const field = (side: "l" | "r", paint: "white" | "black") => (
    <g
      style={{
        transformBox: "view-box",
        transformOrigin: `${side === "l" ? left : right}px ${RAILO_BOX / 2}px`,
        animation: `railo-in-${side} 900ms var(--usva-ease-soft, cubic-bezier(.22,1,.36,1)) both`,
      }}
    >
      <circle
        cx={side === "l" ? left : right}
        cy={RAILO_BOX / 2}
        r={radius}
        fill={paint}
      />
    </g>
  );

  return (
    <div id="railo-splash" aria-hidden="true" className="fixed inset-0 z-100">
      <svg
        className="h-full w-full"
        viewBox={RAILO_VIEW_BOX}
        preserveAspectRatio="xMidYMid slice"
      >
        <title>{""}</title>
        <mask id={`${id}-l`} {...REGION}>
          <rect {...ROOM} fill="black" />
          {field("l", "white")}
          {field("r", "black")}
        </mask>
        <mask id={`${id}-r`} {...REGION}>
          <rect {...ROOM} fill="black" />
          {field("r", "white")}
          {field("l", "black")}
        </mask>

        <g style={APERTURE}>
          <path
            d={wall}
            fillRule="evenodd"
            fill="var(--usva-bg)"
            transform={centred}
          />
          <path
            d={railoLens(CUT)}
            fill="var(--usva-bg)"
            transform={centred}
            style={PLUG}
          />
          <g transform={centred} style={SETTLED}>
            <path d={paths.left} fill="var(--usva-accent)" />
            <path d={paths.right} fill="var(--usva-accent-alt)" />
          </g>
        </g>

        <g transform={centred} style={MOVING}>
          <rect {...ROOM} fill="var(--usva-accent)" mask={`url(#${id}-l)`} />
          <rect {...ROOM} fill="var(--usva-accent-alt)" mask={`url(#${id}-r)`} />
        </g>
      </svg>
    </div>
  );
}
