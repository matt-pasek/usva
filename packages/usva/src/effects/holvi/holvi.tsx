"use client";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  type BlendMode,
  blendStyleFor,
  blendUniform,
  resolveBlendMode,
  resolveColor,
} from "../effects-core/effects-color.js";
import { useGlCanvas } from "../effects-core/use-gl-canvas.js";
import { useTokenColors } from "../effects-core/use-token-colors.js";
import {
  resolveVaultParams,
  setVaultColors,
  setVaultFrame,
  setVaultParams,
  type VaultColors,
  type VaultParams,
  vaultUniforms,
} from "./vault.js";
import { vaultFragmentShader } from "./vault-shader.js";

const ROLES = ["accent", "accent-alt", "ink"] as const;

export interface HolviProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rate of the streaming rays and the fold drift. Defaults to 1. */
  speed?: number;
  /** Overall strength, 0..1. Defaults to 1. */
  opacity?: number;
  /** Dark grounds emit, light grounds stain. Defaults to the resolved bg. */
  mode?: BlendMode;
  /** Override the altitude ramp. Green low, violet high, cold stars behind. */
  colors?: { low?: string; high?: string; star?: string };
  /** Escape hatch for the field parameters, for tuning demos. */
  params?: Partial<VaultParams>;
  children?: React.ReactNode;
}

/** Seconds into the animation the reduced-motion still frame is taken from. */
const STILL_TIME = 8;

export const Holvi = React.forwardRef<HTMLDivElement, HolviProps>(
  (
    {
      speed = 1,
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
    const cLow = colors?.low;
    const cHigh = colors?.high;
    const cStar = colors?.star;

    const tokens = useTokenColors(ROLES);
    const blend = resolveBlendMode(mode, tokens.bg);

    const ramp = React.useMemo<VaultColors>(
      () => ({
        low: cLow ? resolveColor(cLow) : tokens.colors["accent-alt"],
        high: cHigh ? resolveColor(cHigh) : tokens.colors.accent,
        star: cStar ? resolveColor(cStar) : tokens.colors.ink,
      }),
      [cLow, cHigh, cStar, tokens],
    );

    const rampRef = React.useRef(ramp);
    rampRef.current = ramp;
    const speedRef = React.useRef(speed);
    speedRef.current = speed;
    const opacityRef = React.useRef(opacity);
    opacityRef.current = opacity;
    const blendRef = React.useRef(blend);
    blendRef.current = blend;

    const resolved = resolveVaultParams(params);
    const paramsRef = React.useRef(resolved);
    paramsRef.current = resolved;

    const canvas = useGlCanvas({
      fragment: vaultFragmentShader,
      uniforms: () => vaultUniforms(rampRef.current, paramsRef.current),
      maxDpr: 1.5,
      renderScale: 0.5,
      stillTime: STILL_TIME,
      onFrame: (u, frame) => {
        setVaultColors(u, rampRef.current);
        setVaultParams(u, paramsRef.current);
        setVaultFrame(u, {
          time: frame.time * speedRef.current,
          alpha: opacityRef.current,
          blend: blendUniform(blendRef.current),
        });
      },
    });

    const { redraw } = canvas;
    // biome-ignore lint/correctness/useExhaustiveDependencies: the still frame must repaint when the theme repaints the ramp.
    React.useEffect(() => {
      redraw();
    }, [redraw, ramp, blend]);

    const vaultOn = canvas.active;

    return (
      <div
        ref={(node) => {
          canvas.containerRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        data-fluid={vaultOn ? "on" : "off"}
        className={cn("relative isolate overflow-hidden", className)}
        {...props}
      >
        {vaultOn ? (
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
Holvi.displayName = "Holvi";
