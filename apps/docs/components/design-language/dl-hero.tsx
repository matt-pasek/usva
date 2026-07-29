"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import Link from "next/link";
import { Kajastus } from "usva/atmospheres/kajastus";
import { Button } from "usva/primitives/button";
import { Wordmark } from "@/components/wordmark";
import { lexeme } from "@/lib/lexicon";

const USVA = lexeme("usva");

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function DesignLanguageHero() {
  const reduced = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden rounded-[28px] border border-border">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Kajastus className="size-full" opacity={0.7} speed={0.6} />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-r from-bg via-bg/85 to-bg/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-bg via-transparent to-transparent"
      />

      <motion.div
        variants={reduced ? undefined : container}
        initial={reduced ? undefined : "hidden"}
        animate={reduced ? undefined : "show"}
        className="flex max-w-2xl flex-col gap-5 px-6 py-12 sm:px-10 sm:py-16 lg:py-20"
      >
        <motion.span
          variants={reduced ? undefined : item}
          className="font-mono text-[0.7rem] text-muted uppercase tracking-[0.22em]"
        >
          the design language
        </motion.span>

        <motion.p variants={reduced ? undefined : item}>
          <Wordmark className="text-[clamp(3.25rem,13cqi,6.5rem)]" />
        </motion.p>

        <motion.h1
          variants={reduced ? undefined : item}
          className="max-w-xl font-semibold text-[clamp(1.35rem,4cqi,2rem)] text-ink leading-[1.1] tracking-[-0.02em]"
        >
          the rules, and why they are the rules
        </motion.h1>

        <motion.p
          variants={reduced ? undefined : item}
          className="max-w-xl text-lg text-muted"
        >
          <span className="text-ink">usva is {USVA?.sense}.</span>{" "}
          {USVA?.reading}
        </motion.p>

        <motion.div
          variants={reduced ? undefined : item}
          className="mt-1 flex flex-wrap items-center gap-3"
        >
          <Button asChild variant="onSurface">
            <Link href="/design-language/intensity">see the dial →</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/design-language/color">start with colour</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
