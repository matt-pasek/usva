"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { SegmentedControl } from "usva/patterns/segmented-control";
import { type ThemeId, useTheme } from "@/components/theme-provider";
import { lexeme } from "@/lib/lexicon";
import { THEME_DOCS, THEME_ORDER } from "@/lib/themes";
import { COOL } from "./home-motion";
import { Drift, Scrub } from "./tiivistyma";

const ITEMS = THEME_ORDER.map((id) => ({ value: id, label: id }));

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
  const doc = THEME_DOCS[theme];
  const lex = lexeme(theme);
  const atmoLex = lexeme(doc.atmosphere.word);

  return (
    <section className="relative isolate py-[clamp(7rem,16vh,11rem)] lg:min-h-svh">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <Scrub>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            you are reading this in {doc.id}
            <span className="text-accent-alt">.</span>
          </h2>
        </Scrub>
        <Scrub>
          <p className="mt-4 max-w-2xl text-muted">
            {THEME_ORDER.length} themes, one vocabulary. switch it here. nothing
            forks.
          </p>
        </Scrub>
      </div>

      <Drift className="mt-12">
        <div className="relative overflow-hidden border-border border-y bg-surface/20">
          <div className="mx-auto grid max-w-[100rem] lg:grid-cols-[auto_minmax(0,1fr)]">
            <div className="flex items-center justify-center border-border border-b px-6 py-4 sm:px-10 lg:items-start lg:justify-center lg:border-r lg:border-b-0 lg:px-6 lg:py-8">
              <SegmentedControl
                aria-label="choose theme"
                className="lg:hidden"
                items={ITEMS}
                value={theme}
                onValueChange={(value) => setTheme(value as ThemeId)}
              />
              <SegmentedControl
                aria-label="choose theme"
                orientation="vertical"
                className="hidden lg:inline-flex"
                items={ITEMS}
                value={theme}
                onValueChange={(value) => setTheme(value as ThemeId)}
              />
            </div>

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
                className="relative min-w-0 overflow-hidden lg:min-h-152"
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
                  className="pointer-events-none absolute top-[-0.18em] right-[-0.04em] select-none font-extrabold text-[clamp(7rem,23vw,21rem)] text-border-strong/50 leading-none tracking-[-0.04em]"
                >
                  {doc.id}
                </span>

                <div className="relative grid min-w-0 gap-12 px-6 py-14 sm:px-10 sm:py-16 lg:grid-cols-[0.86fr_1.14fr] lg:gap-[clamp(4rem,8vw,9rem)] lg:px-[clamp(3rem,7vw,7rem)] lg:py-20">
                  <div className="flex max-w-md flex-col gap-4">
                    <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                      theme {doc.index} of {THEME_ORDER.length}
                    </p>
                    <h3
                      id={`theme-specimen-${theme}`}
                      className="text-5xl font-extrabold tracking-[-0.04em] text-ink sm:text-6xl"
                    >
                      {doc.id}
                    </h3>
                    <p className="font-mono text-sm text-accent-alt">
                      {lex?.sense}. {lex?.reading}
                    </p>
                    <p className="max-w-sm text-muted">{doc.capsule}</p>

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

                  <div className="flex max-w-xl flex-col gap-7 lg:pt-16">
                    <dl className="flex flex-col gap-7">
                      <div className="flex flex-col gap-1.5">
                        <dt className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                          atmosphere
                        </dt>
                        <dd className="text-ink">
                          <span className="font-mono">
                            {doc.atmosphere.word}
                          </span>{" "}
                          · {atmoLex?.sense}; {atmoLex?.reading}
                        </dd>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <dt className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
                          use it for
                        </dt>
                        <dd className="text-ink">{doc.forThis.join(", ")}.</dd>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <dt className="font-mono text-xs uppercase tracking-[0.25em] text-danger">
                          do not use it for
                        </dt>
                        <dd className="text-ink">{doc.notThis.join(", ")}.</dd>
                      </div>
                    </dl>
                    <Link
                      href={`/themes/${theme}`}
                      className="mt-1 inline-flex w-fit rounded font-mono text-xs text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-focus"
                    >
                      ↳ full showcase at /themes/{theme}
                    </Link>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </Drift>
    </section>
  );
}
