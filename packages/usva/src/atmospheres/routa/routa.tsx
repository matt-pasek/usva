"use client";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  type BlendMode,
  blendStyleFor,
  blendUniform,
  resolveBlendMode,
  resolveColor,
} from "../atmospheres-core/atmospheres-color.js";
import { useGlCanvas } from "../atmospheres-core/use-gl-canvas.js";
import { useTokenColors } from "../atmospheres-core/use-token-colors.js";
import {
  buildColors,
  DEFAULT_LIGHT,
  ROUTA_ROLES,
  type RoutaParams,
  resolveParams,
} from "./routa-field.js";
import { routaFragmentShader } from "./routa-shader.js";
import {
  routaUniforms,
  setRoutaColors,
  setRoutaFrame,
  setRoutaParams,
} from "./routa-uniforms.js";

export interface RoutaLight {
  /** Keep z low: the heave only reads when the key rakes across it. */
  direction?: [number, number, number];
  /** Optional CSS colour for the dark-ground key. */
  color?: string;
}

export interface RoutaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Domain drift multiplier. Defaults to 1 and remains barely perceptible. */
  speed?: number;
  /** Force the material. By default the ground chooses frost-light or stain. */
  mode?: BlendMode;
  /** Raking light direction and optional dark-ground colour. */
  light?: RoutaLight;
  /** Overall opacity, 0..1. Defaults to 1. */
  opacity?: number;
  /** Escape hatch for frost cell, fissure, and relief parameters. */
  params?: Partial<RoutaParams>;
  children?: React.ReactNode;
}

const STILL_TIME = 27;

export const Routa = React.forwardRef<HTMLDivElement, RoutaProps>(
  (
    {
      speed = 1,
      mode,
      light,
      opacity = 1,
      params,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const lightColor = light?.color;
    const direction = light?.direction ?? DEFAULT_LIGHT;

    const speedRef = React.useRef(speed);
    speedRef.current = speed;
    const opacityRef = React.useRef(opacity);
    opacityRef.current = opacity;
    const lightRef = React.useRef(direction);
    lightRef.current = direction;

    const scopeRef = React.useRef<HTMLDivElement | null>(null);
    const tokens = useTokenColors(ROUTA_ROLES, { scopeRef });
    const blend = resolveBlendMode(mode, tokens.bg);

    const colors = React.useMemo(
      () =>
        buildColors(
          tokens.colors,
          blend,
          lightColor ? resolveColor(lightColor) : undefined,
        ),
      [tokens.colors, blend, lightColor],
    );
    const colorsRef = React.useRef(colors);
    colorsRef.current = colors;

    const resolved = resolveParams(params);
    const paramsRef = React.useRef(resolved);
    paramsRef.current = resolved;

    const blendRef = React.useRef(blend);
    blendRef.current = blend;

    const canvas = useGlCanvas({
      fragment: routaFragmentShader,
      stillTime: STILL_TIME,
      maxDpr: 1.5,
      uniforms: () =>
        routaUniforms(colorsRef.current, paramsRef.current, lightRef.current),
      onFrame: (u, frame) => {
        setRoutaColors(u, colorsRef.current);
        setRoutaParams(u, paramsRef.current);
        setRoutaFrame(u, {
          time: frame.time * speedRef.current,
          alpha: opacityRef.current,
          absorb: blendUniform(blendRef.current),
          light: lightRef.current,
        });
      },
    });

    const { redraw } = canvas;
    // biome-ignore lint/correctness/useExhaustiveDependencies: the still frame must repaint when the material, key, or ground changes.
    React.useEffect(() => {
      redraw();
    }, [redraw, colors, direction, blend]);

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
Routa.displayName = "Routa";
