import { Mesh, Program, Renderer, Triangle } from "ogl";
import {
  MAX_BLOBS,
  MAX_NECKS,
  type PackedField,
  type PackedHover,
} from "./geometry.js";
import { fragmentShader, vertexShader } from "./shader.js";

export type Rgb = [number, number, number];

export interface FieldColors {
  tint: Rgb;
  backdrop: Rgb;
  accent: Rgb;
  /** 0 keeps the glass flat and matte, 1 is the full neon rim. */
  shine: number;
}

/**
 * Relative luminance of the surface the glass floats on. A dark theme wants the
 * full glow; a pale one would only look garish, so its shine is dialled down.
 */
export function shineForBackdrop(backdrop: Rgb): number {
  const [r, g, b] = backdrop;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return 0.32 + 0.68 * (1 - luminance) ** 1.4;
}

export interface FieldFrame {
  packed: PackedField;
  k: number;
  time: number;
  wobble: number;
  alpha: number;
  /** Localized hover ripple around one blob; null leaves the field calm. */
  hover?: PackedHover | null;
}

export interface NavField {
  resize(width: number, height: number, dpr: number): void;
  setColors(colors: FieldColors): void;
  draw(frame: FieldFrame): void;
  dispose(): void;
}

const FALLBACK: Rgb = [0, 0, 0];

/**
 * A canvas cannot sample the page behind it, so every colour the glass needs has
 * to be handed to the shader as a number. Tokens are authored in oklch, and the
 * only reliable way to turn any CSS colour string into channels is to paint it.
 */
export function resolveColor(value: string): Rgb {
  if (typeof document === "undefined") return FALLBACK;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return FALLBACK;
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [(r ?? 0) / 255, (g ?? 0) / 255, (b ?? 0) / 255];
  } catch {
    return FALLBACK;
  }
}

export interface CreateFieldOptions {
  canvas: HTMLCanvasElement;
  colors: FieldColors;
  onContextLost?: () => void;
}

export function createField(options: CreateFieldOptions): NavField | null {
  const { canvas, colors, onContextLost } = options;

  let renderer: Renderer;
  try {
    renderer = new Renderer({
      canvas,
      webgl: 2,
      dpr: 1,
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
  } catch {
    return null;
  }

  const gl = renderer.gl;
  if (!("drawBuffers" in gl)) return null;
  gl.clearColor(0, 0, 0, 0);

  const program = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    transparent: true,
    depthTest: false,
    uniforms: {
      uTime: { value: 0 },
      uBlobCount: { value: 0 },
      uBlobs: { value: new Array<number>(MAX_BLOBS * 4).fill(0) },
      uRadius: { value: new Array<number>(MAX_BLOBS).fill(0) },
      uNeckCount: { value: 0 },
      uNecks: { value: new Array<number>(MAX_NECKS * 4).fill(0) },
      uNeckR: { value: new Array<number>(MAX_NECKS).fill(0) },
      uNeckStr: { value: new Array<number>(MAX_NECKS).fill(0) },
      uK: { value: 14 },
      uTint: { value: colors.tint },
      uBackdrop: { value: colors.backdrop },
      uAccent: { value: colors.accent },
      uAlpha: { value: 1 },
      uWobble: { value: 0 },
      uShine: { value: colors.shine },
      uDpr: { value: 1 },
      uHoverPoint: { value: [0, 0] },
      uHoverAmt: { value: 0 },
      uHoverSpread: { value: 1 },
    },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
  const u = program.uniforms;

  const handleLost = (event: Event) => {
    event.preventDefault();
    onContextLost?.();
  };
  canvas.addEventListener("webglcontextlost", handleLost);

  return {
    resize(width, height, dpr) {
      u.uDpr.value = dpr;
      renderer.dpr = dpr;
      renderer.setSize(width, height);
    },
    setColors(next) {
      u.uTint.value = next.tint;
      u.uBackdrop.value = next.backdrop;
      u.uAccent.value = next.accent;
      u.uShine.value = next.shine;
    },
    draw({ packed, k, time, wobble, alpha, hover }) {
      u.uTime.value = time;
      u.uK.value = k;
      u.uWobble.value = wobble;
      u.uAlpha.value = alpha;
      u.uHoverPoint.value = hover?.point ?? [0, 0];
      u.uHoverAmt.value = hover?.amount ?? 0;
      u.uHoverSpread.value = hover?.spread ?? 1;
      u.uBlobCount.value = packed.blobCount;
      u.uBlobs.value = packed.blobs;
      u.uRadius.value = packed.radii;
      u.uNeckCount.value = packed.neckCount;
      u.uNecks.value = packed.necks;
      u.uNeckR.value = packed.neckRadii;
      u.uNeckStr.value = packed.neckStrengths;
      renderer.render({ scene: mesh });
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", handleLost);
      const lose = gl.getExtension("WEBGL_lose_context");
      lose?.loseContext();
    },
  };
}
