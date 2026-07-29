"use client";
import { useReducedMotion } from "motion/react";
import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../cn.js";
import { createBorderField } from "../sula-core/border.js";
import {
  type FieldColors,
  liftTint,
  resolveColor,
  shineForBackdrop,
} from "../sula-core/field.js";
import { useContextRecovery } from "../sula-core/recovery.js";
import { clamp01 } from "../sula-motion/curves.js";
import {
  BLOB_K,
  BLOB_RADIUS,
  DEFAULT_RADIUS,
  DEFAULT_THICKNESS,
  ENERGY_EASE,
  frameRing,
  INTRO_DELAY_SECONDS,
  INTRO_SECONDS,
  introFrame,
  POINTER_EASE,
  packBlob,
  packRing,
  pointerStrength,
  resolveRadius,
  SWEEP_SPEED,
  wobbleFor,
} from "./frame-geometry.js";

export interface SulaFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  /** false wraps its own box; true is a position:fixed viewport frame. */
  fixed?: boolean;
  /** Corner radius in px. Wrapper mode defaults to the box's computed
   * border-radius; fixed mode to a width scale. */
  radius?: number;
  /** Band width in px. Defaults to 2. */
  thickness?: number;
  /** Gap between the frame and the edge in px. Defaults to 0. */
  inset?: number;
  /** false mounts no canvas; reduced motion paints the static border. */
  fluid?: boolean;
  /** One-time reveal ramp on mount. Skipped under reduced motion. Defaults true. */
  intro?: boolean;
  accentColor?: string;
  backdrop?: string;
  tint?: string;
  shine?: number;
  children?: React.ReactNode;
}

const MAX_DPR = 2;

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
  const base: FieldColors = {
    backdrop,
    tint: resolveColor(tintToken || token("--usva-surface")),
    accent: resolveColor(overrides.accent ?? token("--usva-accent")),
    shine: overrides.shine ?? shineForBackdrop(backdrop),
  };
  return { ...base, tint: liftTint(base.tint, base.accent) };
}

/** Parses the top-left corner radius of an element, in px. */
function computedRadius(node: HTMLElement): number {
  const value = Number.parseFloat(getComputedStyle(node).borderTopLeftRadius);
  return Number.isFinite(value) ? value : 0;
}

