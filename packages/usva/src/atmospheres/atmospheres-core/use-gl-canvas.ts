"use client";
import { useReducedMotion } from "motion/react";
import * as React from "react";
import { createGlSurface, type Uniforms } from "./atmospheres-gl.js";

/** How long the window has to hold still before the drawing buffer is rebuilt. */
const RESIZE_SETTLE_MS = 150;

export interface CaptureOptions {
  /** Opaque backdrop painted under the atmosphere, eg the studio canvas colour. */
  bg: string;
  /** Multiplier on the backing-store size. Defaults to 1 (already dpr-scaled). */
  scale?: number;
}

type CaptureFn = (opts: CaptureOptions) => Promise<Blob>;

// The renderer runs with preserveDrawingBuffer:false, so the buffer is only
// readable synchronously in the same tick as render(). Each live canvas
// registers a grabber here; the drawImage read happens in-frame, the toBlob
// after is free.
const captureRegistry = new WeakMap<HTMLCanvasElement, CaptureFn>();

/**
 * Take an opaque PNG of a mounted atmosphere. Rejects when the canvas is not a
 * currently live atmosphere surface.
 */
export function captureAtmosphere(
  canvas: HTMLCanvasElement,
  opts: CaptureOptions,
): Promise<Blob> {
  const grab = captureRegistry.get(canvas);
  if (!grab)
    return Promise.reject(new Error("canvas is not a live atmosphere"));
  return grab(opts);
}

export interface GlPointer {
  /** Pixels from the container centre, y up. */
  x: number;
  y: number;
  /** Eases 0..1 as the pointer enters and leaves. */
  amount: number;
  inside: boolean;
}

export interface GlFrame {
  /** Seconds of visible animation time. Stops accruing while paused. */
  time: number;
  /** CSS pixels. */
  width: number;
  height: number;
  /** Device pixel ratio actually used for the backing store. */
  dpr: number;
  pointer: GlPointer;
}

export interface UseGlCanvasOptions {
  fragment: string;
  vertex?: string;
  /** Built once per context. Every uniform the shader reads must appear here. */
  uniforms: () => Uniforms;
  /** Called before each render. uResolution and uTime are already written. */
  onFrame?: (uniforms: Uniforms, frame: GlFrame) => void;
  /** Ceiling on the device pixel ratio. Defaults to 2. */
  maxDpr?: number;
  /** Backing-store scale. 0.5 renders at half res and lets the browser upscale. */
  renderScale?: number;
  /** Track the pointer over the container. Defaults to false. */
  pointer?: boolean;
  /** Per-frame ease of pointer.amount toward its target. */
  pointerEase?: number;
  /** Time fed to the still frame under prefers-reduced-motion. */
  stillTime?: number;
  /** Mount the context at all. Defaults to true. */
  enabled?: boolean;
}

export interface GlCanvas {
  containerRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** True when a canvas should be mounted: animating or holding a still frame. */
  active: boolean;
  /** True while the loop is running, false for the reduced-motion still frame. */
  animated: boolean;
  failed: boolean;
  /** Repaint once. Needed when a still frame's inputs change, eg on theme swap. */
  redraw: () => void;
}

const DEFAULT_POINTER_EASE = 0.06;

function approach(current: number, target: number, ease: number): number {
  return current + (target - current) * ease;
}

/** Composite the GL buffer over an opaque bg. drawImage must run in-frame. */
function grabToBlob(
  src: HTMLCanvasElement,
  { bg, scale = 1 }: CaptureOptions,
): Promise<Blob> {
  const w = Math.max(1, Math.round(src.width * scale));
  const h = Math.max(1, Math.round(src.height * scale));
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ctx = out.getContext("2d");
  if (!ctx) return Promise.reject(new Error("2d context unavailable"));
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(src, 0, 0, w, h);
  return new Promise((resolve, reject) => {
    out.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      "image/png",
    );
  });
}

/**
 * The plumbing every atmosphere repeats: context, sizing, pause, reduced motion,
 * context loss and cleanup ordering. It owns no image and no parameters.
 */
