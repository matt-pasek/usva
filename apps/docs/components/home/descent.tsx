"use client";
import { Kajastus } from "@usva-ui/react/atmospheres/kajastus";
import { Kynnos } from "@usva-ui/react/atmospheres/kynnos";
import { Loimu } from "@usva-ui/react/atmospheres/loimu";
import {
  BentoCard,
  BentoGrid,
  BentoMetric,
  BentoText,
} from "@usva-ui/react/patterns/bento-grid";
import { Panel } from "@usva-ui/react/patterns/panel";
import { ProgressRow } from "@usva-ui/react/patterns/progress-row";
import { Badge } from "@usva-ui/react/primitives/badge";
import { Button } from "@usva-ui/react/primitives/button";
import {
  type MotionStyle,
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
import { useTheme } from "@/components/theme-provider";
import { counts, type Intensity } from "@/lib/catalog";
import { ATMOSPHERE_LINKS } from "./descent-layout";
import { KUOHU_SCENE, WEIGHT } from "./home-motion";
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
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("[data-stratum]"),
    );
    if (sections.length === 0) return;

    const update = () => {
      const rootRect = root.getBoundingClientRect();
      const tail = reduced ? window.innerHeight * 0.4 : window.innerHeight * 2;
      setInDescent(
        rootRect.top < window.innerHeight * 0.5 && rootRect.bottom > tail,
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
  }, [reduced]);

  return { active, inDescent, rootRef };
}

function Ground({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion();

  const lift = useTransform(progress, [0, 0.25, 0.6], [0.55, 0.35, 0]);
  const deep = useTransform(progress, [0.15, 0.5], [0, 0.6]);
  const lamp = useTransform(progress, [0.42, 0.72, 0.92], [0, 0.55, 0.15]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        style={reduced ? { opacity: 0.3 } : { opacity: lift }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(120% 80% at 50% -10%, color-mix(in oklab, var(--usva-surface) 70%, transparent), transparent 70%)",
          }}
        />
      </motion.div>

      <motion.div
        style={reduced ? { opacity: 0.2 } : { opacity: deep }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--usva-ink) 4%, transparent) 45%, transparent 100%)",
          }}
        />
      </motion.div>

      <motion.div
        style={reduced ? { opacity: 0.25 } : { opacity: lamp }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(90% 55% at 50% 108%, color-mix(in oklab, var(--usva-accent) 26%, transparent), transparent 68%)",
          }}
        />
      </motion.div>
    </div>
  );
}

function Ghost({ word }: { word: string }) {
  return (
    <span
      aria-hidden="true"
      className="-z-10 pointer-events-none absolute right-0 bottom-0 select-none font-extrabold text-[clamp(5rem,16vw,14rem)] leading-[0.8] tracking-[-0.03em] text-ink/[0.035] mr-2"
    >
      {word}
    </span>
  );
}

/* The seam carries no position of its own: asserts is a full-bleed pinned
 * section and the other strata are max-w-7xl containers, so a seam that
 * anchored itself would draw a different length in each. The caller puts it on
 * the same content box every time. */
function Seam({ index, label }: { index: number; label: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none flex items-center gap-4"
    >
      <span className="font-mono text-[0.625rem] tracking-[0.2em] text-muted tabular-nums">
        {String(index).padStart(2, "0")}
      </span>
      <span className="h-px flex-1 bg-linear-to-r from-border via-border/40 to-transparent" />
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted">
        {label}
      </span>
    </div>
  );
}

/**
 * The content box every seam is drawn on. A stratum that is already a max-w-7xl
 * container only needs its own padding stepped over; the full-bleed pinned one
 * has to build the same box from scratch, and both end up the same length.
 */
