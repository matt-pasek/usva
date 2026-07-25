"use client";

import { useState } from "react";
import { RailoMasked } from "@/components/railo-motion";
import {
  RAILO_BOX,
  RAILO_CUTS,
  RAILO_VIEW_BOX,
  railoPaths,
} from "@/lib/railo-geometry";

const CUT = RAILO_CUTS.display;
const HALF = RAILO_BOX / 2;

function Circles({ show }: { show: "fields" | "subtract" | "mark" }) {
  const paths = railoPaths(CUT);
  return (
    <svg aria-hidden="true" viewBox={RAILO_VIEW_BOX} className="size-full">
      {show === "fields" ? (
        <>
          <circle
            cx={CUT.left}
            cy={HALF}
            r={CUT.radius}
            fill="var(--usva-accent)"
            opacity={0.55}
          />
          <circle
            cx={CUT.right}
            cy={HALF}
            r={CUT.radius}
            fill="var(--usva-accent-alt)"
            opacity={0.55}
          />
        </>
      ) : (
        <>
          <path d={paths.left} fill="var(--usva-accent)" />
          <path d={paths.right} fill="var(--usva-accent-alt)" />
        </>
      )}
      {show === "subtract" ? (
        <path
          d={paths.left}
          fill="none"
          stroke="var(--usva-danger)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          transform={`translate(${CUT.right - CUT.left} 0)`}
        />
      ) : null}
    </svg>
  );
}

export function RailoAnatomy() {
  const [run, setRun] = useState(0);

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6">
      <div className="flex items-baseline gap-3">
        <span className="font-semibold text-ink">the mark builds itself</span>
        <span className="text-muted text-sm">900ms, once</span>
        <button
          type="button"
          onClick={() => setRun((n) => n + 1)}
          className="ml-auto rounded-md border border-border-strong bg-surface-2 px-3 py-1.5 font-mono text-[0.7rem] text-ink outline-none transition-colors duration-fast ease-soft hover:bg-accent-tint focus-visible:ring-focus"
        >
          replay
        </button>
      </div>
      <div className="grid min-h-52 place-items-center rounded-md bg-sunken p-8">
        <RailoMasked key={run} animation="reveal" className="size-32" />
      </div>
    </div>
  );
}
