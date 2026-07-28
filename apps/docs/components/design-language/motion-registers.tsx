"use client";

import { RotateCcw } from "lucide-react";
import {
  type MotionValue,
  motion,
  useInView,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import * as React from "react";
import { Button } from "usva/primitives/button";

const MASK = "overflow-hidden [clip-path:inset(0)] [transform:translateZ(0)]";
const LAYER = "[backface-visibility:hidden] will-change-transform";

const TRAVEL = 150;

const SCENE: [number, number] = [0.15, 0.85];

const LINES: { text: string; range: [number, number] }[] = [
  { text: "beauty", range: [0.4, 0.6] },
  { text: "that stays", range: [0.45, 0.65] },
  { text: "usable", range: [0.5, 0.7] },
];

const TYPE =
  "block font-extrabold text-[clamp(1.5rem,4cqi,2.5rem)] text-ink leading-[1.08] tracking-[-0.03em]";

function Line({ children }: { children: React.ReactNode }) {
  return <span className={`block ${MASK} pb-[0.14em]`}>{children}</span>;
}

function ScrubLine({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: React.ReactNode;
}) {
  const local = useTransform(progress, range, [0, 1]);
  const travel = useTransform(local, [0, 1], [TRAVEL, 0]);
  const y = useMotionTemplate`${travel}%`;

  return (
    <Line>
      <motion.span style={{ y }} className={`${TYPE} ${LAYER}`}>
        {children}
      </motion.span>
    </Line>
  );
}

function TriggerLine({
  index,
  children,
}: {
  index: number;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.9 });

  return (
    <span ref={ref} className={`block ${MASK} pb-[0.14em]`}>
      <motion.span
        initial={{ y: `${TRAVEL}%` }}
        animate={{ y: inView ? "0%" : `${TRAVEL}%` }}
        transition={{
          duration: 0.6,
          delay: index * 0.08,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={`${TYPE} ${LAYER}`}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Still() {
  return (
    <div className="flex flex-col">
      {LINES.map((line) => (
        <span key={line.text} className={TYPE}>
          {line.text}
        </span>
      ))}
    </div>
  );
}

function Panel({
  label,
  note,
  children,
}: {
  label: string;
  note: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="@container flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
      <div className="flex h-8 items-center justify-between gap-3">
        <span className="font-mono text-muted text-xs uppercase tracking-widest">
          {label}
        </span>
        {note}
      </div>
      <div className="flex min-h-40 flex-col justify-center">{children}</div>
    </div>
  );
}

export function MotionRegisters() {
  const reduced = useReducedMotion();
  const [run, setRun] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scene = useTransform(scrollYProgress, SCENE, [0, 1]);
  const percent = useTransform(scene, (v) => `${Math.round(v * 100)}%`);

  if (reduced) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Panel label="scrubbed" note={null}>
            <Still />
          </Panel>
          <Panel label="triggered" note={null}>
            <Still />
          </Panel>
        </div>
        <p className="max-w-2xl text-muted text-sm">
          reduced motion is on, so both sides sit where they land and neither
          register runs.
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Panel
          label="scrubbed"
          note={
            <motion.span className="font-mono text-ink text-xs tabular-nums">
              {percent}
            </motion.span>
          }
        >
          <div className="flex flex-col">
            {LINES.map((line) => (
              <ScrubLine
                key={line.text}
                progress={scrollYProgress}
                range={line.range}
              >
                {line.text}
              </ScrubLine>
            ))}
          </div>
        </Panel>

        <Panel
          label="triggered"
          note={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRun((v) => v + 1)}
            >
              <RotateCcw aria-hidden="true" />
              again
            </Button>
          }
        >
          <div key={run} className="flex flex-col">
            {LINES.map((line, i) => (
              <TriggerLine key={line.text} index={i}>
                {line.text}
              </TriggerLine>
            ))}
          </div>
        </Panel>
      </div>

      <p className="max-w-2xl text-muted text-sm">
        scroll past and both sides climb out. scroll back up and the left one
        climbs in again, because it is reading your scroll position rather than
        remembering that it already ran. the right one has spent itself, and
        only re-arms on a route change, which is what the button stands in for.
      </p>
    </div>
  );
}
