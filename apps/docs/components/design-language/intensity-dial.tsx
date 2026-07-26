"use client";

import { MockupShowcase } from "@matt-pasek/usva/patterns/mockup-showcase";
import { SulaSegmented } from "@matt-pasek/usva/sula/sula-segmented";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { STOP_COPY, STOPS, SULA_STOP } from "./dial-model";
import { DialScreen } from "./dial-screen";

const ITEMS = STOPS.map((name) => ({
  value: name,
  label: STOP_COPY[name].title,
}));

const EASE = [0.22, 1, 0.36, 1] as const;

export function IntensityDial() {
  const [stopName, setStopName] = React.useState<(typeof STOPS)[number]>(
    STOPS[0],
  );
  const stop = STOPS.indexOf(stopName);
  const current = STOP_COPY[stopName];
  const armed = stop >= SULA_STOP;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <SulaSegmented
          aria-label="intensity"
          items={ITEMS}
          value={stopName}
          onValueChange={(value) =>
            setStopName(value as (typeof STOPS)[number])
          }
        />
      </div>

      <div className="min-h-11">
        <AnimatePresence mode="wait">
          <motion.p
            key={stopName}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="max-w-2xl text-muted text-sm"
          >
            <span className="mr-2 font-mono text-[10px] text-accent/80 uppercase tracking-widest">
              {current.layer}
            </span>
            {current.line}
          </motion.p>
        </AnimatePresence>
      </div>

      <MockupShowcase frame="browser" aspect="auto" url="app.xyz/ingest">
        <DialScreen stop={stop} />
      </MockupShowcase>

      <AnimatePresence initial={false}>
        {armed && (
          <motion.p
            key="sula-rule"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="overflow-hidden"
          >
            <span className="block max-w-2xl rounded-lg border border-accent/25 bg-accent-tint/40 px-4 py-3 text-ink text-sm">
              <span className="font-semibold">
                one sula element per region.
              </span>{" "}
              a second sula in this region cancels the first: two liquid fields
              fighting for one focus read as noise. a second in a different
              region, one ambient at the boundary and one focal at the top, does
              not, and that pairing ships on my own site. the interesting part
              of a rule is always its edge.
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
