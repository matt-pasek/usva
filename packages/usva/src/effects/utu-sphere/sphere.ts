import { Mesh, Program, Renderer, Triangle } from "ogl";
import type { Rgb, SphereColors, SphereParams } from "./sphere-geometry.js";
import { sphereFragmentShader, sphereVertexShader } from "./sphere-shader.js";

const FALLBACK: Rgb = [0, 0, 0];

/**
 * A canvas cannot sample the page behind it, so every colour is handed to the
 * shader as channels. Tokens are authored in oklch; painting the string to a 1px
 * canvas is the only reliable way to resolve any CSS colour. Kept local so the
 * effect depends on nothing from sula.
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

/** The per-frame values: everything else is set once via setParams/setColors. */
export interface SphereFrame {
  /** Seconds since start. */
  time: number;
  /** Breathing radius for this frame. */
  radius: number;
  /** Breathing band count for this frame. */
  bands: number;
  /** Eased pointer offset in normalized units; [0,0] when not interacting. */
  lean: [number, number];
  /** Fades the lean in and out, 0..1. */
  leanAmt: number;
  alpha: number;
}

export interface SphereRenderer {
  resize(width: number, height: number, dpr: number): void;
  setColors(colors: SphereColors): void;
  setParams(params: SphereParams): void;
  draw(frame: SphereFrame): void;
  dispose(): void;
}

export interface CreateSphereOptions {
  canvas: HTMLCanvasElement;
  colors: SphereColors;
  params: SphereParams;
  onContextLost?: () => void;
}

export function createSphere(
  options: CreateSphereOptions,
): SphereRenderer | null {
  const { canvas, colors, params, onContextLost } = options;

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
    vertex: sphereVertexShader,
    fragment: sphereFragmentShader,
    transparent: true,
    depthTest: false,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: [1, 1] },
      uRadius: { value: params.radius },
      uBands: { value: params.bands },
      uSwirl: { value: params.swirl },
      uOmega: { value: params.omega },
      uNoiseFreq: { value: params.noiseFreq },
      uNoiseAmp: { value: params.noiseAmp },
      uNoiseBase: { value: params.noiseBase },
      uDrift: { value: params.drift },
      uWispSigma: { value: params.wispSigma },
      uWispAmt: { value: params.wispAmt },
      uWispDrift: { value: params.wispDrift },
      uAbsorb: { value: params.absorb },
      uExposure: { value: params.exposure },
      uDeep: { value: colors.deep },
      uMid: { value: colors.mid },
      uHot: { value: colors.hot },
      uAlpha: { value: 1 },
      uLean: { value: [0, 0] },
      uLeanAmt: { value: 0 },
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
      renderer.dpr = dpr;
      renderer.setSize(width, height);
      u.uResolution.value = [width * dpr, height * dpr];
    },
    setColors(next) {
      u.uDeep.value = next.deep;
      u.uMid.value = next.mid;
      u.uHot.value = next.hot;
    },
    setParams(next) {
      u.uSwirl.value = next.swirl;
      u.uOmega.value = next.omega;
      u.uNoiseFreq.value = next.noiseFreq;
      u.uNoiseAmp.value = next.noiseAmp;
      u.uNoiseBase.value = next.noiseBase;
      u.uDrift.value = next.drift;
      u.uWispSigma.value = next.wispSigma;
      u.uWispAmt.value = next.wispAmt;
      u.uWispDrift.value = next.wispDrift;
      u.uAbsorb.value = next.absorb;
      u.uExposure.value = next.exposure;
    },
    draw(frame) {
      u.uTime.value = frame.time;
      u.uRadius.value = frame.radius;
      u.uBands.value = frame.bands;
      u.uLean.value = frame.lean;
      u.uLeanAmt.value = frame.leanAmt;
      u.uAlpha.value = frame.alpha;
      renderer.render({ scene: mesh });
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", handleLost);
      const lose = gl.getExtension("WEBGL_lose_context");
      lose?.loseContext();
    },
  };
}
