"use client";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  type BlendMode,
  blendUniform,
  resolveBlendMode,
  resolveColor,
} from "../effects-core/effects-color.js";
import { useGlCanvas } from "../effects-core/use-gl-canvas.js";
import { useTokenColors } from "../effects-core/use-token-colors.js";
import {
  buildColors,
  DEFAULT_LIGHT,
  resolveParams,
  VAKO_ROLES,
  type VakoParams,
} from "./vako-field.js";
import { vakoFragmentShader } from "./vako-shader.js";
import {
  setVakoColors,
  setVakoFrame,
  setVakoParams,
  vakoUniforms,
} from "./vako-uniforms.js";

export interface VakoLight {
  /** Raking is the point: keep z low or the grooves stop throwing shadows. */
  direction?: [number, number, number];
  /** Defaults to the theme: a warm daylight on clay, the accent on metal. */
  color?: string;
}

export interface VakoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Wheel and drift rate multiplier. Defaults to 1, about 90s per revolution. */
  speed?: number;
  /** Overrides the material. Defaults from the ground: light clay, dark metal. */
  mode?: BlendMode;
  /** The lighting dial. This is what a theme swap actually changes. */
  light?: VakoLight;
  /** Overall opacity, 0..1. Defaults to 1. */
  opacity?: number;
  /** Escape hatch for the field parameters, for tuning demos. */
  params?: Partial<VakoParams>;
  children?: React.ReactNode;
}

/** Enough seconds in that the still frame lands on structure, not on seed noise. */
const STILL_TIME = 14;

export const Vako = React.forwardRef<HTMLDivElement, VakoProps>(
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

    const tokens = useTokenColors(VAKO_ROLES);
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
      fragment: vakoFragmentShader,
      stillTime: STILL_TIME,
      uniforms: () =>
        vakoUniforms(colorsRef.current, paramsRef.current, lightRef.current),
      onFrame: (u, frame) => {
        setVakoColors(u, colorsRef.current);
        setVakoParams(u, paramsRef.current);
        setVakoFrame(u, {
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
            {/* No mix-blend-mode here, unlike the emissive effects. A multiply
                canvas can only darken, and a dry ridge has to sit above bg, up
                to surface-2. vako is the ground rather than a stain on it, so it
                composites normally and the mode flips the lighting model. */}
            <canvas ref={canvas.canvasRef} className="block h-full w-full" />
          </div>
        ) : null}
        {children}
      </div>
    );
  },
);
Vako.displayName = "Vako";
