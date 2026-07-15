"use client";
import {
  Badge,
  BentoCard,
  BentoGrid,
  BentoMetric,
  BentoText,
  Button,
  Kajastus,
  Panel,
  ProgressRow,
} from "@matt-pasek/usva";
import {
  type MotionValue,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { counts, type Intensity } from "@/lib/catalog";
import { ATMOSPHERE_LINKS } from "./descent-layout";
import { KUOHU_SCENE } from "./home-motion";
import { Kuohu } from "./kuohu";
import { PrimitiveShowcase } from "./primitive-showcase";
import { Drift, Scrub, Staged } from "./tiivistyma";

const STRATA: { id: Intensity; label: string; note: string }[] = [
  { id: "recedes", label: "recedes", note: "core · primitives" },
  { id: "structures", label: "structures", note: "core · patterns" },
  { id: "asserts", label: "asserts", note: "sula" },
  { id: "room", label: "is the room", note: "atmospheres" },
];

const PANEL_ROWS = [
  { label: "period 1", value: 15, max: 15 },
  { label: "period 2", value: 11, max: 15 },
  { label: "period 3", value: 4, max: 15 },
];

const STRATUM = "mx-auto max-w-7xl px-6 sm:px-10 lg:pl-44";

function useDescent() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inDescent, setInDescent] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("[data-stratum]"),
    );
    if (sections.length === 0) return;

    const update = () => {
      const rootRect = root.getBoundingClientRect();
      /* The next surface pulls itself over the last 100svh of the room's pin,
       * so the rail steps aside one viewport early, right as the crest
       * enters, rather than floating over the arriving mass. */
      setInDescent(
        rootRect.top < window.innerHeight * 0.5 &&
          rootRect.bottom > window.innerHeight * 2,
      );

      const line = window.innerHeight * 0.4;
      let current = 0;
      sections.forEach((section, index) => {
        if (section.getBoundingClientRect().top <= line) current = index;
      });
      setActive(current);
    };

    let frame = 0;
    const measure = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
    };
  }, []);

  return { active, inDescent, rootRef };
}

