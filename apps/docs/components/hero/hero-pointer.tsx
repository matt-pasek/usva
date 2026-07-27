"use client";

import * as React from "react";

declare global {
  interface Window {
    __heroPointer?: { x: number; y: number };
  }
}

/**
 * Reports the dial's centre to the bake harness, which presses a real mouse
 * there so väre's phase lens bends around a genuine pointer.
 */
export function useKnobCentre(
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

export const Cursor = ({ x, y }: { x: number; y: number }) => (
  <svg
    aria-hidden="true"
    width="34"
    height="34"
    viewBox="0 0 28 28"
    className="pointer-events-none absolute z-40"
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
