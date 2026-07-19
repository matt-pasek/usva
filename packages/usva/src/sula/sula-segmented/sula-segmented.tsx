"use client";
import { animate, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  createField,
  type FieldColors,
  resolveColor,
  shineForBackdrop,
} from "../sula-core/field.js";
import { type Blob, type Neck, packUniforms } from "../sula-core/geometry.js";
import { createPauseGate } from "../sula-core/pause.js";
import { createEnergyTracker } from "../sula-motion/energy.js";
import { switchSpring } from "../sula-motion/springs.js";
import { indicatorPhase, pillFromRect } from "./segmented-geometry.js";

export interface SulaSegmentedItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

export interface SulaSegmentedProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onChange" | "defaultValue"
  > {
  items: SulaSegmentedItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "md";
  /** false or reduced-motion renders the plain sliding pill and mounts no canvas. */
  fluid?: boolean;
  /** Drops the track fill and border, leaving the indicator on a bare surface. */
  bare?: boolean;
  accentColor?: string;
  backdrop?: string;
  tint?: string;
  shine?: number;
}

const sizeClasses: Record<NonNullable<SulaSegmentedProps["size"]>, string> = {
  sm: "h-8 px-3",
  md: "h-9 px-4",
};

/** Room past the track so the pill's rounded caps are not clipped by the stage. */
const SLACK_X = 20;
const SLACK_Y = 10;
const MAX_DPR = 2;
/** Merge radius at rest: firm glass. */
const REST_K = 14;
/** Merge radius while a switch is live: gooey. */
const K_ACTIVE = 24;
/** Peak surface undulation in px, alive only while the droplet moves. */
const WOBBLE = 0.6;

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

export const SulaSegmented = React.forwardRef<
  HTMLDivElement,
  SulaSegmentedProps