export function useGlCanvas(options: UseGlCanvasOptions): GlCanvas {
  const {
    fragment,
    vertex,
    maxDpr = 2,
    renderScale = 1,
    pointer: trackPointer = false,
    pointerEase = DEFAULT_POINTER_EASE,
    stillTime = 0,
    enabled = true,
  } = options;

  const reduced = useReducedMotion();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const redrawRef = React.useRef<() => void>(() => {});

  const buildRef = React.useRef(options.uniforms);
  buildRef.current = options.uniforms;
  const frameRef = React.useRef(options.onFrame);
  frameRef.current = options.onFrame;

  const [failed, setFailed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const live = mounted && enabled && !failed;
  const animated = live && !reduced;
  const still = live && !!reduced;
  const active = animated || still;

  React.useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const surface = createGlSurface({
      canvas,
      fragment,
      vertex,
      uniforms: buildRef.current(),
      onContextLost: () => setFailed(true),
    });
    if (!surface) {
      setFailed(true);
      return;
    }

    const scale = Math.max(renderScale, 0.1);
    let width = 0;
    let height = 0;
    let dpr = 0;

    const stretch = () => {
      const box = container.getBoundingClientRect();
      const w = Math.ceil(box.width);
      const h = Math.ceil(box.height);
      if (w <= 0 || h <= 0) return false;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      return true;
    };

    const measure = () => {
      const box = container.getBoundingClientRect();
      const w = Math.ceil(box.width);
      const h = Math.ceil(box.height);
      if (w <= 0 || h <= 0) return false;
      const nextDpr = Math.min(window.devicePixelRatio || 1, maxDpr) * scale;
      if (w !== width || h !== height || nextDpr !== dpr) {
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        surface.resize(w, h, nextDpr);
      }
      width = w;
      height = h;
      dpr = nextDpr;
      return true;
    };

    let settleTimer = 0;
    const settle = (after: () => void) => {
      stretch();
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        if (measure()) after();
      }, RESIZE_SETTLE_MS);
    };

    const pointer: GlPointer = { x: 0, y: 0, amount: 0, inside: false };
    let pointerTarget = 0;
    let elapsed = 0;
    let pending: {
      opts: CaptureOptions;
      resolve: (blob: Blob) => void;
      reject: (err: unknown) => void;
    } | null = null;

    const draw = (time: number) => {
      pointer.amount = approach(pointer.amount, pointerTarget, pointerEase);
      const u = surface.uniforms;
      const clock = u.uTime;
      if (clock) clock.value = time;
      frameRef.current?.(u, { time, width, height, dpr, pointer });
      surface.render();
      if (pending) {
        const { opts, resolve, reject } = pending;
        pending = null;
        grabToBlob(canvas, opts).then(resolve, reject);
      }
    };
    redrawRef.current = () => {
      if (measure()) draw(still ? stillTime : elapsed);
    };

    if (!measure()) {
      surface.dispose();
      return;
    }

    captureRegistry.set(
      canvas,
      (opts) =>
        new Promise<Blob>((resolve, reject) => {
          pending = { opts, resolve, reject };
          // Force one in-frame draw+grab; covers the paused and still cases too.
          redrawRef.current();
        }),
    );

    if (still) {
      draw(stillTime);
      const observer =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(() => {
              settle(() => draw(stillTime));
            });
      observer?.observe(container);
      return () => {
        redrawRef.current = () => {};
        captureRegistry.delete(canvas);
        window.clearTimeout(settleTimer);
        observer?.disconnect();
        surface.dispose();
        canvas.style.width = "";
        canvas.style.height = "";
      };
    }

    let raf = 0;
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

    let box = container.getBoundingClientRect();
    const remeasure = () => {
      box = container.getBoundingClientRect();
    };

    const onMove = (event: PointerEvent) => {
      if (!trackPointer) return;
      pointer.x = event.clientX - box.left - box.width / 2;
      pointer.y = box.height / 2 - (event.clientY - box.top);
      pointer.inside = true;
      pointerTarget = 1;
    };
    const onLeave = () => {
      pointer.inside = false;
      pointerTarget = 0;
    };
    if (trackPointer) {
      container.addEventListener("pointermove", onMove, { passive: true });
      container.addEventListener("pointerleave", onLeave, { passive: true });
      window.addEventListener("scroll", remeasure, {
        passive: true,
        capture: true,
      });
    }

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
        : new ResizeObserver(() => {
            settle(remeasure);
          });
    observer?.observe(container);

    run();

    return () => {
      killed = true;
      redrawRef.current = () => {};
      captureRegistry.delete(canvas);
      window.clearTimeout(settleTimer);
      if (trackPointer) {
        container.removeEventListener("pointermove", onMove);
        container.removeEventListener("pointerleave", onLeave);
        window.removeEventListener("scroll", remeasure, { capture: true });
      }
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
      stop();
      surface.dispose();
      canvas.style.width = "";
      canvas.style.height = "";
    };
  }, [
    active,
    still,
    fragment,
    vertex,
    maxDpr,
    renderScale,
    trackPointer,
    pointerEase,
    stillTime,
  ]);

  const redraw = React.useCallback(() => redrawRef.current(), []);
  return { containerRef, canvasRef, active, animated, failed, redraw };
}
