"use client";
import { MockupShowcase } from "@usva-ui/react/patterns/mockup-showcase";
import {
  type MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Scrub } from "./tiivistyma";

const ink = "var(--usva-ink)";
const muted = "var(--usva-muted)";
const faint = "var(--usva-faint)";
const border = "var(--usva-border)";
const surface = "var(--usva-surface)";
const accent = "var(--usva-accent)";

/**
 * The section is pinned and the two apps are *built* while you hold it: the
 * same vocabulary assembling into a page you look at once and a dashboard you
 * live inside. Nothing here fades in, because nothing here is fog: these are
 * the two real consumers, and they arrive as parts.
 */
const useStage = (
  build: MotionValue<number>,
  from: number,
  to: number,
  a: number | string,
  b: number | string,
) => useTransform(build, [from, to], [a, b]);

/** One row of a screen, so its hooks stay at the top level of a component. */
function Part({
  build,
  at,
  axis,
  from,
  children,
  className,
  style,
}: {
  build: MotionValue<number>;
  at: number;
  axis: "x" | "y";
  from: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const offset = useStage(build, at, at + 0.12, from, 0);
  const opacity = useStage(build, at, at + 0.12, 0, 1);

  return (
    <motion.div
      style={{ [axis]: offset, opacity, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function useCompact(): boolean {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767.98px)");
    const sync = () => setCompact(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return compact;
}

function Screen({
  theme,
  url,
  compact,
  children,
}: {
  theme: "kajo" | "sisu";
  url: string;
  compact: boolean;
  children: React.ReactNode;
}) {
  return (
    <MockupShowcase
      aria-hidden="true"
      frame={compact ? "device" : "browser"}
      url={url}
      aspect={compact ? "9/16" : "16/10"}
      className={compact ? "mx-auto w-full max-w-[17rem]" : undefined}
    >
      <div
        data-theme={theme}
        className="h-full overflow-hidden p-4"
        style={{ background: "var(--usva-bg)", color: ink }}
      >
        {children}
      </div>
    </MockupShowcase>
  );
}

const WORK = [
  { name: "sisu-plus", kind: "browser extension", year: "2026" },
  { name: "usva.", kind: "design system", year: "2026" },
];

function KajoScreen({
  build,
  compact,
}: {
  build: MotionValue<number>;
  compact: boolean;
}) {
  const navY = useStage(build, 0.04, 0.2, -64, 0);
  const titleY = useStage(build, 0.16, 0.36, "115%", "0%");
  const eyebrowY = useStage(build, 0.3, 0.42, "115%", "0%");
  const cardA = useStage(build, 0.34, 0.52, 28, 0);
  const cardB = useStage(build, 0.4, 0.58, 28, 0);
  const cardScaleA = useStage(build, 0.34, 0.52, 0.9, 1);
  const cardScaleB = useStage(build, 0.4, 0.58, 0.9, 1);
  const barScale = useStage(build, 0.54, 0.72, 0, 1);
  /* The bars grew out of nothing while their own caption sat there from the
   * first frame, which read as a label waiting for its chart. */
  const nowPlaying = useStage(build, 0.54, 0.72, 0, 1);
  const cards = [
    { y: cardA, scale: cardScaleA },
    { y: cardB, scale: cardScaleB },
  ];

  return (
    <Screen theme="kajo" url="matt-pasek.dev" compact={compact}>
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-lg p-4"
        style={{
          backgroundImage:
            "radial-gradient(120% 95% at 80% -15%, color-mix(in srgb, var(--usva-accent) 42%, transparent), transparent 62%), radial-gradient(95% 85% at 0% 115%, color-mix(in srgb, var(--usva-accent-alt) 24%, transparent), transparent 60%)",
        }}
      >
        <motion.div
          style={{
            y: navY,
            borderColor: "var(--usva-border-strong)",
            background: "color-mix(in srgb, var(--usva-bg) 55%, transparent)",
          }}
          className="mx-auto flex items-center gap-3 rounded-full border px-3 py-1.5"
        >
          <span className="text-[11px] font-bold" style={{ color: ink }}>
            matt<span style={{ color: "var(--usva-accent-alt)" }}>.</span>
          </span>
          {["work", "playground", "mail"].map((item) => (
            <span key={item} className="text-[10px]" style={{ color: muted }}>
              {item}
            </span>
          ))}
        </motion.div>

        <span className="mt-6 block overflow-hidden">
          <motion.span
            style={{ y: titleY }}
            className="block text-2xl font-extrabold leading-[1.05] tracking-tight sm:text-[1.75rem]"
          >
            build things
            <br />
            that hold up
            <span style={{ color: "var(--usva-accent-alt)" }}>.</span>
          </motion.span>
        </span>

        <div className="mt-auto flex flex-col gap-1.5">
          <span className="block overflow-hidden">
            <motion.span
              style={{ y: eyebrowY, color: muted }}
              className="block font-mono text-[9px] uppercase tracking-[0.22em]"
            >
              selected work
            </motion.span>
          </span>
          <div className="grid grid-cols-2 gap-2">
            {WORK.map((item, index) => (
              <motion.div
                key={item.name}
                style={{
                  ...cards[index],
                  borderColor: "var(--usva-border-strong)",
                  background:
                    "color-mix(in srgb, var(--usva-surface) 60%, transparent)",
                }}
                className="flex flex-col gap-0.5 rounded-lg border p-2.5"
              >
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: ink }}
                >
                  {item.name}
                </span>
                <span className="text-[9px]" style={{ color: muted }}>
                  {item.kind} · {item.year}
                </span>
              </motion.div>
            ))}
          </div>
          <motion.div
            style={{ opacity: nowPlaying }}
            className="mt-1 flex items-center gap-2"
          >
            <span aria-hidden="true" className="flex items-end gap-0.5">
              {[3, 6, 4, 7].map((height, index) => (
                <motion.span
                  // biome-ignore lint/suspicious/noArrayIndexKey: a fixed decorative bar chart
                  key={index}
                  style={{ scaleY: barScale, height: `${height}px` }}
                  className="w-0.5 origin-bottom rounded-full bg-accent-alt"
                />
              ))}
            </span>
            <span className="font-mono text-[9px]" style={{ color: muted }}>
              now playing · sigur rós
            </span>
          </motion.div>
        </div>
      </div>
    </Screen>
  );
}

const COURSES = [
  { code: "TIEA341", name: "functional programming", ects: "5", state: "done" },
  { code: "TIES324", name: "distributed systems", ects: "4", state: "active" },
  { code: "ITKP102", name: "data structures", ects: "6", state: "active" },
];

const DEADLINES = [
  { when: "mon", what: "moodle · lab 4", late: false },
  { when: "thu", what: "enrolment closes", late: true },
];

function SisuScreen({
  build,
  compact,
}: {
  build: MotionValue<number>;
  compact: boolean;
}) {
  /* sisu does not perform: it fills. The bar climbs to the real number and the
   * rows tick in like data arriving, which is exactly what they are. */
  const railX = useStage(build, 0.06, 0.24, -110, 0);
  const bar = useStage(build, 0.22, 0.55, 0, 0.79);
  const ects = useTransform(build, [0.22, 0.55], [0, 142]);
  const shown = useTransform(ects, (v) => `${Math.round(v)} / 180 ects`);

  return (
    <Screen theme="sisu" url="sisu-plus · extension" compact={compact}>
      <div className="flex h-full gap-3">
        <motion.div
          style={{ x: railX, borderColor: border }}
          className="hidden w-24 shrink-0 flex-col gap-1 border-r pr-2.5 sm:flex"
        >
          <span className="pb-1.5 text-[11px] font-bold" style={{ color: ink }}>
            sisu<span style={{ color: accent }}>+</span>
          </span>
          {["dashboard", "timeline", "structure", "enrolments"].map(
            (item, index) => (
              <span
                key={item}
                className="rounded px-2 py-1 text-[10px]"
                style={
                  index === 0
                    ? { background: surface, color: ink }
                    : { color: muted }
                }
              >
                {item}
              </span>
            ),
          )}
        </motion.div>

        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold" style={{ color: ink }}>
              degree progress
            </span>
            <motion.span
              className="font-mono text-[10px] tabular-nums"
              style={{ color: muted }}
            >
              {shown}
            </motion.span>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full"
            style={{ background: "var(--usva-sunken)" }}
          >
            <motion.div
              className="h-full origin-left rounded-full"
              style={{ scaleX: bar, background: accent }}
            />
          </div>

          <span
            className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em]"
            style={{ color: faint }}
          >
            active courses
          </span>
          <div className="flex flex-col">
            {COURSES.map((course, index) => (
              <Part
                key={course.code}
                build={build}
                at={0.4 + index * 0.07}
                axis="x"
                from={-18}
                style={{ borderColor: border }}
                className="flex items-center gap-2 border-b py-1.5 last:border-b-0"
              >
                <span
                  className="w-16 shrink-0 font-mono text-[10px]"
                  style={{ color: course.state === "done" ? faint : accent }}
                >
                  {course.code}
                </span>
                <span
                  className="min-w-0 flex-1 truncate text-[11px]"
                  style={{ color: course.state === "done" ? muted : ink }}
                >
                  {course.name}
                </span>
                <span
                  className="font-mono text-[10px] tabular-nums"
                  style={{ color: muted }}
                >
                  {course.ects} op
                </span>
              </Part>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-1">
            <span
              className="font-mono text-[9px] uppercase tracking-[0.2em]"
              style={{ color: faint }}
            >
              deadlines
            </span>
            {DEADLINES.map((item, index) => (
              <Part
                key={item.what}
                build={build}
                at={0.62 + index * 0.06}
                axis="y"
                from={10}
                style={{ background: surface }}
                className="flex items-center justify-between rounded px-2 py-1"
              >
                <span className="text-[10px]" style={{ color: ink }}>
                  {item.what}
                </span>
                <span
                  className="font-mono text-[10px]"
                  style={{ color: item.late ? "var(--usva-danger)" : muted }}
                >
                  {item.when}
                </span>
              </Part>
            ))}
          </div>
        </div>
      </div>
    </Screen>
  );
}

export function Witnesses() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const build = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.6,
  });

  const still = useSpring(1, { stiffness: 100, damping: 30 });
  const b = reduced ? still : build;
  const compact = useCompact();

  return (
    <section ref={ref} data-pin-track className="relative md:h-[280svh]">
      <div
        data-pin="self-padded"
        className="flex items-center overflow-hidden md:sticky md:top-0 md:min-h-svh"
      >
        <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-10">
          <Scrub>
            <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">
              designed for my work, opened for yours.
            </h2>
          </Scrub>
          <Scrub>
            <p className="mt-5 max-w-2xl text-muted">
              the test of a design system is{" "}
              <span className="text-ink">what it already runs</span>. usva runs{" "}
              <span className="text-ink">
                two apps that pull in opposite directions
              </span>
              , off one vocabulary. watch them build.
            </p>
          </Scrub>

          <div className="mt-12 grid min-w-0 gap-10 md:grid-cols-2 lg:gap-14">
            <div className="flex min-w-0 flex-col gap-5">
              <KajoScreen build={b} compact={compact} />
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-lg font-semibold">
                    <a
                      href="https://matt-pasek.dev"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded text-ink underline-offset-4 hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-focus"
                    >
                      personal-website ↗
                    </a>
                  </h3>
                  <Link
                    href="/themes/kajo"
                    className="rounded font-mono text-xs text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-focus"
                  >
                    kajo
                  </Link>
                </div>
                <p className="text-sm text-muted">
                  the beauty pole. it is allowed to be loud, because you look at
                  it once and leave.
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-5">
              <SisuScreen build={b} compact={compact} />
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-3">
                  <h3 className="text-lg font-semibold">
                    <a
                      href="https://sisu-plus.matt-pasek.dev"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded text-ink underline-offset-4 hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-focus"
                    >
                      sisu-plus ↗
                    </a>
                  </h3>
                  <Link
                    href="/themes/sisu"
                    className="rounded font-mono text-xs text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-focus"
                  >
                    sisu
                  </Link>
                </div>
                <p className="text-sm text-muted">
                  the usability pole. students live inside it all term, so
                  nothing here gets to shimmer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
