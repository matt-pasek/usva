"use client";

import type * as React from "react";
import {
  motion,
  RefusalChip,
  useShake,
} from "@/components/design-language/refusal";

interface Refusal {
  id: string;
  mark: React.ReactNode;
  message: string;
}

const REFUSALS: Refusal[] = [
  {
    id: "uppercase",
    mark: (
      <>
        USVA<span className="text-accent-alt">.</span>
      </>
    ),
    message: "USVA is a corporate acronym. usva is weather.",
  },
  {
    id: "recolored",
    mark: (
      <>
        usva<span className="text-accent">.</span>
      </>
    ),
    message:
      "the period is accent-alt, the paired voice. never the primary accent.",
  },
  {
    id: "spaced",
    mark: (
      <span className="tracking-[0.4em]">
        usva<span className="text-accent-alt">.</span>
      </span>
    ),
    message: "the mist has to hold together. no letterspacing.",
  },
  {
    id: "nodot",
    mark: <>usva</>,
    message: "the period is load-bearing. it does not come off.",
  },
];

function RefusalSpecimen({ mark, message }: Refusal) {
  const { controls, shake } = useShake();
  return (
    <motion.div
      animate={controls}
      onHoverStart={shake}
      onFocus={shake}
      tabIndex={0}
      className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 outline-none focus-visible:ring-focus"
    >
      <span className="font-extrabold text-2xl text-ink/50 tracking-tight line-through decoration-danger/60 decoration-2">
        {mark}
      </span>
      <RefusalChip>{message}</RefusalChip>
    </motion.div>
  );
}

export function WordmarkRefusals() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {REFUSALS.map((refusal) => (
        <RefusalSpecimen key={refusal.id} {...refusal} />
      ))}
    </div>
  );
}