function SeamRow({
  index,
  label,
  bleed = false,
}: {
  index: number;
  label: string;
  bleed?: boolean;
}) {
  return (
    <div
      className={`pointer-events-none absolute top-0 ${
        bleed
          ? "inset-x-0 mx-auto w-full max-w-7xl px-6 sm:px-10"
          : "inset-x-6 sm:inset-x-10"
      }`}
    >
      <Seam index={index} label={label} />
    </div>
  );
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
        className={`fixed inset-x-0 top-18 z-dropdown flex items-center gap-3 border-border border-b bg-bg/80 px-6 py-2 backdrop-blur transition-opacity duration-slow lg:hidden ${
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
          <span className="font-mono text-xs text-muted">{count}</span>
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
      {children} →
    </Link>
  );
}

/**
 * The word the lamp is named after, set enormous and standing behind the
 * glass, which eclipses its middle. The glass is translucent, so the letters
 * go on living dimly inside the fluid rather than being cut in half.
 */
function NameBehindGlass({
  progress,
  still,
}: {
  progress: MotionValue<number>;
  still: boolean;
}) {
  const leave = useTransform(progress, [...KUOHU_SCENE.recede], [1, 0]);
  const sink = useTransform(progress, [...KUOHU_SCENE.recede], [1, 0.94]);

  return (
    <motion.div
      aria-hidden="true"
      style={still ? undefined : { opacity: leave, scale: sink }}
      className="-z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-[46%] left-1/2 select-none"
    >
      <Staged
        progress={progress}
        range={KUOHU_SCENE.word}
        still={still}
        from={150}
        bleed="pb-[0.16em]"
      >
        <span className="block whitespace-nowrap font-extrabold text-[clamp(6rem,22vw,20rem)] leading-[0.85] tracking-[-0.03em] text-ink/45 mr-2">
          sula
        </span>
      </Staged>
    </motion.div>
  );
}

/** The etymology, read under the lamp while the word still stands behind it. */
function Etymology({
  progress,
  still,
}: {
  progress: MotionValue<number>;
  still: boolean;
}) {
  const leave = useTransform(progress, [...KUOHU_SCENE.recede], [1, 0]);

  return (
    <motion.div
      style={still ? undefined : { opacity: leave }}
      className="-translate-x-1/2 absolute top-full left-1/2 mt-7 flex w-max max-w-[90vw] flex-col items-center gap-2 text-center"
    >
      <Staged progress={progress} range={KUOHU_SCENE.etymology} still={still}>
        <p className="text-lg text-ink text-balance sm:text-xl">
          molten. to melt. the state a solid gives up.
        </p>
      </Staged>
      <Staged progress={progress} range={KUOHU_SCENE.gloss} still={still}>
        <p className="max-w-md text-sm text-muted text-balance">
          the psychology, not the physics.
        </p>
      </Staged>
    </motion.div>
  );
}

/**
 * The owner's cut for asserts: the lamp arrives alone and you just watch the
 * fluid. Then it is introduced by name, the word standing behind the glass and
 * the etymology read under it. Only once the naming has cleared does the scene
 * hand the lamp to its column and let the argument climb out, line by line.
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
  const lampTransform = useMotionTemplate`translate(calc(${glide} * var(--kuohu-reach, 0rem)), var(--kuohu-lift, 0px))`;

  return (
    <section
      ref={ref}
      data-stratum="asserts"
      data-pin-track
      className="relative h-[420svh] [--kuohu-lift:-50%] [--kuohu-reach:0rem] md:[--kuohu-lift:0px] md:[--kuohu-reach:max(-19rem,-24vw)]"
    >
      <SeamRow index={3} label="sula" bleed />
      <div
        data-pin
        className="sticky top-0 flex h-dvh items-center overflow-hidden md:h-svh"
      >
        <div
          className={`grid w-full items-center gap-8 md:grid-cols-2 md:gap-16 ${STRATUM}`}
        >
          <div className="order-2 flex flex-col gap-6 md:order-1">
            <div className="flex flex-col gap-3">
              <Staged progress={scene} range={KUOHU_SCENE.eyebrow}>
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                    asserts
                  </span>
                  <span className="font-mono text-xs text-muted">
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
              <Staged
                progress={scene}
                range={KUOHU_SCENE.credit}
                className="md:hidden"
              >
                <p className="font-mono text-[11px] text-muted">
                  ↳ kuohu · the surge of a boiling liquid
                </p>
              </Staged>
            </div>
          </div>

          <motion.div
            style={
              reduced
                ? undefined
                : ({
                    transform: lampTransform,
                    "--kuohu-glide": glide,
                  } as MotionStyle)
            }
            className="-z-10 absolute inset-x-0 top-2/3 order-1 flex flex-col items-center gap-4 [opacity:calc(0.26+0.74*var(--kuohu-glide,1))] max-md:-translate-y-1/2 md:relative md:top-auto md:z-0 md:order-2 md:translate-y-0 md:opacity-100"
          >
            <NameBehindGlass progress={scene} still={!!reduced} />
            <Kuohu />
            <Etymology progress={scene} still={!!reduced} />
            <Staged
              progress={scene}
              range={KUOHU_SCENE.credit}
              className="max-md:hidden"
            >
              <p className="font-mono text-[11px] text-muted">
                ↳ kuohu · the surge of a boiling liquid
              </p>
            </Staged>
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
          className="group flex flex-col items-center gap-1 whitespace-nowrap rounded-md p-2 outline-none focus-visible:ring-focus"
          style={{ textShadow: "0 2px 14px var(--usva-bg)" }}
        >
          <span className="text-xl font-extrabold tracking-[-0.03em] text-ink/65 transition-tint group-hover:text-ink sm:text-2xl">
            {entry.word}
          </span>
          <span className="hidden font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted transition-tint group-hover:text-ink sm:inline">
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
const ROOMS = {
  kajo: { Atmosphere: Kajastus, word: "kajastus" },
  sisu: { Atmosphere: Loimu, word: "loimu" },
  savi: { Atmosphere: Kynnos, word: "kynnös" },
} as const;

function Room() {
  const { theme } = useTheme();
  const { Atmosphere, word } = ROOMS[theme] ?? ROOMS.kajo;
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
    <div
      ref={ref}
      data-stratum="room"
      data-pin-track
      className="relative h-[250svh]"
    >
      <section
        data-pin
        className="sticky top-0 flex h-svh items-center overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <Atmosphere className="h-full w-full" opacity={0.85} />
          <div className="absolute inset-0 bg-bg/25" />
          <div className="absolute inset-x-0 top-0 h-[22%] bg-linear-to-b from-bg to-transparent" />
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
              ↳ {counts.atmospheres} of them. this one is {word}.
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
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end end"],
  });
  const depth = useSpring(scrollYProgress, WEIGHT);

  return (
    <div ref={rootRef} className="relative isolate">
      <Ground progress={depth} />
      <Rail active={active} visible={inDescent} />

      <section
        data-stratum="recedes"
        className={`relative flex min-h-svh items-center overflow-hidden ${STRATUM}`}
      >
        <SeamRow index={1} label="core · primitives" />
        <Ghost word="recedes" />
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
        className={`relative flex min-h-svh items-center overflow-hidden ${STRATUM}`}
      >
        <SeamRow index={2} label="core · patterns" />
        <Ghost word="structures" />
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
