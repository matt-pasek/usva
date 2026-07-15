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

/**
 * The hero is pinned for 240svh: 40 of them are yours, then the rest of the
 * page arrives over it on a crest (the -mt-[100svh] surface in page.tsx).
 * On load the väre atmosphere floods up out of the floor as one mass, and the
 * copy climbs out of its masks while the flood is still settling.
 */
const FLOOD_S = 1.9;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  /* While the crest rides over it the hero recedes: it sinks a little,
   * shrinks a little, and the light on it goes down. All of it scrubbed,
   * so backing up brings it back. */
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
          className="mx-auto w-full max-w-6xl px-6 pt-[clamp(7rem,16vh,10rem)] pb-[clamp(4rem,10vh,7rem)] sm:px-10"
        >
          <Rise delay={0.7}>
            <p className="text-xl font-extrabold leading-none tracking-[-0.02em] text-ink sm:text-2xl">
              usva<span className="text-accent-alt">.</span>
            </p>
          </Rise>

          <h1 className="mt-6 max-w-[16ch] text-[clamp(2.75rem,13vw,6rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink">
            <Rise as="span" delay={0.82}>
              beauty that
            </Rise>
            <Rise as="span" delay={0.94}>
              stays <span className="text-accent">usable.</span>
            </Rise>
          </h1>

          <Rise delay={1.12}>
            <p className="mt-8 max-w-[62ch] text-lg leading-relaxed text-muted">
              a design system has one honest credential:{" "}
              <span className="text-ink">what it already runs</span>. this one
              runs{" "}
              <span className="text-ink">
                two apps that pull in opposite directions
              </span>
              , off one vocabulary. everything below is the evidence. none of it
              is a pitch.
            </p>
          </Rise>

          <Rise delay={1.24}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild variant="onSurface" size="lg">
                <Link href="/docs/get-started">read the docs →</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/design-language">the design language</Link>
              </Button>
            </div>
          </Rise>

          <Rise delay={1.34}>
            <p className="mt-5 font-mono text-xs tracking-wide text-muted tabular-nums">
              {counts.total} components · {counts.themes} themes ·{" "}
              {counts.atmospheres} atmospheres
            </p>
          </Rise>
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
