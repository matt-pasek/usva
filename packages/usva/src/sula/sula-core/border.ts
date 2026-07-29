import { Mesh, Program, Renderer, Triangle } from "ogl";
import {
  borderFragmentShader,
  borderVertexShader,
  MAX_FRAME_BLOBS,
} from "./border-shader.js";
import type { FieldColors } from "./field.js";

/** One animation frame of the liquid ring, already flattened to device pixels
 * with Y flipped, since `gl_FragCoord` counts up from the bottom. */
export interface BorderFrame {
  /** Ring centre in device px, Y-flipped. */
  center: [number, number];
  /** Ring half-extents in device px. */
  half: [number, number];
  /** Corner radius in device px. */
  radius: number;
  /** Half the band width in device px. */
  thickness: number;
  /** Peak edge displacement in device px, already scaled by energy. */
  wobble: number;
  /** Focus energy 0..1: lifts the rim and drives the perimeter sweep. */
  energy: number;
  /** Perimeter highlight position, 0..1 around the ring. */
  sweep: number;
  /** Seconds since start. */
  time: number;
  /** Up to MAX_FRAME_BLOBS pointer discs as flat vec4s (x, y, radius, strength). */
  blobs: number[];
  blobCount: number;
  /** Smooth-min radius for the pointer merge, in device px. */
  blobK: number;
  /** Edge-to-frame geometry reveal, 0..1. */
  intro: number;
}

export interface BorderField {
  resize(width: number, height: number, dpr: number): void;
  setColors(colors: FieldColors): void;
  draw(frame: BorderFrame): void;
  dispose(): void;
}

export interface CreateBorderFieldOptions {
  canvas: HTMLCanvasElement;
  colors: FieldColors;
  onContextLost?: () => void;
}

/**
 * A second small program in sula-core, parallel to `createField`. It shares the
 * colour and lighting helpers (`FieldColors`, the accent rim vocabulary) so the
 * fill and the frame can never drift in look, but renders a rounded-box ring
 * rather than a filled field.
 */
export function createBorderField(
  options: CreateBorderFieldOptions,
): BorderField | null {
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
    vertex: borderVertexShader,
    fragment: borderFragmentShader,
    transparent: true,
    depthTest: false,
    uniforms: {
      uTime: { value: 0 },
      uCenter: { value: [0, 0] },
      uHalf: { value: [0, 0] },
      uRadius: { value: 0 },
      uThickness: { value: 1 },
      uWobble: { value: 0 },
      uEnergy: { value: 0 },
      uSweep: { value: 0 },
      uDpr: { value: 1 },
      uBlobCount: { value: 0 },
      uBlobs: { value: new Array<number>(MAX_FRAME_BLOBS * 4).fill(0) },
      uBlobK: { value: 14 },
      uTint: { value: colors.tint },
      uBackdrop: { value: colors.backdrop },
      uAccent: { value: colors.accent },
      uShine: { value: colors.shine },
      uIntro: { value: 1 },
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
    draw(frame) {
      u.uTime.value = frame.time;
      u.uCenter.value = frame.center;
      u.uHalf.value = frame.half;
      u.uRadius.value = frame.radius;
      u.uThickness.value = frame.thickness;
      u.uWobble.value = frame.wobble;
      u.uEnergy.value = frame.energy;
      u.uSweep.value = frame.sweep;
      u.uBlobCount.value = frame.blobCount;
      u.uBlobs.value = frame.blobs;
      u.uBlobK.value = frame.blobK;
      u.uIntro.value = frame.intro;
      renderer.render({ scene: mesh });
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", handleLost);
      const lose = gl.getExtension("WEBGL_lose_context");
      lose?.loseContext();
    },
  };
}
