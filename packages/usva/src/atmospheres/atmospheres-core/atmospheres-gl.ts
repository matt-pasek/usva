import { Mesh, Program, Renderer, Triangle } from "ogl";

/**
 * ogl gates array uniforms on Array.isArray, so vectors must be plain number
 * arrays. A Float32Array silently uploads nothing at all.
 */
export type UniformValue = number | number[] | boolean;
export type Uniforms = Record<string, { value: UniformValue }>;

/** Writes a uniform if the shader declares it, so a trimmed shader never throws. */
export function setUniform(
  uniforms: Uniforms,
  name: string,
  value: UniformValue,
): void {
  const slot = uniforms[name];
  if (slot) slot.value = value;
}

export const fullscreenVertexShader = /* glsl */ `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export interface GlSurface {
  uniforms: Uniforms;
  resize(width: number, height: number, dpr: number): void;
  render(): void;
  dispose(): void;
}

export interface CreateGlSurfaceOptions {
  canvas: HTMLCanvasElement;
  fragment: string;
  vertex?: string;
  uniforms: Uniforms;
  onContextLost?: () => void;
}

/**
 * The shared shell: a WebGL2 context drawing one fullscreen triangle. It knows
 * nothing about any image. Returns null when WebGL2 is unavailable, so callers
 * fall back rather than throw.
 */
export function createGlSurface(
  options: CreateGlSurfaceOptions,
): GlSurface | null {
  const { canvas, fragment, uniforms, onContextLost } = options;

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
  if (!gl || !("drawBuffers" in gl)) return null;
  gl.clearColor(0, 0, 0, 0);

  let program: Program;
  try {
    program = new Program(gl, {
      vertex: options.vertex ?? fullscreenVertexShader,
      fragment,
      transparent: true,
      depthTest: false,
      uniforms,
    });
  } catch {
    return null;
  }

  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
  const live = program.uniforms as Uniforms;

  const handleLost = (event: Event) => {
    event.preventDefault();
    onContextLost?.();
  };
  canvas.addEventListener("webglcontextlost", handleLost);

  return {
    uniforms: live,
    resize(width, height, dpr) {
      renderer.dpr = dpr;
      renderer.setSize(width, height);
      const resolution = live.uResolution;
      if (resolution) resolution.value = [width * dpr, height * dpr];
    },
    render() {
      renderer.render({ scene: mesh });
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", handleLost);
      const lose = gl.getExtension("WEBGL_lose_context");
      lose?.loseContext();
    },
  };
}
