"use client";
import {
  type MotionValue,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { type ReactNode, type RefObject, useRef } from "react";
import { HEAVE, type Span, WEIGHT } from "./home-motion";

/**
 * tiivistymä: condensate.
 *
 * Nothing on this page fires on viewport entry. Copy climbs out from behind
 * its own edge as a continuous function of scroll: scrub back and it climbs
 * back in. The one exception is the hero, which is allowed a single load
 * gesture because there is no scroll yet to author it with.
 */

const RISE_FROM = 112;

const MASK = "overflow-hidden [clip-path:inset(0)] [transform:translateZ(0)]";
const LAYER = "[backface-visibility:hidden] will-change-transform";

interface MaskProps {
  children: ReactNode;
  className?: string;
  /** The mask has no padding, so a descender or a glow needs room to hang. */
  bleed?: string;
  /** `span` when the mask has to sit inside a heading or a paragraph. */
  as?: "div" | "span";
}

function usePercentY(progress: MotionValue<number>, from = RISE_FROM) {
  const y = useTransform(progress, [0, 1], [from, 0]);
  return useMotionTemplate`${y}%`;
}

function MaskedLine({
  children,
  className,
  bleed = "pb-[0.14em]",
  as = "div",
  y,
}: MaskProps & { y: MotionValue<string> }) {
  const Mask = as === "span" ? "span" : "div";
  const Inner = as === "span" ? motion.span : motion.div;
  const block = as === "span" ? "block" : "";

  return (
    <Mask className={`${block} ${MASK} ${bleed} ${className ?? ""}`}>
      <Inner style={{ y }} className={`${block} ${LAYER}`}>
        {children}
      </Inner>
    </Mask>
  );
}

function Static({ children, className, as = "div" }: MaskProps) {
  const Tag = as === "span" ? "span" : "div";
  return <Tag className={className}>{children}</Tag>;
}

export interface RiseProps extends MaskProps {
  delay?: number;
  duration?: number;
  /**
   * How far below the mask the line starts, in % of its own box. Type set
   * tighter than its glyphs (leading below 1) overflows its box, so 112 is
   * not enough to hide it: the hero's display lines need more.
   */
  from?: number;
}

/** The hero's load gesture: a line of type climbing out from behind its edge. */
export function Rise({
  children,
  delay = 0,
  duration = 1.05,
  from = RISE_FROM,
  bleed = "pb-[0.14em]",
  as = "div",
  className,
}: RiseProps) {
  const reduced = useReducedMotion();
  if (reduced) {
    return (
      <Static as={as} className={className}>
        {children}
      </Static>
    );
  }

  const Mask = as === "span" ? "span" : "div";
  const Inner = as === "span" ? motion.span : motion.div;
  const block = as === "span" ? "block" : "";

  return (
    <Mask className={`${block} ${MASK} ${bleed} ${className ?? ""}`}>
      <Inner
        initial={{ y: `${from}%` }}
        animate={{ y: "0%" }}
        transition={{ duration, ease: HEAVE, delay }}
        className={`${block} ${LAYER}`}
      >
        {children}
      </Inner>
    </Mask>
  );
}

export interface ScrubProps extends MaskProps {
  /** Where in the viewport the climb starts and completes. */
  offset?: [string, string];
}

/**
 * A masked line driven by its own position in the viewport. It climbs out as
 * it approaches the middle of the screen and climbs back if you reverse. The
 * spring is the weight: the type lags the wheel and settles.
 */
export function Scrub({
  children,
  className,
  bleed,
  as,
  offset = ["start 98%", "start 72%"],
}: ScrubProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ["start start", "end end"],
  });
  const weighted = useSpring(scrollYProgress, WEIGHT);
  const y = usePercentY(weighted);

  if (reduced) {
    return (
      <Static as={as} className={className}>
        {children}
      </Static>
    );
  }

  return (
    <div ref={ref as RefObject<HTMLDivElement>}>
      <MaskedLine as={as} className={className} bleed={bleed} y={y}>
        {children}
      </MaskedLine>
    </div>
  );
}

export interface StagedProps extends MaskProps {
  /** A scene's progress, usually a pinned section's own scroll. */
  progress: MotionValue<number>;
  /** The slice of the scene this line owns. */
  range: Span;
  /** Render statically, for reduced motion or a collapsed layout. */
  still?: boolean;
  /** See {@link RiseProps.from}: display type needs more than 112. */
  from?: number;
}

/** A masked line owned by a pinned scene rather than by its own position. */
export function Staged({
  progress,
  range,
  still = false,
  from,
  children,
  className,
  bleed,
  as,
}: StagedProps) {
  const reduced = useReducedMotion();
  const local = useTransform(progress, range as [number, number], [0, 1]);
  const y = usePercentY(local, from);

  if (reduced || still) {
    return (
      <Static as={as} className={className}>
        {children}
      </Static>
    );
  }

  return (
    <MaskedLine as={as} className={className} bleed={bleed} y={y}>
      {children}
    </MaskedLine>
  );
}

export interface DriftProps {
  children: ReactNode;
  className?: string;
  /** How far below its seat the block sits when it enters, in px. */
  from?: number;
  offset?: [string, string];
}

/**
 * A block that arrives with mass: it trails its seat by a distance that
 * scroll pays off. No mask, no opacity, just late weight.
 */
export function Drift({
  children,
  className,
  from = 40,
  offset = ["start 108%", "start 72%"],
}: DriftProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ["start start", "end end"],
  });
  const weighted = useSpring(scrollYProgress, WEIGHT);
  const y = useTransform(weighted, [0, 1], [from, 0]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