>(
  (
    {
      items,
      value,
      defaultValue,
      onValueChange,
      size = "md",
      fluid = true,
      bare = false,
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
    const stageRef = React.useRef<HTMLDivElement | null>(null);
    const segmentRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    const [failed, setFailed] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    const isFluid = fluid && !reduced && !failed && mounted;

    const isControlled = value !== undefined;
    const [uncontrolled, setUncontrolled] = React.useState(
      () => defaultValue ?? items[0]?.value,
    );
    const current = isControlled ? value : uncontrolled;

    const activeIndex = Math.max(
      0,
      items.findIndex((item) => item.value === current),
    );
    const activeIndexRef = React.useRef(activeIndex);
    activeIndexRef.current = activeIndex;

    const switchRef = React.useRef<(previous: number) => void>(() => {});

    // The plain sliding pill, used whenever the field is not running.
    const [indicator, setIndicator] = React.useState({
      left: 0,
      width: 0,
      ready: false,
    });
    const measurePlain = React.useCallback(() => {
      const el = segmentRefs.current[activeIndex];
      if (!el) return;
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
    }, [activeIndex]);

    React.useLayoutEffect(() => {
      measurePlain();
    }, [measurePlain]);

    React.useEffect(() => {
      if (typeof ResizeObserver === "undefined") return;
      const observer = new ResizeObserver(() => measurePlain());
      for (const el of segmentRefs.current) {
        if (el) observer.observe(el);
      }
      return () => observer.disconnect();
    }, [measurePlain]);

    React.useEffect(() => {
      if (!isFluid) return;
      const canvas = canvasRef.current;
      const stage = stageRef.current;
      const root = rootRef.current;
      if (!canvas || !stage || !root) return;

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

      let pills: Blob[] = [];
      let canvasH = 0;
      let dpr = 1;
      let raf = 0;
      let running = 0;
      const energy = createEnergyTracker();
      const start = performance.now();

      const swT = { value: 1 };
      let pSwitch = 1;
      let transitioning = false;
      let source: Blob | null = null;
      let target: Blob | null = null;
      let lastIndicator: Blob | null = null;

      let lastW = 0;
      let lastH = 0;
      const measure = () => {
        const box = stage.getBoundingClientRect();
        const width = Math.ceil(box.width);
        const height = Math.ceil(box.height);
        const nextDpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        if (width !== lastW || height !== lastH || nextDpr !== dpr) {
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          field.resize(width, height, nextDpr);
          lastW = width;
          lastH = height;
        }
        canvasH = height;
        dpr = nextDpr;
        pills = segmentRefs.current.map((el) => {
          const rect = el?.getBoundingClientRect();
          if (!rect)
            return pillFromRect({ left: 0, top: 0, width: 0, height: 0 });
          return pillFromRect({
            left: rect.left - box.left,
            top: rect.top - box.top,
            width: rect.width,
            height: rect.height,
          });
        });
      };

      const paint = (blobs: Blob[], necks: Neck[], liveK: number) => {
        field.draw({
          packed: packUniforms({ blobs, necks, k: liveK }, dpr, canvasH),
          k: liveK * dpr,
          time: (performance.now() - start) / 1000,
          wobble: WOBBLE * energy.value,
          alpha: 1,
        });
      };

      const liveK = () => REST_K + (K_ACTIVE - REST_K) * energy.value;

      const tick = () => {
        if (transitioning && source && target) {
          const v = swT.value - pSwitch;
          pSwitch = swT.value;
          energy.bump(Math.abs(v));
          const k = liveK();
          const { blobs, neck } = indicatorPhase(source, target, swT.value);
          lastIndicator = blobs[0] ?? null;
          const necks: Neck[] = neck ? [neck] : [];
          paint(blobs, necks, k);
        } else {
          energy.bump(0);
          const active = pills[activeIndexRef.current];
          if (active) paint([active], [], liveK());
        }

        if (running === 0 && energy.parked()) {
          transitioning = false;
          return;
        }
        raf = requestAnimationFrame(tick);
      };
      const wake = () => {
        if (!gate.awake()) return;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      };
      const gate = createPauseGate({
        target: root,
        onPause: () => cancelAnimationFrame(raf),
        onResume: () => wake(),
      });

      const controls = new Set<ReturnType<typeof animate>>();
      const run = (
        subject: { value: number },
        to: [number, number],
        opts: typeof switchSpring,
      ) => {
        running += 1;
        const control = animate(subject, { value: to }, opts);
        controls.add(control);
        const finish = () => {
          running = Math.max(0, running - 1);
          controls.delete(control);
        };
        void control.finished.then(finish, finish);
        wake();
        return control;
      };

      let disposed = false;
      let swControl: ReturnType<typeof animate> | null = null;

      const doSwitch = (previous: number) => {
        /* Restarting an in-flight switch from a segment pill would yank the
         * indicator back and read as a stall; continue from where it is. */
        const inFlight = transitioning ? lastIndicator : null;
        measure();
        const src = inFlight ?? pills[previous];
        const tgt = pills[activeIndexRef.current];
        if (!src || !tgt) return;
        source = src;
        target = tgt;
        transitioning = true;
        swT.value = 0;
        pSwitch = 0;
        swControl?.stop();
        /* Motion caches one visual element per animated subject and reads the next
         * "from" out of it, so a bare swT.value reset is invisible to it. The
         * explicit [0, 1] keyframes are what make the second and every later switch
         * animate instead of snapping. */
        swControl = run(swT, [0, 1], switchSpring);
        void swControl.finished.then(
          () => {
            if (disposed) return;
            transitioning = false;
            wake();
          },
          () => undefined,
        );
      };
      switchRef.current = doSwitch;

      measure();
      wake();

      const remeasure = () => {
        measure();
        wake();
      };
      const observer =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(remeasure);
      observer?.observe(root);
      window.addEventListener("resize", remeasure);
      void document.fonts?.ready.then(remeasure).catch(() => undefined);

      const themeObserver =
        typeof MutationObserver === "undefined"
          ? null
          : new MutationObserver(() => {
              field.setColors(readColors(root, overrides));
              wake();
            });
      themeObserver?.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class"],
      });

      return () => {
        disposed = true;
        for (const control of controls) control.stop();
        switchRef.current = () => {};
        window.removeEventListener("resize", remeasure);
        observer?.disconnect();
        themeObserver?.disconnect();
        gate.dispose();
        cancelAnimationFrame(raf);
        field.dispose();
        canvas.style.width = "";
        canvas.style.height = "";
      };
    }, [isFluid, backdrop, tint, accentColor, shine]);

    const previousIndex = React.useRef(activeIndex);
    React.useLayoutEffect(() => {
      const previous = previousIndex.current;
      previousIndex.current = activeIndex;
      if (isFluid && previous !== activeIndex) {
        switchRef.current(previous);
      }
    }, [activeIndex, isFluid]);

    const select = React.useCallback(
      (next: string) => {
        if (!isControlled) setUncontrolled(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const focusIndex = (index: number) => {
      const clamped = (index + items.length) % items.length;
      const targetItem = items[clamped];
      if (!targetItem) return;
      segmentRefs.current[clamped]?.focus();
      select(targetItem.value);
    };

    const onKeyDown = (event: React.KeyboardEvent, index: number) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
          event.preventDefault();
          focusIndex(index + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          event.preventDefault();
          focusIndex(index - 1);
          break;
        case "Home":
          event.preventDefault();
          focusIndex(0);
          break;
        case "End":
          event.preventDefault();
          focusIndex(items.length - 1);
          break;
        default:
          break;
      }
    };

    return (
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        role="radiogroup"
        data-fluid={isFluid ? "on" : "off"}
        className={cn(
          "relative inline-flex items-center rounded-full p-1",
          !bare && "border border-border bg-surface",
          className,
        )}
        {...props}
      >
        {isFluid ? (
          <div
            ref={stageRef}
            aria-hidden="true"
            className="pointer-events-none absolute overflow-hidden"
            style={{
              top: -SLACK_Y,
              bottom: -SLACK_Y,
              left: -SLACK_X,
              right: -SLACK_X,
            }}
          >
            <canvas ref={canvasRef} />
          </div>
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute top-1 bottom-1 left-0 rounded-full bg-surface-2 shadow-raised",
              "[filter:drop-shadow(var(--usva-glow-accent))]",
              "transition-layout duration-slow ease-spring motion-reduce:transition-none",
              !indicator.ready && "opacity-0",
            )}
            style={{
              width: indicator.width,
              transform: `translateX(${indicator.left}px)`,
            }}
          />
        )}
        {items.map((item, index) => {
          const checked = item.value === current;
          return (
            // biome-ignore lint/a11y/useSemanticElements: segmented control needs a button with a roving tabindex and a custom indicator; a native radio input can't render this pattern
            <button
              key={item.value}
              type="button"
              role="radio"
              aria-checked={checked}
              tabIndex={checked ? 0 : -1}
              ref={(node) => {
                segmentRefs.current[index] = node;
              }}
              onClick={() => select(item.value)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full text-sm whitespace-nowrap outline-none",
                sizeClasses[size],
                "text-muted transition-tint duration-fast ease-soft",
                "hover:text-ink aria-checked:text-ink",
                "focus-visible:ring-focus",
              )}
            >
              {item.icon ? (
                <span className="inline-flex shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
              ) : null}
              {item.label}
            </button>
          );
        })}
      </div>
    );
  },
);
SulaSegmented.displayName = "SulaSegmented";
