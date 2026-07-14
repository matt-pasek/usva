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
  coolFrom,
  type FilamentColors,
  type FilamentView,
  filamentUniforms,
  hotFrom,
  resolveFilamentView,
  setFilamentColors,
  setFilamentFrame,
  setFilamentShape,
} from "./filament.js";
import {
  type FilamentParams,
  filamentKnots,
  resolveFilamentParams,
} from "./filament-curve.js";
import { filamentFragmentShader } from "./filament-shader.js";

const ROLES = ["accent", "accent-alt"] as const;

export interface HehkuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rate of the coil's wander and spin. Defaults to 1. It should stay slow. */
  speed?: number;
  /** Overall strength, 0..1. Defaults to 1. */
  opacity?: number;
  /** Dark grounds emit, light grounds stain. Defaults to the resolved bg. */
  mode?: BlendMode;
  /** Override the two ends of the heat ramp. */
  colors?: { cool?: string; hot?: string };
  /** Escape hatch for the curve, for tuning demos. */
  params?: Partial<FilamentParams>;
  /** Escape hatch for the camera and the heat ramp. */
  view?: Partial<FilamentView>;
  children?: React.ReactNode;
}

/** Seconds into the coil the reduced-motion still frame is taken from. */
const STILL_TIME = 14;

export const Hehku = React.forwardRef<HTMLDivElement, HehkuProps>(
  (
    {
      speed = 1,
      opacity = 1,
      mode,
      colors,
      params,
      view,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    const cCool = colors?.cool;
    const cHot = colors?.hot;

    const tokens = useTokenColors(ROLES);
    const blend = resolveBlendMode(mode, tokens.bg);

    const heat = React.useMemo<FilamentColors>(
      () => ({
        cool: cCool ? resolveColor(cCool) : coolFrom(tokens.colors.accent),
        hot: cHot ? resolveColor(cHot) : hotFrom(tokens.colors["accent-alt"]),
      }),
      [cCool, cHot, tokens],
    );

    const heatRef = React.useRef(heat);
    heatRef.current = heat;
    const speedRef = React.useRef(speed);
    speedRef.current = speed;
    const opacityRef = React.useRef(opacity);
    opacityRef.current = opacity;
    const blendRef = React.useRef(blend);
    blendRef.current = blend;

    const curve = resolveFilamentParams(params);
    const curveRef = React.useRef(curve);
    curveRef.current = curve;
    const camera = resolveFilamentView(view);
    const cameraRef = React.useRef(camera);
    cameraRef.current = camera;

    const canvas = useGlCanvas({
      fragment: filamentFragmentShader,
      uniforms: () =>
        filamentUniforms(heatRef.current, curveRef.current, cameraRef.current),
      maxDpr: 1.5,
      stillTime: STILL_TIME,
      onFrame: (u, frame) => {
        const p = curveRef.current;
        const time = frame.time * speedRef.current;
        setFilamentColors(u, heatRef.current);
        setFilamentShape(u, p, cameraRef.current);
        setFilamentFrame(u, {
          knots: filamentKnots(time, p),
          segments: p.segments,
          alpha: opacityRef.current,
          blend: blendUniform(blendRef.current),
        });
      },
    });

    const { redraw } = canvas;
    // biome-ignore lint/correctness/useExhaustiveDependencies: the still frame must repaint when the theme repaints the heat ramp.
    React.useEffect(() => {
      redraw();
    }, [redraw, heat, blend]);

    const coilOn = canvas.active;

    return (
      <div
        ref={(node) => {
          canvas.containerRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        data-fluid={coilOn ? "on" : "off"}
        className={cn("relative isolate overflow-hidden", className)}
        {...props}
      >
        {coilOn ? (
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
Hehku.displayName = "Hehku";
