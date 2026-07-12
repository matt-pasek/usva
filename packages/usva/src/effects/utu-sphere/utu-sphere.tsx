"use client";
import * as React from "react";
import { cn } from "../../cn.js";
import { resolveColor } from "../effects-core/effects-color.js";
import { useGlCanvas } from "../effects-core/use-gl-canvas.js";
import { useThemeVersion } from "../effects-core/use-token-colors.js";
import {
  setSphereColors,
  setSphereFrame,
  setSphereParams,
  sphereUniforms,
} from "./sphere.js";
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
import { sphereFragmentShader } from "./sphere-shader.js";

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

    const themeVersion = useThemeVersion();
    // biome-ignore lint/correctness/useExhaustiveDependencies: a theme swap re-resolves the same colour strings to new channels.
    const ramp = React.useMemo(
      () => readColors({ accentColor, deep: cDeep, mid: cMid, hot: cHot }),
      [accentColor, cDeep, cMid, cHot, themeVersion],
    );
    const rampRef = React.useRef(ramp);
    rampRef.current = ramp;

    const lean = React.useRef<[number, number]>([0, 0]);

    const canvas = useGlCanvas({
      fragment: sphereFragmentShader,
      uniforms: () => sphereUniforms(rampRef.current, paramsRef.current),
      pointer: true,
      pointerEase: LEAN_EASE,
      onFrame: (u, frame) => {
        const p = paramsRef.current;
        const elapsed = frame.time;
        const radius = breathe(elapsed, p.radius, p.breathAmt, p.breathRate);
        const bandsNow = breathe(
          elapsed,
          p.bands,
          p.breathAmt * 0.6,
          p.breathRate,
        );
        if (interactiveRef.current) {
          const short = Math.min(frame.width, frame.height) || 1;
          lean.current[0] = approach(
            lean.current[0],
            (frame.pointer.x / short) * 2,
            LEAN_EASE,
          );
          lean.current[1] = approach(
            lean.current[1],
            (frame.pointer.y / short) * 2,
            LEAN_EASE,
          );
        }
        setSphereColors(u, rampRef.current);
        setSphereParams(u, p);
        setSphereFrame(u, {
          time: elapsed * speedRef.current,
          radius,
          bands: bandsNow,
          lean: lean.current,
          leanAmt: interactiveRef.current ? frame.pointer.amount : 0,
          alpha: opacityRef.current,
        });
      },
    });

    const { redraw } = canvas;
    // biome-ignore lint/correctness/useExhaustiveDependencies: the still frame must repaint when the ramp changes.
    React.useEffect(() => {
      redraw();
    }, [redraw, ramp]);

    const sphereOn = canvas.active;

    return (
      <div
        ref={(node) => {
          canvas.containerRef.current = node;
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
            <canvas ref={canvas.canvasRef} className="block h-full w-full" />
          </div>
        ) : null}
        {children}
      </div>
    );
  },
);
UtuSphere.displayName = "UtuSphere";
