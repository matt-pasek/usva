"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { type ThemeId, useTheme } from "@/components/theme-provider";
import { COOL } from "./home-motion";
import { Drift, Scrub } from "./tiivistyma";

interface ThemeNote {
  word: string;
  index: number;
  gloss: string;
  etymology: string;
  description: string;
  atmosphere: string;
  atmosphereNote: string;
  forThis: string;
  notThis: string;
}

const ORDER: ThemeId[] = ["kajo", "sisu", "savi"];

const NOTES: Record<ThemeId, ThemeNote> = {
  kajo: {
    word: "kajo",
    index: 1,
    gloss: "faint glow",
    etymology: "faint glow, the light a city throws on a low cloud",
    description:
      "violet dark, generous radius, real glow. the expressive pole, built for a page you look at rather than work in.",
    atmosphere: "kajastus",
    atmosphereNote:
      "a slow violet aurora that never resolves into a shape. it drifts behind the content and never asks for the pointer.",
    forThis:
      "portfolios and launch pages, anything whose job is to be looked at, a hero that has to land in one second.",
    notThis:
      "settings screens, tables, logs, dense forms, anything a person operates for eight hours.",
  },
  sisu: {
    word: "sisu",
    index: 2,
    gloss: "grit",
    etymology: "grit, what keeps going after the courage has run out",
    description:
      "near-black, tight radius, edges doing the structuring. the usability pole, and it has nothing to prove.",
    atmosphere: "kynnös",
    atmosphereNote:
      "a tilled furrow, low and slow. it sits far enough back that a table can be read straight through it.",
    forThis:
      "a dashboard somebody keeps open all day, dense tables, forms, anything operated rather than admired.",
    notThis:
      "a hero. it will not perform for you, and nothing here is allowed to shimmer.",
  },
  savi: {
    word: "savi",
    index: 3,
    gloss: "clay",
    etymology: "clay, the material before it is a thing: warm, matte, worked",
    description:
      "warm light, paper rather than screen. proof that the system is not a mood that only works in the dark.",
    atmosphere: "kuulto",
    atmosphereNote:
      "translucence. the softest of them, and the only one drawn against a light ground rather than black.",
    forThis:
      "reading. documentation, long prose, anything that might leave the browser and land on paper.",
    notThis:
      "an atmosphere at full strength. most of them were drawn against black and will blow out here.",
  },
};

const SWATCHES = [
  { role: "bg", var: "var(--usva-bg)" },
  { role: "surface", var: "var(--usva-surface)" },
  { role: "accent", var: "var(--usva-accent)" },
  { role: "accent-alt", var: "var(--usva-accent-alt)" },
  { role: "ink", var: "var(--usva-ink)" },
];

export function StandingIn() {
  const { theme, setTheme } = useTheme();
  const reduced = useReducedMotion();
  const note = NOTES[theme];

  return (
    <section className="relative isolate py-[clamp(7rem,16vh,11rem)] lg:min-h-[100svh]">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <Scrub>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            you are reading this in {note.word}
            <span className="text-accent-alt">.</span>
          </h2>
        </Scrub>
        <Scrub>
          <p className="mt-4 max-w-2xl text-muted">
            {ORDER.length} themes, one vocabulary. switch it here. nothing
            forks.
          </p>
        </Scrub>
      </div>

      <Drift className="mt-12">
        <div className="relative overflow-hidden border-border border-y bg-surface/20">
          <div className="mx-auto grid max-w-[100rem] lg:grid-cols-[6.5rem_minmax(0,1fr)]">
            <fieldset className="flex min-w-0 gap-2 border-border border-b px-6 py-4 sm:px-10 lg:flex-col lg:border-r lg:border-b-0 lg:px-4 lg:py-8">
              <legend className="sr-only">choose theme</legend>
              {ORDER.map((candidate) => {
                const active = candidate === theme;
                return (
                  <button
                    key={candidate}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setTheme(candidate)}
                    className={`min-h-11 flex-1 rounded-lg border px-3 font-mono text-xs outline-none transition-[color,background-color,border-color,transform] duration-fast ease-soft active:scale-96 focus-visible:ring-focus lg:flex-none ${
                      active
                        ? "border-border-strong bg-surface-2 text-accent"
                        : "border-transparent text-muted hover:border-border hover:text-ink"
                    }`}
                  >
                    {candidate}
                  </button>
                );
              })}
            </fieldset>

            <AnimatePresence mode="wait">
              <motion.article
                key={theme}
                aria-labelledby={`theme-specimen-${theme}`}
                initial={
                  reduced ? false : { opacity: 0, filter: "blur(10px)", y: -8 }
                }
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                exit={
                  reduced
                    ? undefined
                    : { opacity: 0, filter: "blur(10px)", y: -6 }
                }
                transition={{ duration: 0.55, ease: COOL }}
                className="relative min-w-0 overflow-hidden lg:min-h-[38rem]"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{
                    backgroundImage:
                      "radial-gradient(75% 85% at 5% 0%, color-mix(in oklab, var(--usva-accent) 24%, transparent), transparent 68%), radial-gradient(65% 70% at 95% 100%, color-mix(in oklab, var(--usva-accent-alt) 16%, transparent), transparent 72%)",
                  }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-[0.18em] right-[-0.04em] select-none font-extrabold text-[clamp(7rem,23vw,21rem)] text-border-strong/50 leading-none tracking-[-0.04em]"
                >
                  {note.word}
                </span>

                <div className="relative grid min-w-0 gap-12 px-6 py-14 sm:px-10 sm:py-16 lg:grid-cols-[0.86fr_1.14fr] lg:gap-[clamp(4rem,8vw,9rem)] lg:px-[clamp(3rem,7vw,7rem)] lg:py-20">
                  <div className="flex max-w-md flex-col gap-4">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                      theme {note.index} of {ORDER.length}
                    </p>
                    <h3
                      id={`theme-specimen-${theme}`}
                      className="text-5xl font-extrabold tracking-[-0.04em] text-ink sm:text-6xl"
                    >
                      {note.word}
                    </h3>
                    <p className="font-mono text-sm text-accent-alt">
                      {note.etymology}
                    </p>
                    <p className="max-w-sm text-muted">{note.description}</p>

                    <ul className="mt-3 flex items-center gap-2">
                      {SWATCHES.map((swatch) => (
                        <li
                          key={swatch.role}
                          title={swatch.role}
                          className="size-9 rounded-lg border border-border"
                          style={{ background: swatch.var }}
                        />
                      ))}
                    </ul>
                  </div>

                  <dl className="flex max-w-xl flex-col gap-7 lg:pt-16">
                    <div className="flex flex-col gap-1.5">
                      <dt className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                        atmosphere
                      </dt>
                      <dd className="text-ink">
                        <span className="font-mono">{note.atmosphere}</span> ·{" "}
                        {note.atmosphereNote}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <dt className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                        use it for
                      </dt>
                      <dd className="text-ink">{note.forThis}</dd>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <dt className="font-mono text-xs uppercase tracking-[0.25em] text-danger">
                        do not use it for
                      </dt>
                      <dd className="text-ink">{note.notThis}</dd>
                    </div>
                    <Link
                      href={`/themes/${theme}`}
                      className="mt-1 inline-flex w-fit rounded font-mono text-xs text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-focus"
                    >
                      ↳ full showcase at /themes/{theme}
                    </Link>
                  </dl>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </Drift>
    </section>
  );
}
