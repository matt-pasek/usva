export type Rgb = [number, number, number];

/** Dark ground: emit. Light ground: stain the ground like pigment. */
export type BlendMode = "emissive" | "absorptive";

const BLACK: Rgb = [0, 0, 0];

/**
 * A canvas cannot sample the page behind it, so every colour reaches the shader
 * as channels. Tokens are authored in oklch, and painting the string into a 1px
 * canvas is the only reliable way to resolve an arbitrary CSS colour.
 */
export function resolveColor(value: string): Rgb {
  if (typeof document === "undefined") return BLACK;
  const text = value.trim();
  if (!text) return BLACK;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return BLACK;
    ctx.fillStyle = text;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [(r ?? 0) / 255, (g ?? 0) / 255, (b ?? 0) / 255];
  } catch {
    return BLACK;
  }
}

function toLinear(channel: number): number {
  const c = Math.min(Math.max(channel, 0), 1);
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** WCAG relative luminance, 0..1, from sRGB channels. */
export function relativeLuminance([r, g, b]: Rgb): number {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * The house law. Emissive glow on a light ground cannot be made to look matte,
 * so a light ground flips the atmosphere to pigment. The threshold sits well clear
 * of both poles: savi beige lands near 0.72, every dark theme under 0.02.
 */
export const LIGHT_GROUND = 0.4;

export function blendModeFor(background: Rgb): BlendMode {
  return relativeLuminance(background) > LIGHT_GROUND
    ? "absorptive"
    : "emissive";
}

export function resolveBlendMode(
  override: BlendMode | undefined,
  background: Rgb,
): BlendMode {
  return override ?? blendModeFor(background);
}

/**
 * The compositing half of the flip. Emissive canvases add their light to the
 * page; absorptive ones multiply, so a translucent pixel stains the ground and
 * a transparent one leaves it untouched.
 */
export function blendStyleFor(mode: BlendMode): {
  mixBlendMode: "plus-lighter" | "multiply";
} {
  return {
    mixBlendMode: mode === "absorptive" ? "multiply" : "plus-lighter",
  };
}

/** 1.0 when the shader should absorb, 0.0 when it should emit. */
export function blendUniform(mode: BlendMode): number {
  return mode === "absorptive" ? 1 : 0;
}
