"use client";
import { useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  createField,
  type FieldColors,
  resolveColor,
  shineForBackdrop,
} from "../sula-core/field.js";
import { packUniforms } from "../sula-core/geometry.js";
import {
  LOOP_PERIODS,
  type LoaderMotion,
  loaderFrame,
  STATIC_PHASES,
} from "./loader-geometry.js";

export interface SulaLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Square side in px. Defaults to 96. */
  size?: number;
  /** Which looping motion the droplets run. Defaults to "orbit". */
  motion?: LoaderMotion;
  /** Loop-rate multiplier; higher is faster. Defaults to 1. */
  speed?: number;
  /** The announced status text. Defaults to "Loading". */
  label?: string;
  /** false or reduced-motion renders a static still with no canvas. */
  fluid?: boolean;
  accentColor?: string;
  backdrop?: string;
  tint?: string;
  shine?: number;
}

const DEFAULT_SIZE = 96;
const MAX_DPR = 2;
/** Peak surface undulation in px. A loader is always in motion, so this is a
 * constant living shimmer rather than an energy-gated one. */
const WOBBLE = 1.2;
/** The slowest the loop may run, so a speed of 0 does not divide by zero. */
const MIN_SPEED = 0.05;

function readColors(
  node: HTMLElement,
  overrides: {
    backdrop?: string;
    tint?: string;
    accent?: string;
    shine?: number;
  },
): FieldColors {
  const styles = getComputedStyle(node);
  const token = (name: string) => styles.getPropertyValue(name).trim();
  const backdrop = resolveColor(overrides.backdrop ?? token("--usva-bg"));
  const tintToken =
    overrides.tint ?? token("--usva-surface-2") ?? token("--usva-surface");
  return {
    backdrop,
    tint: resolveColor(tintToken || token("--usva-surface")),
    accent: resolveColor(overrides.accent ?? token("--usva-accent")),
    shine: overrides.shine ?? shineForBackdrop(backdrop),
  };
}

export const SulaLoader = React.forwardRef<HTMLDivElement, SulaLoaderProps>(
  (
    {
      size = DEFAULT_SIZE,
      motion = "orbit",
      speed = 1,
      label = "Loading",
      fluid = true,
      accentColor,
      backdrop,
      tint,
      shine,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const reduced = useReducedMotion();
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const gooId = React.useId();

    const [failed, setFailed] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    /* motion and speed drive what the loop draws, not the field itself, so they
     * ride refs instead of effect deps. Switching motion must not tear down the
     * GL context and rebuild it on the same canvas, which races the scheduled
     * frame against a disposed program. */
    const motionRef = React.useRef(motion);
    motionRef.current = motion;
    const speedRef = React.useRef(speed);
    speedRef.current = speed;

    const isFluid = fluid && !reduced && !failed && mounted;

    React.useEffect(() => {
      if (!isFluid) return;
      const canvas = canvasRef.current;
      const root = rootRef.current;
      if (!canvas || !root) return;

      const overrides = { backdrop, tint, accent: accentColor, shine };
      const field = createField({
        canvas,
        colors: readColors(root, overrides),
        onContextLost: () => setFailed(true),
      });
      if (!field) {
        setFailed(true);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;
      field.resize(size, size, dpr);

      const start = performance.now();
      let phase = 0;
      let activeMotion = motionRef.current;
      let last = start;
      let raf = 0;
      let killed = false;

      const tick = () => {
        if (killed) return;
        const now = performance.now();
        const nextMotion = motionRef.current;
        if (nextMotion !== activeMotion) {
          activeMotion = nextMotion;
          phase = STATIC_PHASES[nextMotion];
        } else {
          const period =
            LOOP_PERIODS[activeMotion] / Math.max(MIN_SPEED, speedRef.current);
          phase = (phase + (now - last) / 1000 / period) % 1;
        }
        last = now;
        const { blobs, necks, k } = loaderFrame(activeMotion, phase, size);
        field.draw({
          packed: packUniforms({ blobs, necks, k }, dpr, size),
          k: k * dpr,
          time: (now - start) / 1000,
          wobble: WOBBLE,
          alpha: 1,
          hover: null,
        });
        raf = requestAnimationFrame(tick);
      };

      const stop = () => cancelAnimationFrame(raf);
      /* Resume from a fresh timestamp so a spell paused offscreen does not jump
       * the phase forward by the elapsed real time. */
      const run = () => {
        last = performance.now();
        stop();
        raf = requestAnimationFrame(tick);
      };
      const onVisibility = () => {
        if (document.hidden) stop();
        else run();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const themeObserver =
        typeof MutationObserver === "undefined"
          ? null
          : new MutationObserver(() => {
              field.setColors(readColors(root, overrides));
            });
      themeObserver?.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class"],
      });

      run();

      return () => {
        killed = true;
        document.removeEventListener("visibilitychange", onVisibility);
        themeObserver?.disconnect();
        stop();
        field.dispose();
        canvas.style.width = "";
        canvas.style.height = "";
      };
    }, [isFluid, size, backdrop, tint, accentColor, shine]);

    const still = loaderFrame(motion, STATIC_PHASES[motion], size);
    const blur = size * 0.05;

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        role="status"
        aria-live="polite"
        aria-busy="true"
        data-fluid={isFluid ? "on" : "off"}
        style={{ width: size, height: size }}
        className={cn(
          "relative inline-grid place-items-center text-accent",
          className,
        )}
        {...props}
      >
        {isFluid ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>
        ) : (
          <svg
            aria-hidden="true"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="absolute inset-0"
          >
            <title>{label}</title>
            <defs>
              <filter id={gooId}>
                <feGaussianBlur in="SourceGraphic" stdDeviation={blur} />
                <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
              </filter>
            </defs>
            <g fill="currentColor" filter={`url(#${gooId})`} opacity={0.85}>
              {still.blobs.map((b, i) => (
                <circle
                  // biome-ignore lint/suspicious/noArrayIndexKey: a fixed still frame, blobs never reorder
                  key={i}
                  cx={b.cx}
                  cy={b.cy}
                  r={b.r}
                />
              ))}
            </g>
          </svg>
        )}
        <span className="sr-only">{label}</span>
      </div>
    );
  },
);
SulaLoader.displayName = "SulaLoader";