function Rail({ active, visible }: { active: number; visible: boolean }) {
  return (
    <>
      <div
        aria-hidden="true"
        className={`fixed top-1/2 left-8 z-dropdown hidden w-40 -translate-y-1/2 flex-col gap-5 transition-opacity duration-slow lg:flex ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {STRATA.map((stratum, index) => {
          const on = index === active;
          return (
            <div key={stratum.id} className="flex items-center gap-3">
              <span className="relative h-9 w-px overflow-hidden bg-border">
                <span
                  className={`absolute inset-0 origin-top bg-accent transition-transform duration-base ease-soft ${
                    on ? "scale-y-100" : "scale-y-0"
                  }`}
                />
              </span>
              <span className="flex min-w-0 flex-col gap-0.5 leading-tight">
                <span
                  className={`whitespace-nowrap font-mono text-xs transition-tint ${
                    on ? "text-ink" : "text-muted"
                  }`}
                >
                  {stratum.label}
                </span>
                <span
                  className={`whitespace-nowrap font-mono text-[0.625rem] tracking-[0.12em] text-muted transition-opacity ${
                    on ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {stratum.note}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div
        aria-hidden="true"
        className={`fixed inset-x-0 top-16 z-dropdown flex items-center gap-3 border-border border-b bg-bg/80 px-6 py-2 backdrop-blur transition-opacity duration-slow lg:hidden ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <span className="font-mono text-xs text-muted">
          {STRATA[active]?.label}
        </span>
        <span className="h-px flex-1 bg-border">
          <span
            className="block h-px origin-left bg-accent transition-transform duration-base ease-soft"
            style={{ transform: `scaleX(${(active + 1) / STRATA.length})` }}
          />
        </span>
      </div>
    </>
  );
}

function StratumHeading({
  intensity,
  title,
  lede,
  count,
}: {
  intensity: string;
  title: string;
  lede: string;
  count: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <Scrub>
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            {intensity}
          </span>
          <span className="font-mono text-xs text-faint">{count}</span>
        </div>
      </Scrub>
      <Scrub>
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
      </Scrub>
      <Scrub>
        <p className="max-w-2xl text-muted">{lede}</p>
      </Scrub>
    </div>
  );
}

function More({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block rounded font-mono text-sm text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-focus"
    >
      {children} ↗
    </Link>
  );
}

/**
 * The owner's cut for asserts: the lamp arrives alone and you just watch the
 * fluid. Keep scrolling and the scene hands the lamp to its column while the
 * copy climbs out, line by line, and the boil peaks exactly while the text is
 * making the argument the boil illustrates.
 */
function AssertsScene() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const scene = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.6,
  });

  /* glide 1 = the lamp holds centre stage alone; 0 = it is home in its
   * column. The reach lives in a CSS var so the phone, where there is no
   * column to glide to, sets it to zero without JS. */
  const glide = useTransform(
    scene,
    KUOHU_SCENE.glide as [number, number],
    [1, 0],
  );
  /* Translate only, never scale: SulaField sizes its canvas off the measured
   * box, so a CSS scale on the lamp leaves the fluid drawn against bounds that
   * no longer match the glass and the pool spills out of it. */
  const lampTransform = useMotionTemplate`translateX(calc(${glide} * var(--kuohu-reach, 0rem)))`;

  return (
    <section
      ref={ref}
      data-stratum="asserts"
      className="relative h-[300svh] [--kuohu-reach:0rem] lg:[--kuohu-reach:max(-19rem,-24vw)]"
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div
          className={`grid w-full items-center gap-8 lg:grid-cols-2 lg:gap-16 ${STRATUM}`}
        >
          <div className="order-2 flex flex-col gap-6 lg:order-1">
            <div className="flex flex-col gap-3">
              <Staged progress={scene} range={KUOHU_SCENE.eyebrow}>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                    asserts
                  </span>
                  <span className="font-mono text-xs text-faint">
                    {counts.sula}, for now
                  </span>
                </div>
              </Staged>
              <Staged progress={scene} range={KUOHU_SCENE.title}>
                <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                  sula is a material, not a component.
                </h2>
              </Staged>
              <Staged progress={scene} range={KUOHU_SCENE.lede}>
                <p className="max-w-2xl text-muted">
                  a surface that behaves like a liquid: it swells, it merges, it
                  pinches apart, it has mass and it lags. that is the whole
                  idea. you have been watching it do exactly that.
                </p>
              </Staged>
            </div>
            <div className="flex flex-col gap-5">
              <Staged progress={scene} range={KUOHU_SCENE.bodyA}>
                <p className="max-w-md text-muted">
                  there will be more, but not many and not quickly. a component
                  this loud has to earn the room it takes, and most ideas do
                  not.
                </p>
              </Staged>
              <Staged progress={scene} range={KUOHU_SCENE.bodyB}>
                <p className="max-w-md text-muted">
                  the {counts.primitives + counts.patterns} quiet components
                  above are what earn this one the right to be loud. one sula
                  surface per region, and never in a form somebody has to fill
                  in.
                </p>
              </Staged>
              <Staged progress={scene} range={KUOHU_SCENE.link}>
                <More href="/docs/components">meet the {counts.sula}</More>
              </Staged>
            </div>
          </div>

          <motion.div
            style={reduced ? undefined : { transform: lampTransform }}
            className="order-1 flex flex-col items-center gap-4 lg:order-2"
          >
            <Kuohu />
            <p className="font-mono text-[11px] text-faint">
              ↳ kuohu · the surge of a boiling liquid
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/** One drifting name in the constellation. Depth without a single fade. */
function Star({
  entry,
  progress,
}: {
  entry: (typeof ATMOSPHERE_LINKS)[number];
  progress: MotionValue<number>;
}) {
  const reduced = useReducedMotion();
  const y = useTransform(
    progress,
    [0, 1],
    [entry.drift * 16, entry.drift * -16],
  );

  return (
    <li
      className="-translate-x-1/2 -translate-y-1/2 absolute"
      style={{ left: `${entry.x}%`, top: `${entry.y}%` }}
    >
      <motion.span style={reduced ? undefined : { y }} className="block">
        <Link
          href={`/docs/components/${entry.slug}`}
          className="group flex flex-col items-center gap-1 rounded-md p-2 outline-none focus-visible:ring-focus"
          style={{ textShadow: "0 2px 14px var(--usva-bg)" }}
        >
          <span className="text-xl font-extrabold tracking-[-0.03em] text-ink/65 transition-tint group-hover:text-ink sm:text-2xl">
            {entry.slug}
          </span>
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted transition-tint group-hover:text-ink">
            {entry.descriptor}
          </span>
        </Link>
      </motion.span>
    </li>
  );
}

/**
 * The last stratum is pinned under the open sky for 250svh: 50 to stand in
 * the weather, then the next surface rides over it on its crest, exactly the
 * way the page itself arrived over the hero. The atmosphere owns the whole
 * viewport, so nothing crops its light, and the ground fade at the bottom is
 * the horizon handing over to the page rather than a hard edge.
 */
function Room() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const drift = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.8,
  });

  return (
    <div ref={ref} data-stratum="room" className="relative h-[250svh]">
      <section className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <Kajastus className="h-full w-full" opacity={0.85} />
          <div className="absolute inset-0 bg-bg/25" />
          <div className="absolute inset-x-0 bottom-0 h-[30%] bg-linear-to-t from-bg to-transparent" />
        </div>
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-20 text-center sm:px-10">
          <Scrub className="relative" offset={["start 105%", "start 78%"]}>
            <span
              className="font-mono text-xs uppercase tracking-[0.25em] text-accent"
              style={{ textShadow: "0 2px 18px var(--usva-bg)" }}
            >
              is the room
            </span>
            <p
              className="mx-auto mt-4 max-w-2xl text-lg text-ink text-balance"
              style={{ textShadow: "0 2px 18px var(--usva-bg)" }}
            >
              at the bottom there is no component left, only weather. an
              atmosphere is not a sibling of Button. it is the thing Button is
              standing in, and you are standing in one right now.
            </p>
            <p className="mt-3 font-mono text-xs text-ink/80">
              ↳ {counts.atmospheres} of them. this one is kajastus.
            </p>
          </Scrub>

          <ul className="relative mt-12 h-76 w-full max-w-3xl sm:mt-16 sm:h-88">
            {ATMOSPHERE_LINKS.map((entry) => (
              <Star key={entry.slug} entry={entry} progress={drift} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export function Descent() {
  const { active, inDescent, rootRef } = useDescent();

  return (
    <div ref={rootRef} className="relative">
      <Rail active={active} visible={inDescent} />

      <section
        data-stratum="recedes"
        className={`flex min-h-svh items-center ${STRATUM}`}
      >
        <div className="w-full py-20 sm:py-24">
          <StratumHeading
            intensity="recedes"
            count={`${counts.primitives} of them`}
            title="most of the system is furniture."
            lede="a button, a field, a chip, a row. you are not meant to notice any of them, and there are dozens, because that is what a real app is made of."
          />
          <Drift>
            <PrimitiveShowcase />
          </Drift>
          <div className="mt-6 flex flex-col gap-3">
            <p className="max-w-xl text-sm text-muted">
              a handful of them, live. you read the words, not the widgets. the
              rest behave the same way.
            </p>
            <More href="/docs/components">every primitive</More>
          </div>
        </div>
      </section>

      <section
        data-stratum="structures"
        className={`flex min-h-svh items-center ${STRATUM}`}
      >
        <div className="w-full py-20 sm:py-24">
          <StratumHeading
            intensity="structures"
            count={`${counts.patterns} of them`}
            title="then the things that hold a page up."
            lede="bigger, fewer, opinionated. a pattern has already decided how its parts sit together, which is the part you would otherwise redo on every screen."
          />
          <Drift>
            <BentoGrid className="mt-10 md:grid-cols-4">
              <Panel
                className="md:col-span-3 md:row-span-2"
                eyebrow="autumn 2026"
                title="credits, by period"
                badge={
                  <Badge tone="success" mono>
                    on track
                  </Badge>
                }
                actions={
                  <Button size="sm" variant="ghost">
                    open plan
                  </Button>
                }
              >
                <div className="flex flex-col divide-y divide-border px-4 py-2">
                  {PANEL_ROWS.map((row) => (
                    <ProgressRow
                      key={row.label}
                      label={row.label}
                      value={row.value}
                      max={row.max}
                      unit="op"
                    />
                  ))}
                </div>
              </Panel>
              <BentoCard>
                <BentoMetric value="79" suffix="%" label="of the degree" />
              </BentoCard>
              <BentoCard>
                <BentoText
                  label="empty state"
                  title="nothing is due."
                  body="the next deadline is nine days out."
                />
              </BentoCard>
              <BentoCard className="md:col-span-2">
                <div className="flex h-full flex-col justify-center px-5 py-3">
                  <ProgressRow label="degree" value={142} max={180} unit="op" />
                </div>
              </BentoCard>
              <BentoCard className="md:col-span-2">
                <BentoMetric
                  value={counts.patterns}
                  label="patterns in the system"
                />
              </BentoCard>
            </BentoGrid>
          </Drift>
          <div className="mt-6 flex flex-col gap-3">
            <p className="max-w-xl text-sm text-muted">
              these are the same patterns you install, composed together rather
              than flattened into screenshots.
            </p>
            <More href="/docs/components">every pattern</More>
          </div>
        </div>
      </section>

      <AssertsScene />

      <Room />
    </div>
  );
}
