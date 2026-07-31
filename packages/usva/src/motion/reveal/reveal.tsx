"use client";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import * as React from "react";
import { buildReveal, type RevealVariant, scrubRanges } from "./presets.js";
import { useRevealIntensity } from "./reveal-config.js";

const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  li: motion.li,
  ul: motion.ul,
  span: motion.span,
  figure: motion.figure,
} as const;

export type RevealTag = keyof typeof MOTION_TAGS;

const SCRUB_OFFSET: [string, string] = ["start 0.88", "start 0.45"];

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

function assignRef<T>(ref: React.Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) (ref as React.MutableRefObject<T | null>).current = node;
}

/**
 * Decide, before paint, whether an element should reveal. Elements already in
 * view at mount stay static (no hide-flash, no blank on no-JS); only ones below
 * the fold arm the enter animation.
 */
function useArmed(amount: number, disabled: boolean, force: boolean) {
  const ref = React.useRef<HTMLElement | null>(null);
  const [armed, setArmed] = React.useState(force && !disabled);
  useIsoLayoutEffect(() => {
    if (disabled || force) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight * (1 - amount)) setArmed(true);
  }, [disabled, amount, force]);
  return { ref, armed };
}

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  variant?: RevealVariant;
  delay?: number;
  /** Override the ambient reveal intensity for this element. */
  intensity?: number;
  /** Fraction of the element that must be visible to trigger. */
  amount?: number;
  /** Reveal even when already in view at mount (e.g. demos, explicit entrances). */
  force?: boolean;
  /**
   * Drive the variant from scroll progress instead of a threshold crossing. The
   * reveal becomes a continuous function of position: it plays backwards on
   * scroll-up and holds mid-state when the reader stops. Opt-in, because a
   * threshold reveal is still the right answer for anything that encodes a
   * value (a bar animating to 71% must reach 71%, not to wherever the scroll is).
   */
  scrub?: boolean;
  /**
   * Scroll window the scrub spans, as `motion`'s `useScroll` offset. Defaults to
   * starting when the element's top reaches 88% of the viewport and completing
   * at 45%, so it resolves on approach and settles before the reader arrives.
   */
  scrubOffset?: [string, string];
  as?: RevealTag;
}

export const Reveal = React.forwardRef<HTMLElement, RevealProps>(
  (
    {
      variant = "veil",
      delay = 0,
      intensity,
      amount = 0.35,
      force = false,
      scrub = false,
      scrubOffset = SCRUB_OFFSET,
      as = "div",
      children,
      ...rest
    },
    forwardedRef,
  ) => {
    const k = useRevealIntensity(intensity);
    const reduced = useReducedMotion() ?? false;
    const { ref, armed } = useArmed(amount, reduced || k <= 0, force);

    const setRefs = React.useCallback(
      (node: HTMLElement | null) => {
        ref.current = node;
        assignRef(forwardedRef, node);
      },
      [ref, forwardedRef],
    );

    const Comp = MOTION_TAGS[as] as React.ElementType;

    const scrubbing = scrub && !reduced && k > 0;
    const ranges = scrubRanges(buildReveal(variant, k, reduced));
    const { scrollYProgress } = useScroll({
      target: ref as React.RefObject<HTMLElement>,
      offset: scrubOffset as never,
    });
    const scrubOpacity = useTransform(scrollYProgress, [0, 1], ranges.opacity);
    const scrubX = useTransform(scrollYProgress, [0, 1], ranges.x);
    const scrubY = useTransform(scrollYProgress, [0, 1], ranges.y);
    const scrubScale = useTransform(scrollYProgress, [0, 1], ranges.scale);
    const scrubBlur = useTransform(scrollYProgress, (v: number) => {
      const [from, to] = ranges.blur;
      return `blur(${(from + (to - from) * v).toFixed(2)}px)`;
    });

    if (scrubbing) {
      const { present } = ranges;
      return (
        <Comp
          ref={setRefs}
          style={{
            opacity: scrubOpacity,
            ...(present.x ? { x: scrubX } : {}),
            ...(present.y ? { y: scrubY } : {}),
            ...(present.scale ? { scale: scrubScale } : {}),
            ...(present.blur ? { filter: scrubBlur } : {}),
          }}
          {...rest}
        >
          {children}
        </Comp>
      );
    }

    if (!armed) {
      return (
        <Comp ref={setRefs} {...rest}>
          {children}
        </Comp>
      );
    }

    const built = buildReveal(variant, k, reduced);
    return (
      <Comp
        ref={setRefs}
        initial={built.initial}
        whileInView={built.animate}
        viewport={{ once: true, amount }}
        transition={{ ...built.transition, delay }}
        {...rest}
      >
        {children}
      </Comp>
    );
  },
);
Reveal.displayName = "Reveal";

export interface RevealGroupProps extends React.HTMLAttributes<HTMLElement> {
  variant?: RevealVariant;
  /** Delay between each child, seconds. */
  stagger?: number;
  /** Delay before the first child, seconds. */
  delay?: number;
  intensity?: number;
  amount?: number;
  /** Reveal even when already in view at mount (e.g. demos). */
  force?: boolean;
  as?: RevealTag;
}

/**
 * Staggers its direct children in on one shared viewport trigger. The cascade
 * IS the effect. Each child becomes an animated box, so put layout classes
 * (grid/flex) on the group.
 */
export const RevealGroup = React.forwardRef<HTMLElement, RevealGroupProps>(
  (
    {
      variant = "tick",
      stagger = 0.06,
      delay = 0,
      intensity,
      amount = 0.3,
      force = false,
      as = "div",
      children,
      ...rest
    },
    forwardedRef,
  ) => {
    const k = useRevealIntensity(intensity);
    const reduced = useReducedMotion() ?? false;
    const disabled = reduced || k <= 0;
    const { ref, armed } = useArmed(amount, disabled, force);
    const inView = useInView(ref as React.RefObject<Element>, {
      once: true,
      amount,
    });

    const setRefs = React.useCallback(
      (node: HTMLElement | null) => {
        ref.current = node;
        assignRef(forwardedRef, node);
      },
      [ref, forwardedRef],
    );

    const Comp = MOTION_TAGS[as] as React.ElementType;

    if (!armed) {
      return (
        <Comp ref={setRefs} {...rest}>
          {children}
        </Comp>
      );
    }

    const built = buildReveal(variant, k, reduced);

    return (
      <Comp ref={setRefs} {...rest}>
        {React.Children.map(children, (child, index) => (
          <motion.div
            initial={built.initial}
            animate={inView ? built.animate : built.initial}
            transition={{ ...built.transition, delay: delay + index * stagger }}
          >
            {child}
          </motion.div>
        ))}
      </Comp>
    );
  },
);
RevealGroup.displayName = "RevealGroup";
