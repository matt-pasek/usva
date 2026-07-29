"use client";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  type BlendMode,
  blendStyleFor,
  blendUniform,
  type Rgb,
  resolveBlendMode,
  resolveColor,
} from "../atmospheres-core/atmospheres-color.js";
import { hiddenOnGround } from "../atmospheres-core/atmospheres-ground.js";
import { useGlCanvas } from "../atmospheres-core/use-gl-canvas.js";
import {
  useThemeVersion,
  useTokenColors,
} from "../atmospheres-core/use-token-colors.js";
import {
  approach,
  type LoimuColors,
  type LoimuParams,
  POINTER_EASE,
  resolveParams,
} from "./loimu-field.js";
import { loimuFragmentShader } from "./loimu-shader.js";
import {
  loimuUniforms,
  setLoimuColors,
  setLoimuFrame,
  setLoimuParams,
} from "./loimu-uniforms.js";

const ROLES = ["accent", "accent-2", "accent-alt"] as const;

/** Far enough in that the still frame shows a developed sheet, not a seed. */
const STILL_TIME = 14;

export interface LoimuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Flow and fold rate multiplier. Defaults to 1. */
  speed?: number;
  /** When on, the field swirls toward the eased cursor. Defaults to true. */
  interactive?: boolean;
  /** Overall opacity of the sheet, 0..1. Defaults to 1. */
  opacity?: number;
  /** Force the blend. Defaults to emissive on a dark ground, absorptive on a
   * light one, which is the only way this survives a light theme. */
  mode?: BlendMode;
  /** Override any hue stop with a CSS colour. Omitted stops read their token. */
  colors?: { body?: string; deep?: string; edge?: string };
  /** Escape hatch for the field parameters, for tuning demos. */
  params?: Partial<LoimuParams>;
  children?: React.ReactNode;
}

export const Loimu = React.forwardRef<HTMLDivElement, LoimuProps>(
  (
    {
      speed = 1,
      interactive = true,
      opacity = 1,
      mode,
      colors,
      params,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const cBody = colors?.body;
    const cDeep = colors?.deep;
    const cEdge = colors?.edge;

    const speedRef = React.useRef(speed);
    speedRef.current = speed;
    const interactiveRef = React.useRef(interactive);
    interactiveRef.current = interactive;
    const opacityRef = React.useRef(opacity);
    opacityRef.current = opacity;

    const paramsRef = React.useRef<LoimuParams>(resolveParams(params));
    paramsRef.current = resolveParams(params);

    const themeVersion = useThemeVersion();
    const scopeRef = React.useRef<HTMLDivElement | null>(null);
    const tokens = useTokenColors(ROLES, { scopeRef });
    const blend = resolveBlendMode(mode, tokens.bg);

    // biome-ignore lint/correctness/useExhaustiveDependencies: a theme swap re-resolves the same colour strings to new channels.
    const ramp = React.useMemo<LoimuColors>(() => {
      const stop = (value: string | undefined, fallback: Rgb): Rgb =>
        value ? resolveColor(value) : fallback;
      return {
        body: stop(cBody, tokens.colors.accent),
        deep: stop(cDeep, tokens.colors["accent-2"]),
        edge: stop(cEdge, tokens.colors["accent-alt"]),
      };
    }, [cBody, cDeep, cEdge, tokens, themeVersion]);

    const rampRef = React.useRef(ramp);
    rampRef.current = ramp;
    const blendRef = React.useRef(blend);
    blendRef.current = blend;

    const mouse = React.useRef<[number, number]>([0, 0]);

    const canvas = useGlCanvas({
      fragment: loimuFragmentShader,
      uniforms: () => loimuUniforms(rampRef.current, paramsRef.current),
      enabled: !hiddenOnGround("loimu", blend),
      pointer: true,
      pointerEase: POINTER_EASE,
      stillTime: STILL_TIME,
      maxDpr: 1.5,
      renderScale: 0.7,
      onFrame: (u, frame) => {
        const half = Math.max(frame.height, 1) / 2;
        if (interactiveRef.current) {
          mouse.current[0] = approach(
            mouse.current[0],
            frame.pointer.x / half,
            POINTER_EASE,
          );
          mouse.current[1] = approach(
            mouse.current[1],
            frame.pointer.y / half,
            POINTER_EASE,
          );
        }
        setLoimuColors(u, rampRef.current);
        setLoimuParams(u, paramsRef.current);
        setLoimuFrame(u, {
          time: frame.time * speedRef.current,
          mouse: mouse.current,
          pointer: interactiveRef.current ? frame.pointer.amount : 0,
          alpha: opacityRef.current,
          absorb: blendUniform(blendRef.current),
        });
      },
    });

    const { redraw } = canvas;
    // biome-ignore lint/correctness/useExhaustiveDependencies: the still frame must repaint when the ramp or the blend changes.
    React.useEffect(() => {
      redraw();
    }, [redraw, ramp, blend]);

    const on = canvas.active;

    return (
      <div
        ref={(node) => {
          canvas.containerRef.current = node;
          scopeRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        data-blend={blend}
        className={cn("relative isolate overflow-hidden", className)}
        {...props}
      >
        {on ? (
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
Loimu.displayName = "Loimu";
