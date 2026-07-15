"use client";
import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { counts } from "@/lib/catalog";
import { PROPORTION_DIM, PROPORTION_SCENE } from "./home-motion";
import { Scrub } from "./tiivistyma";

const LAYERS = [
  {
    key: "primitives",
    label: "core · primitives",
    count: counts.primitives,
    cell: "bg-border-strong",
    loud: false,
  },
  {
    key: "patterns",
    label: "core · patterns",
    count: counts.patterns,
    cell: "bg-muted",
    loud: false,
  },
  {
    key: "sula",
    label: "sula",
    count: counts.sula,
    cell: "bg-accent",
    loud: true,
  },
  {
    key: "atmospheres",
    label: "atmospheres",
    count: counts.atmospheres,
    cell: "bg-accent-alt",
    loud: true,
  },
];

const CELLS = LAYERS.flatMap((layer) =>
  Array.from({ length: layer.count }, (_, index) => ({
    id: `${layer.key}-${index}`,
    cell: layer.cell,
    loud: layer.loud,
  })),
);

const QUIET = CELLS.filter((c) => !c.loud).length;
const LOUD = CELLS.length - QUIET;

const { lay, quietShare, dim, verdict } = PROPORTION_SCENE;
const laySpan = lay[1] - lay[0];

/**
 * The grid is laid while the section rides in on its crest: the quiet mass
 * lands first, then the loud ones are dealt out one at a time so you have
 * counted them before the copy asks you to. The emphasis afterwards never
 * moves a square. The quiet ones step back, the ratio stays a grid.
 */
function Square({
  square,
  index,
  build,
}: {
  square: (typeof CELLS)[number];
  index: number;
  build: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  const loudIndex = CELLS.slice(0, index).filter((c) => c.loud).length;
  const quietIndex = index - loudIndex;

  const quietEnd = lay[0] + laySpan * quietShare;
  const from = square.loud
    ? quietEnd + (loudIndex / LOUD) * (lay[1] - quietEnd)
    : lay[0] + (quietIndex / QUIET) * (quietEnd - lay[0]);
  const to = from + 0.05;

  const laid = useTransform(build, [from, to], [0, 1]);
  const y = useTransform(laid, [0, 1], [-10, 0]);
  const scale = useTransform(laid, [0, 1], [0.35, 1]);

  const step = useTransform(
    build,
    [...dim],
    [1, square.loud ? 1 : PROPORTION_DIM],
  );
  const opacity = useTransform(
    [laid, step],
    ([a, b]: number[]) => (a ?? 1) * (b ?? 1),
  );

  if (reduced) {
    return <li className={`aspect-square rounded-[2px] ${square.cell}`} />;
  }

  return (
    <motion.li
      style={{ y, scale, opacity }}
      className={`aspect-square rounded-[2px] ${square.cell}`}
    />
  );
}

export function Proportion() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const build = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 32,
    mass: 0.5,
  });

  const verdictY = useTransform(build, [...verdict], ["115%", "0%"]);

  return (
    <section ref={ref} className="relative h-[220svh]">
      <div className="sticky top-0 flex min-h-svh items-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
          <Scrub>
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              one square for every component I ship.
            </h2>
          </Scrub>

          <ul
            aria-hidden="true"
            className="mt-12 grid max-w-3xl grid-cols-12 gap-1.5 sm:grid-cols-[repeat(18,minmax(0,1fr))]"
          >
            {CELLS.map((square, index) => (
              <Square
                key={square.id}
                square={square}
                index={index}
                build={build}
              />
            ))}
          </ul>

          <span className="mt-10 block overflow-hidden pb-[0.14em]">
            <motion.span
              style={reduced ? undefined : { y: verdictY }}
              className="block max-w-2xl text-muted"
            >
              the loud ones are the accent squares. count them. that ratio is
              the design system, and it is the part people get wrong: sula is
              seasoning, not the diet.
            </motion.span>
          </span>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            {LAYERS.map((layer) => (
              <div key={layer.key} className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className={`h-2.5 w-2.5 rounded-[2px] ${layer.cell}`}
                />
                <dt className="font-mono text-xs text-muted">{layer.label}</dt>
                <dd className="font-mono text-sm text-ink tabular-nums">
                  {layer.count}
                </dd>
              </div>
            ))}
            <div className="flex items-center gap-2.5">
              <dt className="font-mono text-xs text-muted">total</dt>
              <dd className="font-mono text-sm text-ink tabular-nums">
                {counts.total}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
