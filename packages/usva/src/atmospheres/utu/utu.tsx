"use client";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  type BlendMode,
  blendStyleFor,
  blendUniform,
  pigmentFor,
  resolveBlendMode,
  resolveColor,
} from "../atmospheres-core/atmospheres-color.js";
import { useGlCanvas } from "../atmospheres-core/use-gl-canvas.js";
import {
  useThemeVersion,
  useTokenColors,
} from "../atmospheres-core/use-token-colors.js";
import {
  approach,
  breathe,
  buildRamp,
  LEAN_EASE,
  monoRamp,
  resolveParams,
  type UtuColors,
  type UtuEmissionColors,
  type UtuParams,
} from "./utu-field.js";
import { utuFragmentShader } from "./utu-shader.js";
import {
  setUtuColors,
  setUtuFrame,
  setUtuParams,
  utuUniforms,
} from "./utu-uniforms.js";

const ROLES = ["ink"] as const;

export interface UtuProps extends React.HTMLAttributes<HTMLDivElement> {
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
  /** Force the material. Defaults to fog on a dark ground and damp pigment on
   * a light one. */
  mode?: BlendMode;
  /** Escape hatch for the field parameters, for tuning demos. */
  params?: Partial<UtuParams>;
  children?: React.ReactNode;
}

interface ColorOverrides {
  accentColor?: string;
  deep?: string;
  mid?: string;
  hot?: string;
}

function readColors(overrides: ColorOverrides): UtuEmissionColors {
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

export const Utu = React.forwardRef<HTMLDivElement, UtuProps>(
  (
    {
      speed = 1,
      interactive = false,
      bands,
      accentColor,
      colors,
      opacity = 1,
      mode,
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

    const paramsRef = React.useRef<UtuParams>(
      resolveParams({ ...params, ...(bands !== undefined ? { bands } : {}) }),
    );
    paramsRef.current = resolveParams({
      ...params,
      ...(bands !== undefined ? { bands } : {}),
    });

    const themeVersion = useThemeVersion();
    const scopeRef = React.useRef<HTMLDivElement | null>(null);
    const tokens = useTokenColors(ROLES, { scopeRef });
    const blend = resolveBlendMode(mode, tokens.bg);
    // biome-ignore lint/correctness/useExhaustiveDependencies: a theme swap re-resolves the same colour strings to new channels.
    const ramp = React.useMemo<UtuColors>(() => {
      const emission = readColors({
        accentColor,
        deep: cDeep,
        mid: cMid,
        hot: cHot,
      });
      return {
        ...emission,
        pigment: pigmentFor(emission.mid, tokens.colors.ink),
      };
    }, [accentColor, cDeep, cMid, cHot, tokens, themeVersion]);
    const rampRef = React.useRef(ramp);
    rampRef.current = ramp;
    const blendRef = React.useRef(blend);
    blendRef.current = blend;

    const lean = React.useRef<[number, number]>([0, 0]);

    const canvas = useGlCanvas({
      fragment: utuFragmentShader,
      uniforms: () => utuUniforms(rampRef.current, paramsRef.current),
      pointer: true,
      pointerEase: LEAN_EASE,
      maxDpr: 1.5,
      renderScale: 0.8,
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
        setUtuColors(u, rampRef.current);
        setUtuParams(u, p);
        setUtuFrame(u, {
          time: elapsed * speedRef.current,
          radius,
          bands: bandsNow,
          lean: lean.current,
          leanAmt: interactiveRef.current ? frame.pointer.amount : 0,
          alpha: opacityRef.current,
          absorb: blendUniform(blendRef.current),
        });
      },
    });

    const { redraw } = canvas;
    // biome-ignore lint/correctness/useExhaustiveDependencies: the still frame must repaint when the ramp changes.
    React.useEffect(() => {
      redraw();
    }, [redraw, ramp, blend]);

    const sphereOn = canvas.active;

    return (
      <div
        ref={(node) => {
          canvas.containerRef.current = node;
          scopeRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        data-fluid={sphereOn ? "on" : "off"}
        data-blend={blend}
        className={cn("relative isolate overflow-hidden", className)}
        {...props}
      >
        {sphereOn ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <canvas
              ref={canvas.canvasRef}
              className="block h-full w-full"
              style={blendStyleFor(blend)}
            />
          </div>
        ) : null}
        {children}
      </div>
    );
  },
);
Utu.displayName = "Utu";
