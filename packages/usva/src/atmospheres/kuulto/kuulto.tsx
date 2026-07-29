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
  type KuultoColors,
  type KuultoParams,
  keyLight,
  POINTER_EASE,
  resolveParams,
} from "./kuulto-field.js";
import { kuultoFragmentShader } from "./kuulto-shader.js";
import {
  kuultoUniforms,
  setKuultoColors,
  setKuultoFrame,
  setKuultoParams,
} from "./kuulto-uniforms.js";

const ROLES = ["accent", "accent-2", "accent-alt"] as const;

/** Far enough in that the pleats have travelled off their seed positions. */
const STILL_TIME = 22;

export interface KuultoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Drift and drape rate multiplier. Defaults to 1. */
  speed?: number;
  /** When on, the cursor swings the key lamp and the folds re-catch it.
   * Defaults to true. */
  interactive?: boolean;
  /** Overall opacity of the sheet, 0..1. Defaults to 1. */
  opacity?: number;
  /** Force the blend. Defaults to emissive on a dark ground, absorptive on a
   * light one, which is the only way this survives a light theme. */
  mode?: BlendMode;
  /** Override any lamp with a CSS colour. Omitted lamps read their token. */
  colors?: { key?: string; fill?: string; rim?: string };
  /** Escape hatch for the drape parameters, for tuning demos. */
  params?: Partial<KuultoParams>;
  children?: React.ReactNode;
}

export const Kuulto = React.forwardRef<HTMLDivElement, KuultoProps>(
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
    const cKey = colors?.key;
    const cFill = colors?.fill;
    const cRim = colors?.rim;

    const speedRef = React.useRef(speed);
    speedRef.current = speed;
    const interactiveRef = React.useRef(interactive);
    interactiveRef.current = interactive;
    const opacityRef = React.useRef(opacity);
    opacityRef.current = opacity;

    const paramsRef = React.useRef<KuultoParams>(resolveParams(params));
    paramsRef.current = resolveParams(params);

    const themeVersion = useThemeVersion();
    const scopeRef = React.useRef<HTMLDivElement | null>(null);
    const tokens = useTokenColors(ROLES, { scopeRef });
    const blend = resolveBlendMode(mode, tokens.bg);

    // biome-ignore lint/correctness/useExhaustiveDependencies: a theme swap re-resolves the same colour strings to new channels.
    const lamps = React.useMemo<KuultoColors>(() => {
      const lamp = (value: string | undefined, fallback: Rgb): Rgb =>
        value ? resolveColor(value) : fallback;
      return {
        key: lamp(cKey, tokens.colors.accent),
        fill: lamp(cFill, tokens.colors["accent-2"]),
        rim: lamp(cRim, tokens.colors["accent-alt"]),
      };
    }, [cKey, cFill, cRim, tokens, themeVersion]);

    const lampsRef = React.useRef(lamps);
    lampsRef.current = lamps;
    const blendRef = React.useRef(blend);
    blendRef.current = blend;

    const mouse = React.useRef<[number, number]>([0, 0]);

    const canvas = useGlCanvas({
      fragment: kuultoFragmentShader,
      uniforms: () => kuultoUniforms(lampsRef.current, paramsRef.current),
      enabled: !hiddenOnGround("kuulto", blend),
      pointer: true,
      pointerEase: POINTER_EASE,
      stillTime: STILL_TIME,
      maxDpr: 1.5,
      renderScale: 0.8,
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
        setKuultoColors(u, lampsRef.current);
        setKuultoParams(u, paramsRef.current);
        setKuultoFrame(u, {
          time: frame.time * speedRef.current,
          key: keyLight(
            paramsRef.current,
            mouse.current,
            interactiveRef.current ? frame.pointer.amount : 0,
          ),
          alpha: opacityRef.current,
          absorb: blendUniform(blendRef.current),
        });
      },
    });

    const { redraw } = canvas;
    // biome-ignore lint/correctness/useExhaustiveDependencies: the still frame must repaint when the lamps or the blend change.
    React.useEffect(() => {
      redraw();
    }, [redraw, lamps, blend]);

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
Kuulto.displayName = "Kuulto";
