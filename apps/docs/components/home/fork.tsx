"use client";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Link from "next/link";
import { useRef } from "react";
import {
  CheckIcon,
  CopyButton,
  CopyIcon,
  useCopy,
} from "@/components/copy-button";
import { PACKAGE_NAME, registryUrl } from "@/lib/site";
import { WEIGHT } from "./home-motion";
import { Scrub } from "./tiivistyma";

/**
 * On a phone there is no terminal to paste into and no room to scroll a long
 * command sideways, so the whole block is the control: tap it and it is on the
 * clipboard, for the laptop you will actually run it on. With a pointer the
 * command stays selectable text and the copy lives in its own button.
 */
function Command({ command }: { command: string }) {
  const { copied, copy } = useCopy(command);

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "copied" : `copy ${command}`}
        className="flex w-full items-start gap-3 rounded-lg border border-border bg-sunken px-4 py-3 text-left outline-none transition-tint duration-fast ease-soft active:border-accent focus-visible:ring-focus sm:hidden"
      >
        <code className="min-w-0 flex-1 break-all font-mono text-xs text-on-sunken">
          <span className="select-none text-accent-alt">$ </span>
          {command}
        </code>
        <span
          aria-hidden="true"
          className={`mt-0.5 shrink-0 transition-tint duration-fast ${
            copied ? "text-accent" : "text-faint"
          }`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </span>
      </button>

      <div className="hidden items-center gap-2 rounded-lg border border-border bg-sunken pr-2 pl-4 sm:flex">
        <pre className="min-w-0 flex-1 overflow-x-auto py-3 font-mono text-xs text-on-sunken">
          <code>
            <span className="select-none text-accent-alt">$ </span>
            {command}
          </code>
        </pre>
        <CopyButton value={command} />
      </div>
    </>
  );
}

function Trait({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2 text-sm text-muted">
      <span aria-hidden="true" className="font-mono text-faint">
        ↳
      </span>
      {children}
    </li>
  );
}

export function Fork() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  /* One way in splits into two: the panels part gently as you arrive, and
   * then the page stops moving for good. The solid end of the page. */
  const arrive = useSpring(scrollYProgress, WEIGHT);
  const left = useTransform(arrive, [0.3, 0.95], ["5%", "0%"]);
  const right = useTransform(arrive, [0.3, 0.95], ["-5%", "0%"]);

  return (
    <section
      ref={ref}
      className="mx-auto flex max-w-7xl flex-col justify-center px-6 py-[clamp(7rem,16vh,11rem)] sm:px-10 lg:min-h-[86svh]"
    >
      <Scrub>
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          two ways in. pick per component.
        </h2>
      </Scrub>
      <Scrub>
        <p className="mt-4 max-w-2xl text-muted">
          same source, two distributions. you are allowed to mix them in one
          project, and most people should: install the boring parts, own the
          loud ones.
        </p>
      </Scrub>

      <div className="relative mt-12">
        <div className="grid overflow-hidden rounded-2xl border border-border bg-surface/25 shadow-floating sm:grid-cols-2">
          <motion.div
            style={reduced ? undefined : { x: left }}
            className="flex min-w-0 flex-col gap-4 border-border border-b p-6 sm:border-r sm:border-b-0 sm:p-10"
          >
            <h3 className="text-lg font-semibold text-ink">install it</h3>
            <p className="text-sm leading-relaxed text-muted">
              you want fixes to arrive on their own.{" "}
              <span className="font-mono text-ink">bun update</span> and the
              whole surface moves. you do not intend to touch the internals.
            </p>
            <Command command={`bun add ${PACKAGE_NAME}`} />
            <ul className="flex flex-col gap-2">
              <Trait>updates propagate</Trait>
              <Trait>one version across apps</Trait>
              <Trait>internals stay mine</Trait>
            </ul>
          </motion.div>

          <motion.div
            style={reduced ? undefined : { x: right }}
            className="flex min-w-0 flex-col gap-4 p-6 sm:p-10"
          >
            <h3 className="text-lg font-semibold text-ink">own it</h3>
            <p className="text-sm leading-relaxed text-muted">
              you want the source in your repo. shadcn-compatible: it copies{" "}
              <span className="text-ink">the same file the package ships</span>,
              byte for byte, and then it is yours to wreck.
            </p>
            <Command command={`npx shadcn add ${registryUrl("button")}`} />
            <ul className="flex flex-col gap-2">
              <Trait>source lands in your tree</Trait>
              <Trait>fork freely, no upstream</Trait>
              <Trait>ci asserts parity with the package</Trait>
            </ul>
          </motion.div>
        </div>
        <p className="mt-8 text-sm text-muted">
          the long version, with both paths spelled out:{" "}
          <Link
            href="/docs/get-started/installation"
            className="rounded font-mono text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-focus"
          >
            /docs/get-started/installation ↗
          </Link>
        </p>
      </div>
    </section>
  );
}