export const SulaFrame = React.forwardRef<HTMLDivElement, SulaFrameProps>(
  (
    {
      fixed = false,
      radius,
      thickness = DEFAULT_THICKNESS,
      inset = 0,
      fluid = true,
      intro = true,
      accentColor,
      backdrop,
      tint,
      shine,
      className,
      style,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const reduced = useReducedMotion();
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const layerRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

    const thicknessRef = React.useRef(thickness);
    thicknessRef.current = thickness;
    const insetRef = React.useRef(inset);
    insetRef.current = inset;
    const radiusRef = React.useRef(radius);
    radiusRef.current = radius;
    const introRef = React.useRef(intro);
    introRef.current = intro;

    const overrides = React.useMemo(
      () => ({ backdrop, tint, accent: accentColor, shine }),
      [backdrop, tint, accentColor, shine],
    );
    const overridesRef = React.useRef(overrides);
    overridesRef.current = overrides;
    const fieldRef = React.useRef<ReturnType<typeof createBorderField>>(null);

    const { failed, generation, onContextLost, onContextReady } =
      useContextRecovery(canvasRef);
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    const animated = fluid && !reduced && !failed && mounted;
    const staticBorder = mounted && (!fluid || reduced || failed);
    const keepCanvas = fluid && !reduced && mounted;

    // biome-ignore lint/correctness/useExhaustiveDependencies: `generation` is not read here, it is what rebuilds the field on a restored context
    React.useEffect(() => {
      if (!animated) return;
      const canvas = canvasRef.current;
      const layer = layerRef.current;
      const container = containerRef.current;
      const measureNode = fixed ? layer : container;
      if (!canvas || !layer || !measureNode) return;

      const field = createBorderField({
        canvas,
        colors: readColors(measureNode, overridesRef.current),
        onContextLost,
      });
      if (!field) {
        onContextLost();
        return;
      }
      fieldRef.current = field;
      onContextReady();
      const refreshColors = () =>
        field.setColors(readColors(measureNode, overridesRef.current));

      let width = 0;
      let height = 0;
      let dpr = 1;
      const measure = (): boolean => {
        const w = fixed
          ? window.innerWidth
          : Math.ceil(measureNode.getBoundingClientRect().width);
        const h = fixed
          ? window.innerHeight
          : Math.ceil(measureNode.getBoundingClientRect().height);
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

      const pointer = { x: -1e5, y: -1e5 };
      let pointerTarget = 0;
      let presence = 0;
      let focusTarget = 0;
      let focus = 0;

      const ringFor = () =>
        frameRing({
          width,
          height,
          inset: insetRef.current,
          radius: resolveRadius({
            explicit: radiusRef.current,
            computed: fixed
              ? undefined
              : computedRadius(measureNode as HTMLElement),
            fixed,
            width,
          }),
        });

      const draw = (elapsed: number) => {
        presence += (pointerTarget - presence) * POINTER_EASE;
        focus += (focusTarget - focus) * ENERGY_EASE;

        const introActive = introRef.current;
        const introT = introActive
          ? clamp01((elapsed - INTRO_DELAY_SECONDS) / INTRO_SECONDS)
          : 1;

        const energy = clamp01(Math.max(presence, focus));
        const ring = ringFor();
        const introGeometry = introFrame(ring, introT);
        const packed = packRing(
          { ...ring, r: introGeometry.radius },
          dpr,
          height,
        );

        const strength = pointerStrength(pointer.x, pointer.y, ring, presence);
        const blobs = new Array<number>(2 * 4).fill(0);
        let blobCount = 0;
        if (strength > 0.01) {
          const b = packBlob(
            pointer.x,
            pointer.y,
            BLOB_RADIUS,
            strength,
            dpr,
            height,
          );
          blobs[0] = b[0];
          blobs[1] = b[1];
          blobs[2] = b[2];
          blobs[3] = b[3];
          blobCount = 1;
        }

        field.draw({
          center: packed.center,
          half: packed.half,
          radius: packed.radius,
          thickness: (thicknessRef.current / 2) * dpr,
          wobble: wobbleFor(Math.max(energy, 1 - introGeometry.progress)) * dpr,
          energy,
          sweep: (elapsed * SWEEP_SPEED) % 1,
          time: elapsed,
          blobs,
          blobCount,
          blobK: BLOB_K * dpr,
          intro: introGeometry.progress,
        });
      };

      if (!measure()) return;

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

      const pointerHost = fixed ? window : container;
      const onMove = (event: Event) => {
        const e = event as PointerEvent;
        if (fixed) {
          pointer.x = e.clientX;
          pointer.y = e.clientY;
        } else {
          const box = (container as HTMLElement).getBoundingClientRect();
          pointer.x = e.clientX - box.left;
          pointer.y = e.clientY - box.top;
        }
        pointerTarget = 1;
      };
      const onLeave = () => {
        pointerTarget = 0;
      };
      pointerHost?.addEventListener("pointermove", onMove as EventListener);
      pointerHost?.addEventListener("pointerleave", onLeave);

      const onFocusIn = (event: FocusEvent) => {
        const target = event.target as HTMLElement | null;
        if (target?.matches?.(":focus-visible")) focusTarget = 1;
      };
      const onFocusOut = () => {
        if (!container?.querySelector(":focus-visible")) focusTarget = 0;
      };
      if (!fixed) {
        container?.addEventListener("focusin", onFocusIn);
        container?.addEventListener("focusout", onFocusOut);
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
      io?.observe(measureNode);

      const onVisibility = () => {
        if (document.hidden || !visible) stop();
        else run();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const ro =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(() => measure());
      if (fixed) window.addEventListener("resize", measure);
      else ro?.observe(measureNode);

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
        pointerHost?.removeEventListener(
          "pointermove",
          onMove as EventListener,
        );
        pointerHost?.removeEventListener("pointerleave", onLeave);
        container?.removeEventListener("focusin", onFocusIn);
        container?.removeEventListener("focusout", onFocusOut);
        io?.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("resize", measure);
        ro?.disconnect();
        themeObserver?.disconnect();
        stop();
        field.dispose();
        fieldRef.current = null;
        canvas.style.width = "";
        canvas.style.height = "";
      };
    }, [animated, fixed, generation]);

    React.useEffect(() => {
      const measureNode = fixed ? layerRef.current : containerRef.current;
      if (!measureNode) return;
      fieldRef.current?.setColors(readColors(measureNode, overrides));
    }, [overrides, fixed]);

    const staticRingStyle: React.CSSProperties = {
      position: fixed ? "fixed" : "absolute",
      inset: `${inset}px`,
      borderRadius: fixed ? `${radius ?? DEFAULT_RADIUS}px` : "inherit",
      border: `${thickness}px solid color-mix(in oklab, var(--usva-accent) 55%, transparent)`,
      boxShadow:
        "0 0 24px color-mix(in oklab, var(--usva-accent) 22%, transparent)",
    };

    const layer = keepCanvas ? (
      <div
        ref={layerRef}
        aria-hidden="true"
        className={cn(
          fixed
            ? "pointer-events-none fixed inset-0 z-[2147483647]"
            : "pointer-events-none absolute inset-0 z-10",
          !animated && "hidden",
        )}
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>
    ) : null;

    const ring = staticBorder ? (
      <div
        aria-hidden="true"
        className={cn("pointer-events-none", fixed ? "z-[2147483647]" : "z-10")}
        style={staticRingStyle}
      />
    ) : null;

    if (fixed) {
      return (
        <div
          ref={(node) => {
            containerRef.current = node;
            if (typeof forwardedRef === "function") forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
          }}
          data-fluid={animated ? "on" : "off"}
          style={{ display: "contents" }}
          {...props}
        >
          {layer ? createPortal(layer, document.body) : null}
          {ring ? createPortal(ring, document.body) : null}
          {children}
        </div>
      );
    }

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        data-fluid={animated ? "on" : "off"}
        className={cn("relative isolate", className)}
        style={style}
        {...props}
      >
        {layer}
        {ring}
        {children}
      </div>
    );
  },
);
SulaFrame.displayName = "SulaFrame";
