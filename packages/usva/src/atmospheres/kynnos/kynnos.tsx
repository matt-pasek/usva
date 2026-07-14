"use client";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  type BlendMode,
  blendUniform,
  resolveBlendMode,
  resolveColor,
} from "../atmospheres-core/atmospheres-color.js";
import { useGlCanvas } from "../atmospheres-core/use-gl-canvas.js";
import { useTokenColors } from "../atmospheres-core/use-token-colors.js";
import {
  buildColors,
  DEFAULT_LIGHT,
  KYNNOS_ROLES,
  type KynnosParams,
  resolveParams,
} from "./kynnos-field.js";
import { kynnosFragmentShader } from "./kynnos-shader.js";
import {
  kynnosUniforms,
  setKynnosColors,
  setKynnosFrame,
  setKynnosParams,
} from "./kynnos-uniforms.js";

export interface KynnosLight {
  /** Raking is the point: keep z low or the grooves stop throwing shadows. */
  direction?: [number, number, number];
  /** Defaults to the theme: a warm daylight on clay, the accent on metal. */
  color?: string;
}

export interface KynnosProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Wheel and drift rate multiplier. Defaults to 1, about 90s per revolution. */
  speed?: number;
  /** Overrides the material. Defaults from the ground: light clay, dark metal. */
  mode?: BlendMode;
  /** The lighting dial. This is what a theme swap actually changes. */
  light?: KynnosLight;
  /** Overall opacity, 0..1. Defaults to 1. */
  opacity?: number;
  /** Escape hatch for the field parameters, for tuning demos. */
  params?: Partial<KynnosParams>;
  children?: React.ReactNode;
}

/** Enough seconds in that the still frame lands on structure, not on seed noise. */
const STILL_TIME = 14;

export const Kynnos = React.forwardRef<HTMLDivElement, KynnosProps>(
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
    const direction = light?.direction;

    const speedRef = React.useRef(speed);
    speedRef.current = speed;
    const opacityRef = React.useRef(opacity);
    opacityRef.current = opacity;

    const tokens = useTokenColors(KYNNOS_ROLES);
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

    const lightDir = direction ?? DEFAULT_LIGHT;
    const lightRef = React.useRef(lightDir);
    lightRef.current = lightDir;

    const absorbRef = React.useRef(blendUniform(blend));
    absorbRef.current = blendUniform(blend);

    const canvas = useGlCanvas({
      fragment: kynnosFragmentShader,
      stillTime: STILL_TIME,
      maxDpr: 1.5,
      uniforms: () =>
        kynnosUniforms(colorsRef.current, paramsRef.current, lightRef.current),
      onFrame: (u, frame) => {
        setKynnosColors(u, colorsRef.current);
        setKynnosParams(u, paramsRef.current);
        setKynnosFrame(u, {
          time: frame.time * speedRef.current,
          alpha: opacityRef.current,
          absorb: absorbRef.current,
          light: lightRef.current,
        });
      },
    });

    const { redraw } = canvas;
    // biome-ignore lint/correctness/useExhaustiveDependencies: the still frame must repaint when the material or its light changes.
    React.useEffect(() => {
      redraw();
    }, [redraw, colors, lightDir, blend]);

    const on = canvas.active;

    return (
      <div
        ref={(node) => {
          canvas.containerRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        data-material={blend === "absorptive" ? "clay" : "metal"}
        className={cn("relative isolate overflow-hidden", className)}
        {...props}
      >
        {on ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            {/* No mix-blend-mode here, unlike the emissive atmospheres. A multiply
                canvas can only darken, and a dry ridge has to sit above bg, up
                to surface-2. kynnos is the ground rather than a stain on it, so it
                composites normally and the mode flips the lighting model. */}
            <canvas ref={canvas.canvasRef} className="block h-full w-full" />
          </div>
        ) : null}
        {children}
      </div>
    );
  },
);
Kynnos.displayName = "Kynnos";
