"use client";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { buildReveal, type RevealVariant } from "./presets.js";
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
    const childVariants = {
      hidden: built.initial,
      show: { ...built.animate, transition: built.transition },
    };

    return (
      <Comp
        ref={setRefs}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount }}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: stagger, delayChildren: delay },
          },
        }}
        {...rest}
      >
        {React.Children.map(children, (child) => (
          <motion.div variants={childVariants}>{child}</motion.div>
        ))}
      </Comp>
    );
  },
);
RevealGroup.displayName = "RevealGroup";
