"use client";

import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import * as React from "react";

/** The system's refusal gesture: a short, damped horizontal shake, the same one
 * the intensity dial does when it turns down a second sula. */
const SHAKE = {
  x: [0, -6, 5, -4, 3, -2, 0],
  transition: { duration: 0.42, ease: "easeInOut" as const },
};

export function useShake() {
  const controls = useAnimationControls();
  const reduced = useReducedMotion();
  const shake = React.useCallback(() => {
    if (reduced) return;
    void controls.start(SHAKE);
  }, [controls, reduced]);
  return { controls, shake };
}

export { motion };

export function RefusalChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-danger/30 bg-danger/10 px-2.5 py-1 font-mono text-[0.72rem] text-danger">
      <span aria-hidden>·</span>
      {children}
    </span>
  );
}
