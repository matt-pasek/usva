"use client";
import { useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  createField,
  type FieldColors,
  liftTint,
  resolveColor,
  shineForBackdrop,
} from "../sula-core/field.js";
import { packHover, packUniforms } from "../sula-core/geometry.js";
import { createPauseGate } from "../sula-core/pause.js";
import {
  ambientDrift,
  MAX_FIELD_BLOBS,
  MAX_FIELD_NECKS,
  resolveDriveFrame,
  type SulaFieldDrive,
} from "./drive.js";
import { nearestBlob, POINTER_EASE, WAKE_EASE } from "./field-geometry.js";

export interface SulaFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Drift-rate multiplier; higher drifts faster. Defaults to 1. */
  speed?: number;
  /**
   * The choreography: a pure function of time and the field's bounds, returning
   * the bodies and necks for that instant. Defaults to the ambient drift. Each
   * depth plane holds up to MAX_FIELD_BLOBS bodies and the frame up to
   * MAX_FIELD_NECKS necks; anything past that is clamped away, so keep inside it.
   */
  drive?: SulaFieldDrive;
  /** When on, blobs lean toward the eased cursor. Defaults to false. */
  interactive?: boolean;
  /** Reproduces the same wander for a given value. Defaults to 0. */
  seed?: number;
  /** false mounts no canvas; reduced-motion paints one static frame. */
  fluid?: boolean;
  accentColor?: string;
  backdrop?: string;
  tint?: string;
  shine?: number;
  children?: React.ReactNode;
}

const MAX_DPR = 2;
/** Peak surface undulation, per depth pass. The back cloud heaves slowly; the
 * front actors shimmer tighter. */
const BACK_WOBBLE = 2.5;
const FRONT_WOBBLE = 1.2;
/** Peak edge displacement of the pointer lean, in px. */
const HOVER_WOBBLE = 1.4;
/** Peak position lean toward the cursor, as a fraction of the short side: the
 * heavy wake that trails the pointer. */
const WAKE_REACH = 0.06;
/** Gaussian falloff radius of the wake, as a fraction of the short side. Every
 * actor within it leans, weighted by proximity, so the pull glides across the
 * field instead of snapping from one nearest blob to the next. */
const WAKE_SPREAD = 0.45;

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

