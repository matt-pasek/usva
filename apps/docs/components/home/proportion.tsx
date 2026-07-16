"use client";
import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  CATALOG,
  type CatalogEntry,
  counts,
  LAYER_LABEL,
  type Layer,
} from "@/lib/catalog";
import { PROPORTION_DIM, PROPORTION_SCENE } from "./home-motion";
import { Scrub } from "./tiivistyma";

const CELL: Record<Layer, string> = {
  primitive: "bg-border-strong",
  pattern: "bg-muted",
  sula: "bg-accent",
  atmosphere: "bg-accent-alt",
};

const LOUD_LAYERS: Layer[] = ["sula", "atmosphere"];
const ORDER: Layer[] = ["primitive", "pattern", "sula", "atmosphere"];

/* Every square is a component, so the grid is the catalogue rather than a
 * picture of it: the ratio is still the argument, but you can now put your
 * finger on any square and go read the thing it counts. */
const SQUARES = ORDER.flatMap((layer) =>
  CATALOG.filter((entry) => entry.layer === layer),
);

const LOUD = SQUARES.filter((s) => LOUD_LAYERS.includes(s.layer)).length;
const QUIET = SQUARES.length - LOUD;

const { lay, quietShare, dim, verdict } = PROPORTION_SCENE;
const laySpan = lay[1] - lay[0];

/**
 * The grid is laid while the section rides in on its crest: the quiet mass
 * lands first, then the loud ones are dealt out one at a time so you have
 * counted them before the copy asks you to. The emphasis afterwards never
 * moves a square. The quiet ones step back, the ratio stays a grid.
 */
function Square({
  entry,
  index,
  build,
  onFocus,
  onBlur,
}: {
  entry: CatalogEntry;
  index: number;
  build: MotionValue<number>;
  onFocus: (entry: CatalogEntry) => void;
  onBlur: () => void;
}) {
  const reduced = useReducedMotion();
  const loud = LOUD_LAYERS.includes(entry.layer);
  const loudIndex = SQUARES.slice(0, index).filter((s) =>
    LOUD_LAYERS.includes(s.layer),
  ).length;
  const quietIndex = index - loudIndex;

  const quietEnd = lay[0] + laySpan * quietShare;
  const from = loud
    ? quietEnd + (loudIndex / LOUD) * (lay[1] - quietEnd)
    : lay[0] + (quietIndex / QUIET) * (quietEnd - lay[0]);
  const to = from + 0.05;

  const laid = useTransform(build, [from, to], [0, 1]);
  const y = useTransform(laid, [0, 1], [-10, 0]);
  const scale = useTransform(laid, [0, 1], [0.35, 1]);

  const step = useTransform(build, [...dim], [1, loud ? 1 : PROPORTION_DIM]);
  const opacity = useTransform(
    [laid, step],
    ([a, b]: number[]) => (a ?? 1) * (b ?? 1),
  );

  const face = (
    <Link
      href={`/docs/components/${entry.slug}`}
      aria-label={entry.name}
      onPointerEnter={() => onFocus(entry)}
      onPointerLeave={onBlur}
      onFocus={() => onFocus(entry)}
      onBlur={onBlur}
      className={`block aspect-square rounded-[2px] outline-none transition-transform duration-fast ease-soft hover:scale-125 focus-visible:scale-125 focus-visible:ring-focus ${CELL[entry.layer]}`}
    />
  );

  if (reduced) return <li>{face}</li>;

  return <motion.li style={{ y, scale, opacity }}>{face}</motion.li>;
}

/** The one place a square says its name, so 72 of them need no 72 tooltips. */
function Readout({ entry }: { entry: CatalogEntry | null }) {
  return (
    <p className="mt-6 flex min-h-6 items-center gap-3 font-mono text-xs">
      {entry ? (
        <>
          <span
            aria-hidden="true"
            className={`size-2.5 rounded-[2px] ${CELL[entry.layer]}`}
          />
          <span className="text-ink">{entry.name}</span>
          <span className="text-faint">{LAYER_LABEL[entry.layer]}</span>
        </>
      ) : (
        <span className="text-faint">
          every square is a component. point at one.
        </span>
      )}
    </p>
  );
}

export function Proportion() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [held, setHeld] = useState<CatalogEntry | null>(null);

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
    <section ref={ref} className="relative lg:h-[220svh]">
      <div className="relative flex min-h-svh items-center overflow-x-hidden lg:sticky lg:top-0 lg:overflow-hidden">
        <div className="mx-auto w-full max-w-[100rem] px-6 py-12 sm:px-10 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-[minmax(17rem,0.72fr)_minmax(0,1.65fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-[clamp(3rem,7vw,8rem)]">
            <div className="lg:col-start-1 lg:row-start-1">
              <Scrub>
                <h2 className="max-w-xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  one square for every component I ship.
                </h2>
              </Scrub>

              <p className="mt-6 flex items-center gap-3 font-mono text-xs text-muted tabular-nums">
                <span className="text-ink">{QUIET} quiet</span>
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-border-strong"
                />
                <span className="text-accent">{LOUD} loud</span>
              </p>
            </div>

            <div className="relative mt-12 min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:self-center">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-x-8 -inset-y-12 -z-10 opacity-50"
                style={{
                  backgroundImage:
                    "radial-gradient(70% 70% at 82% 45%, color-mix(in oklab, var(--usva-accent) 12%, transparent), transparent 72%)",
                }}
              />
              <ul className="grid grid-cols-10 gap-1.5 min-[420px]:grid-cols-12 sm:gap-2 lg:grid-cols-[repeat(12,minmax(0,1fr))] lg:gap-2.5 xl:grid-cols-[repeat(14,minmax(0,1fr))]">
                {SQUARES.map((entry, index) => (
                  <Square
                    key={entry.slug}
                    entry={entry}
                    index={index}
                    build={build}
                    onFocus={setHeld}
                    onBlur={() => setHeld(null)}
                  />
                ))}
              </ul>

              <Readout entry={held} />
            </div>

            <div className="mt-8 lg:col-start-1 lg:row-start-2 lg:mt-12">
              <span className="block overflow-hidden pb-[0.14em]">
                <motion.span
                  style={reduced ? undefined : { y: verdictY }}
                  className="block max-w-lg text-muted"
                >
                  the loud ones are the accent squares. count them. that ratio
                  is the design system, and it is the part people get wrong:
                  sula is seasoning, not the diet.
                </motion.span>
              </span>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-2">
                {ORDER.map((layer) => (
                  <div key={layer} className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className={`h-2.5 w-2.5 rounded-[2px] ${CELL[layer]}`}
                    />
                    <dt className="font-mono text-xs text-muted">
                      {LAYER_LABEL[layer]}
                    </dt>
                    <dd className="font-mono text-sm text-ink tabular-nums">
                      {SQUARES.filter((s) => s.layer === layer).length}
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
        </div>
      </div>
    </section>
  );
}
