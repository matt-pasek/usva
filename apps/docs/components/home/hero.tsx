"use client";
import { Button, Vare } from "@matt-pasek/usva";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import { counts } from "@/lib/catalog";
import { HEAVE } from "./home-motion";
import { Rise } from "./tiivistyma";

const FLOOD_S = 1.9;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const copyY = useTransform(scrollYProgress, [0.15, 0.6], [0, -70]);
  const copyScale = useTransform(scrollYProgress, [0.15, 0.6], [1, 0.965]);
  const dim = useTransform(scrollYProgress, [0.18, 0.55], [1, 0.4]);
  const cue = useTransform(scrollYProgress, [0.02, 0.1], [1, 0]);

  const flood = reduced
    ? {}
    : {
        initial: { clipPath: "inset(100% 0% 0% 0%)" },
        animate: { clipPath: "inset(0% 0% 0% 0%)" },
        transition: { duration: FLOOD_S, ease: HEAVE },
      };
  const settle = reduced
    ? {}
    : {
        initial: { y: "7%", scale: 1.04 },
        animate: { y: "0%", scale: 1 },
        transition: { duration: FLOOD_S + 0.4, ease: HEAVE },
      };

  return (
    <div ref={ref} className="-mt-20 relative h-[240svh] sm:-mt-24">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <motion.div
          aria-hidden="true"
          {...flood}
          className="absolute inset-0 -z-10"
        >
          <motion.div {...settle} className="h-full w-full origin-bottom">
            <Vare interactive className="h-full w-full" />
          </motion.div>
        </motion.div>

        <motion.div
          style={
            reduced ? undefined : { y: copyY, scale: copyScale, opacity: dim }
          }
          className="mx-auto w-full max-w-306 px-5 sm:px-10"
        >
          <div className="@container relative mx-auto w-full max-w-6xl">
            <Rise delay={0.7}>
              <p className="text-center text-xl font-extrabold leading-none tracking-[-0.02em] text-ink sm:text-3xl @5xl:text-left">
                usva<span className="text-accent-alt">.</span>
              </p>
            </Rise>

            <h1 className="mt-3 text-[clamp(3rem,15.5cqi,11.5rem)] leading-[0.9] tracking-[-0.04em] text-ink sm:mt-4">
              <Rise as="span" delay={0.82} from={150}>
                <span className="flex flex-wrap items-baseline justify-center gap-x-[0.06em] font-extrabold @5xl:justify-start">
                  beauty
                  <span className="font-bold text-[0.53em] tracking-tighter">
                    that stays
                  </span>
                </span>
              </Rise>

              <Rise
                as="span"
                delay={0.94}
                from={150}
                bleed="pr-[0.02em]"
                className="mt-1 text-center @5xl:mt-[-0.32em] @5xl:translate-x-[3%] @5xl:text-right"
              >
                <span className="font-bold text-accent">usable.</span>
              </Rise>
            </h1>

            <Rise delay={1.34}>
              <p className="mt-2 text-center font-mono font-bold text-xs tracking-wide text-muted tabular-nums @5xl:text-right">
                {counts.total} components · {counts.themes} themes ·{" "}
                {counts.atmospheres} atmospheres
              </p>
            </Rise>

            <Rise
              delay={1.12}
              className="mt-5 @5xl:absolute @5xl:right-[44.5%] @5xl:bottom-8 @5xl:mt-0 @5xl:w-[50%]"
            >
              <p className="mx-auto max-w-[52ch] text-center text-base leading-relaxed text-muted sm:text-lg @5xl:mx-0 @5xl:max-w-none @5xl:text-right">
                a design system has one honest credential:{" "}
                <span className="text-ink">what it already runs</span>. usva
                runs{" "}
                <span className="text-ink">
                  two apps that pull in opposite directions
                </span>
                , off one vocabulary. everything below is the evidence, not a
                pitch.
              </p>
            </Rise>
          </div>

          <div className="flex flex-col">
            <Rise delay={1.24} bleed="pt-2">
              <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
                <Button asChild variant="onSurface" size="lg">
                  <Link href="/docs/get-started">read the docs →</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/design-language">the design language</Link>
                </Button>
              </div>
            </Rise>
          </div>
        </motion.div>

        <motion.div
          aria-hidden="true"
          style={reduced ? undefined : { opacity: cue }}
          className="-translate-x-1/2 absolute bottom-7 left-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.3em] text-faint">
            the evidence
          </span>
          <span className="h-8 w-px bg-linear-to-b from-faint to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}