export const SulaField = React.forwardRef<HTMLDivElement, SulaFieldProps>(
  (
    {
      speed = 1,
      drive,
      interactive = false,
      seed = 0,
      fluid = true,
      accentColor,
      backdrop,
      tint,
      shine,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const reduced = useReducedMotion();
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

    /* These tune what the loop draws, not the GL field, so they ride refs rather
     * than effect deps: a live prop change must never tear the context down and
     * rebuild it on the same canvas, which races a scheduled frame. */
    const speedRef = React.useRef(speed);
    speedRef.current = speed;
    const seedRef = React.useRef(seed);
    seedRef.current = seed;
    const interactiveRef = React.useRef(interactive);
    interactiveRef.current = interactive;
    const driveRef = React.useRef<SulaFieldDrive>(drive ?? ambientDrift);
    driveRef.current = drive ?? ambientDrift;

    const [failed, setFailed] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    const animated = fluid && !reduced && !failed && mounted;
    const still = fluid && reduced && !failed && mounted;
    const fieldOn = animated || still;

    React.useEffect(() => {
      if (!fieldOn) return;
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const overrides = { backdrop, tint, accent: accentColor, shine };
      let base = readColors(container, overrides);
      let backColors: FieldColors = { ...base, shine: 0 };
      let frontColors: FieldColors = {
        ...base,
        tint: liftTint(base.tint, base.accent),
      };
      const refreshColors = () => {
        base = readColors(container, overrides);
        backColors = { ...base, shine: 0 };
        frontColors = { ...base, tint: liftTint(base.tint, base.accent) };
      };

      const field = createField({
        canvas,
        colors: frontColors,
        onContextLost: () => setFailed(true),
      });
      if (!field) {
        setFailed(true);
        return;
      }

      let width = 0;
      let height = 0;
      let dpr = 1;
      const measure = () => {
        const box = container.getBoundingClientRect();
        const w = Math.ceil(box.width);
        const h = Math.ceil(box.height);
        if (w <= 0 || h <= 0) return false;
        const nextDpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        if (w !== width || h !== height || nextDpr !== dpr) {
          canvas.style.width = `${w}px`;
          canvas.style.height = `${h}px`;
          field.resize(w, h, nextDpr);
        }
        width = w;
        height = h;
        dpr = nextDpr;
        return true;
      };

      let hoverAmt = 0;
      let hoverTarget = 0;
      let wakeAmt = 0;
      const pointer = { x: 0, y: 0 };

      /* Two passes into one context: a dark, soupy back cloud clears the frame,
       * then the lit actors composite over it (clear:false). Colors are set per
       * pass, so the back stays matte (shine 0) and the front carries the rim. */
      let warned = false;
      const draw = (elapsed: number) => {
        const bounds = { width, height, seed: seedRef.current };
        const resolved = resolveDriveFrame(
          driveRef.current(elapsed * speedRef.current, bounds),
          bounds,
        );
        const { back, front, necks, kFront, kBack } = resolved;
        if (resolved.clamped && !warned) {
          warned = true;
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              `SulaField: the drive returned more than ${MAX_FIELD_BLOBS} bodies in a plane or ${MAX_FIELD_NECKS} necks. The surplus is not drawn.`,
            );
          }
        }
        const short = Math.min(width, height);
        const focus = nearestBlob(front, pointer);
        if (interactiveRef.current && wakeAmt > 0.001) {
          const reach = wakeAmt * WAKE_REACH * short;
          const spread = short * WAKE_SPREAD;
          for (const b of front) {
            const dx = pointer.x - b.cx;
            const dy = pointer.y - b.cy;
            const dist = Math.hypot(dx, dy) || 1;
            const fall = Math.exp(-((dist / spread) ** 2));
            b.cx += (dx / dist) * reach * fall;
            b.cy += (dy / dist) * reach * fall;
          }
        }

        field.setColors(backColors);
        field.draw({
          packed: packUniforms(
            { blobs: back, necks: [], k: kBack },
            dpr,
            height,
          ),
          k: kBack * dpr,
          time: elapsed,
          wobble: BACK_WOBBLE,
          alpha: 1,
          hover: null,
          clear: true,
        });

        field.setColors(frontColors);
        field.draw({
          packed: packUniforms({ blobs: front, necks, k: kFront }, dpr, height),
          k: kFront * dpr,
          time: elapsed,
          wobble: FRONT_WOBBLE,
          alpha: 1,
          hover:
            interactiveRef.current && focus && hoverAmt > 0.01
              ? packHover(focus, hoverAmt * HOVER_WOBBLE, dpr, height, pointer)
              : null,
          clear: false,
        });
      };

      const start = performance.now();
      if (!measure()) return;

      if (still) {
        draw(0);
        const observer =
          typeof ResizeObserver === "undefined"
            ? null
            : new ResizeObserver(() => {
                if (measure()) draw(0);
              });
        observer?.observe(container);
        return () => {
          observer?.disconnect();
          field.dispose();
          canvas.style.width = "";
          canvas.style.height = "";
        };
      }

      let raf = 0;
      let elapsed = 0;
      let last = start;
      let killed = false;
      const tick = () => {
        if (killed) return;
        const now = performance.now();
        elapsed += (now - last) / 1000;
        last = now;
        hoverAmt += (hoverTarget - hoverAmt) * POINTER_EASE;
        wakeAmt += (hoverTarget - wakeAmt) * WAKE_EASE;
        draw(elapsed);
        raf = requestAnimationFrame(tick);
      };
      const stop = () => cancelAnimationFrame(raf);
      const run = () => {
        last = performance.now();
        stop();
        raf = requestAnimationFrame(tick);
      };

      const onMove = (event: PointerEvent) => {
        if (!interactiveRef.current) return;
        const box = container.getBoundingClientRect();
        pointer.x = event.clientX - box.left;
        pointer.y = event.clientY - box.top;
        hoverTarget = 1;
      };
      const onLeave = () => {
        hoverTarget = 0;
      };
      container.addEventListener("pointermove", onMove);
      container.addEventListener("pointerleave", onLeave);

      const gate = createPauseGate({
        target: container,
        onPause: stop,
        onResume: run,
      });

      const observer =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(() => measure());
      observer?.observe(container);

      const themeObserver =
        typeof MutationObserver === "undefined"
          ? null
          : new MutationObserver(() => refreshColors());
      themeObserver?.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class"],
      });

      run();

      return () => {
        killed = true;
        container.removeEventListener("pointermove", onMove);
        container.removeEventListener("pointerleave", onLeave);
        gate.dispose();
        observer?.disconnect();
        themeObserver?.disconnect();
        stop();
        field.dispose();
        canvas.style.width = "";
        canvas.style.height = "";
      };
    }, [fieldOn, still, backdrop, tint, accentColor, shine]);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        data-fluid={fieldOn ? "on" : "off"}
        className={cn("relative isolate overflow-hidden", className)}
        {...props}
      >
        {fieldOn ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "radial-gradient(120% 90% at 12% 88%, color-mix(in oklab, var(--usva-accent) 7%, transparent), transparent 55%)",
            }}
          >
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>
        ) : null}
        {children}
      </div>
    );
  },
);
SulaField.displayName = "SulaField";
