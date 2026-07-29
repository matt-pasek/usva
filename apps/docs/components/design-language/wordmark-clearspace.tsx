"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useInViewOnce } from "@/lib/use-in-view-once";

const INK = "leading-none [text-box:trim-both_ex_alphabetic]";
const SLOT =
  "absolute top-1/2 -translate-y-1/2 grid size-[1ex] place-items-center";

function GhostU({ id, rotate }: { id: string; rotate: number }) {
  return (
    <motion.span
      layoutId={id}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.1, ease: "easeOut" }}
      className={`pointer-events-none select-none text-ink/15 ${INK}`}
    >
      <span className="block" style={{ rotate: `${rotate}deg` }}>
        u
      </span>
    </motion.span>
  );
}

export function WordmarkClearspace() {
  const reduced = Boolean(useReducedMotion());
  const [frame, seen] = useInViewOnce<HTMLDivElement>();
  const [inSlots, setInSlots] = useState(false);

  useEffect(() => {
    if (!seen) return;
    if (reduced) {
      setInSlots(true);
      return;
    }
    const id = setTimeout(() => setInSlots(true), 200);
    return () => clearTimeout(id);
  }, [reduced, seen]);

  return (
    <div
      ref={frame}
      className="flex items-center justify-center overflow-hidden rounded-lg border border-border bg-surface p-10 text-4xl sm:text-5xl"
    >
      <span className="relative rounded-md border border-accent/30 border-dashed p-[1ex] font-extrabold tracking-tight">
        <span className={`${SLOT} left-0`} aria-hidden>
          {inSlots && <GhostU id="clearspace-l" rotate={-90} />}
        </span>
        <span className={`${SLOT} right-0`} aria-hidden>
          {inSlots && <GhostU id="clearspace-r" rotate={90} />}
        </span>

        <span className="relative text-ink">
          <span className="relative inline-block">
            u
            {!inSlots && (
              <span
                className="absolute inset-0 grid place-items-center"
                aria-hidden
              >
                <GhostU id="clearspace-l" rotate={-90} />
                <GhostU id="clearspace-r" rotate={90} />
              </span>
            )}
          </span>
          sva<span className="text-accent-alt">.</span>
        </span>
      </span>
    </div>
  );
}
