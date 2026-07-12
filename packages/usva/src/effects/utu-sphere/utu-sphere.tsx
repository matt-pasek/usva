"use client";
import { useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../cn.js";
import { createSphere, resolveColor } from "./sphere.js";
import {
  approach,
  breathe,
  buildRamp,
  LEAN_EASE,
  monoRamp,
  resolveParams,
  type SphereColors,
  type SphereParams,
} from "./sphere-geometry.js";

export interface UtuSphereProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rotation and breath rate multiplier; higher turns faster. Defaults to 1. */
  speed?: number;
  /** When on, the volume leans toward the eased cursor. Defaults to false. */
  interactive?: boolean;
  /** Contour count: how many glowing shells stack through the body. */
  bands?: number;
  /** Collapse the dawn gradient to a single brand colour instead. */
  accentColor?: string;
  /** Override any dawn gradient stop with a CSS colour. Omitted stops keep the
   * dawn default (violet valleys, magenta body, warm-gold cores). */
  colors?: { deep?: string; mid?: string; hot?: string };
  /** Overall opacity of the fog, 0..1. Lower lets more of the page through.
   * Defaults to 1. */
  opacity?: number;
  /** Escape hatch for the field parameters, for tuning demos. */
  params?: Partial<SphereParams>;
  children?: React.ReactNode;
}

const MAX_DPR = 2;

interface ColorOverrides {
  accentColor?: string;
  deep?: string;
  mid?: string;
  hot?: string;
}

function readColors(overrides: ColorOverrides): SphereColors {
  const stop = (c?: string) => (c ? resolveColor(c) : undefined);
  const stops = {
    deep: stop(overrides.deep),
    mid: stop(overrides.mid),
    hot: stop(overrides.hot),
  };
  if (overrides.accentColor) {
    const base = monoRamp(resolveColor(overrides.accentColor));
    return {
      deep: stops.deep ?? base.deep,
      mid: stops.mid ?? base.mid,
      hot: stops.hot ?? base.hot,
    };
  }
  return buildRamp(stops);
}

export const UtuSphere = React.forwardRef<HTMLDivElement, UtuSphereProps>(
  (
    {
      speed = 1,
      interactive = false,
      bands,
      accentColor,
      colors,
      opacity = 1,
      params,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const cDeep = colors?.deep;
    const cMid = colors?.mid;
    const cHot = colors?.hot;
    const reduced = useReducedMotion();
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

    /* These tune what the loop draws, not the GL context, so they ride refs: a
     * live prop change must never tear the context down and rebuild it on the
     * same canvas, which would race a scheduled frame. */
    const speedRef = React.useRef(speed);
    speedRef.current = speed;
    const interactiveRef = React.useRef(interactive);
    interactiveRef.current = interactive;
    const opacityRef = React.useRef(opacity);
    opacityRef.current = opacity;

    const paramsRef = React.useRef<SphereParams>(
      resolveParams({ ...params, ...(bands !== undefined ? { bands } : {}) }),
    );
    paramsRef.current = resolveParams({
      ...params,
      ...(bands !== undefined ? { bands } : {}),
    });

    const [failed, setFailed] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    const animated = !reduced && !failed && mounted;
    const still = reduced && !failed && mounted;
    const sphereOn = animated || still;

    React.useEffect(() => {
      if (!sphereOn) return;
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ramp = readColors({
        accentColor,
        deep: cDeep,
        mid: cMid,
        hot: cHot,
      });

      const sphere = createSphere({
        canvas,
        colors: ramp,
        params: paramsRef.current,
        onContextLost: () => setFailed(true),
      });
      if (!sphere) {
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
          sphere.resize(w, h, nextDpr);
        }
        width = w;
        height = h;
        dpr = nextDpr;
        return true;
      };

      let leanAmt = 0;
      let leanTarget = 0;
      const lean: [number, number] = [0, 0];
      const pointer = { x: 0, y: 0 };

      const draw = (elapsed: number) => {
        const p = paramsRef.current;
        const radius = breathe(elapsed, p.radius, p.breathAmt, p.breathRate);
        const bandsNow = breathe(
          elapsed,
          p.bands,
          p.breathAmt * 0.6,
          p.breathRate,
        );
        leanAmt = approach(leanAmt, leanTarget, LEAN_EASE);
        if (interactiveRef.current) {
          const short = Math.min(width, height) || 1;
          lean[0] = approach(lean[0], (pointer.x / short) * 2, LEAN_EASE);
          lean[1] = approach(lean[1], (pointer.y / short) * 2, LEAN_EASE);
        }
        sphere.setParams(p);
        sphere.draw({
          time: elapsed * speedRef.current,
          radius,
          bands: bandsNow,
          lean,
          leanAmt,
          alpha: opacityRef.current,
        });
      };

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
          sphere.dispose();
          canvas.style.width = "";
          canvas.style.height = "";
        };
      }

      let raf = 0;
      let elapsed = 0;
      let last = performance.now();
      let killed = false;
      const tick = () => {
        if (killed) return;
        const now = performance.now();
        elapsed += (now - last) / 1000;
        last = now;
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
        pointer.x = event.clientX - box.left - box.width / 2;
        pointer.y = box.height / 2 - (event.clientY - box.top);
        leanTarget = 1;
      };
      const onLeave = () => {
        leanTarget = 0;
      };
      container.addEventListener("pointermove", onMove);
      container.addEventListener("pointerleave", onLeave);

      let visible = true;
      const io =
        typeof IntersectionObserver === "undefined"
          ? null
          : new IntersectionObserver((entries) => {
              visible = entries[0]?.isIntersecting ?? true;
              if (visible && !document.hidden) run();
              else stop();
            });
      io?.observe(container);

      const onVisibility = () => {
        if (document.hidden || !visible) stop();
        else run();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const observer =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(() => measure());
      observer?.observe(container);

      run();

      return () => {
        killed = true;
        container.removeEventListener("pointermove", onMove);
        container.removeEventListener("pointerleave", onLeave);
        io?.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        observer?.disconnect();
        stop();
        sphere.dispose();
        canvas.style.width = "";
        canvas.style.height = "";
      };
    }, [sphereOn, still, accentColor, cDeep, cMid, cHot]);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        data-fluid={sphereOn ? "on" : "off"}
        className={cn("relative isolate overflow-hidden", className)}
        {...props}
      >
        {sphereOn ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <canvas ref={canvasRef} className="block h-full w-full" />
          </div>
        ) : null}
        {children}
      </div>
    );
  },
);
UtuSphere.displayName = "UtuSphere";
