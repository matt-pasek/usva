/**
 * Shared GLSL as strings, concatenated into a shader at build time. Every
 * fragment shader stays standalone: these are functions, never a framework.
 * An effect must not redeclare a name it pulls in from here.
 */

const hash13 = /* glsl */ `
float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}
`;

const vnoise = /* glsl */ `
float vnoise2(vec2 x) {
  vec2 i = floor(x);
  vec2 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float vnoise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash13(i + vec3(0.0, 0.0, 0.0));
  float n100 = hash13(i + vec3(1.0, 0.0, 0.0));
  float n010 = hash13(i + vec3(0.0, 1.0, 0.0));
  float n110 = hash13(i + vec3(1.0, 1.0, 0.0));
  float n001 = hash13(i + vec3(0.0, 0.0, 1.0));
  float n101 = hash13(i + vec3(1.0, 0.0, 1.0));
  float n011 = hash13(i + vec3(0.0, 1.0, 1.0));
  float n111 = hash13(i + vec3(1.0, 1.0, 1.0));
  return mix(
    mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
    mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
    f.z
  );
}
`;

const fbm = /* glsl */ `
float fbm(vec3 p, int octaves) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < octaves; i++) {
    s += a * vnoise(p);
    p = p * 2.02 + vec3(11.3, 7.7, 3.1);
    a *= 0.5;
  }
  return s;
}

float fbm2(vec2 p, int octaves) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < octaves; i++) {
    s += a * vnoise2(p);
    p = p * 2.02 + vec2(11.3, 7.7);
    a *= 0.5;
  }
  return s;
}
`;

const curl = /* glsl */ `
vec3 curlPotential(vec3 p) {
  return vec3(
    fbm(p, 3),
    fbm(p + vec3(31.4, 17.7, 9.2), 3),
    fbm(p + vec3(-7.1, 23.9, 41.3), 3)
  );
}

/** Divergence-free: the field shears and stretches but never bunches. */
vec3 curl(vec3 p, float eps) {
  vec3 dx = vec3(eps, 0.0, 0.0);
  vec3 dy = vec3(0.0, eps, 0.0);
  vec3 dz = vec3(0.0, 0.0, eps);
  vec3 px1 = curlPotential(p + dx);
  vec3 px0 = curlPotential(p - dx);
  vec3 py1 = curlPotential(p + dy);
  vec3 py0 = curlPotential(p - dy);
  vec3 pz1 = curlPotential(p + dz);
  vec3 pz0 = curlPotential(p - dz);
  float k = 1.0 / (2.0 * eps);
  return vec3(
    (py1.z - py0.z) - (pz1.y - pz0.y),
    (pz1.x - pz0.x) - (px1.z - px0.z),
    (px1.y - px0.y) - (py1.x - py0.x)
  ) * k;
}

/** The 2D case is the perpendicular gradient of a scalar potential. */
vec2 curl2(vec2 p, float eps) {
  float ny1 = fbm2(p + vec2(0.0, eps), 3);
  float ny0 = fbm2(p - vec2(0.0, eps), 3);
  float nx1 = fbm2(p + vec2(eps, 0.0), 3);
  float nx0 = fbm2(p - vec2(eps, 0.0), 3);
  float k = 1.0 / (2.0 * eps);
  return vec2(ny1 - ny0, nx0 - nx1) * k;
}
`;

const worley = /* glsl */ `
vec2 worleyF(vec2 p) {
  vec2 ip = floor(p);
  vec2 fp = fract(p);
  float f1 = 8.0;
  float f2 = 8.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 o = hash22(ip + g);
      vec2 r = g + o - fp;
      float d = dot(r, r);
      if (d < f1) {
        f2 = f1;
        f1 = d;
      } else if (d < f2) {
        f2 = d;
      }
    }
  }
  return vec2(sqrt(f1), sqrt(f2));
}

float worley(vec2 p) {
  return worleyF(p).x;
}

/** F2 - F1: zero on the cell walls, so it draws cracks, not cells. */
float craquelure(vec2 p) {
  vec2 f = worleyF(p);
  return f.y - f.x;
}
`;

const isoband = /* glsl */ `
float isoband(float fb, float aa) {
  return smoothstep(0.5 - aa, 0.5, fb) * (1.0 - smoothstep(0.5, 0.5 + aa, fb));
}

/** Anti-aliased contour rims of a field, count bands per unit. */
float isobands(float v, float count) {
  float b = v * count;
  float aa = fwidth(b) * 1.5 + 0.04;
  return isoband(fract(b), aa);
}
`;

const dither = /* glsl */ `
/** Interleaved gradient noise: blue-noise-ish for the cost of one fract. */
float ign(vec2 fragCoord) {
  return fract(52.9829189 * fract(dot(fragCoord, vec2(0.06711056, 0.00583715))));
}

vec3 dither(vec3 col, vec2 fragCoord, float amount) {
  return col + (ign(fragCoord) - 0.5) * amount;
}

float ditherAlpha(float a, vec2 fragCoord, float amount) {
  return a + (ign(fragCoord) - 0.5) * amount;
}
`;

const tonemap = /* glsl */ `
vec3 tonemapExp(vec3 c, float exposure) {
  return vec3(1.0) - exp(-c * exposure);
}

vec3 tonemapACES(vec3 x) {
  const float a = 2.51;
  const float b = 0.03;
  const float c = 2.43;
  const float d = 0.59;
  const float e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}
`;

interface Chunk {
  needs: readonly GlslChunk[];
  source: string;
}

export type GlslChunk =
  | "hash13"
  | "vnoise"
  | "fbm"
  | "curl"
  | "worley"
  | "isoband"
  | "dither"
  | "tonemap";

const CHUNKS: Record<GlslChunk, Chunk> = {
  hash13: { needs: [], source: hash13 },
  vnoise: { needs: ["hash13"], source: vnoise },
  fbm: { needs: ["vnoise"], source: fbm },
  curl: { needs: ["fbm"], source: curl },
  worley: { needs: ["hash13"], source: worley },
  isoband: { needs: [], source: isoband },
  dither: { needs: [], source: dither },
  tonemap: { needs: [], source: tonemap },
};

export const GLSL_CHUNK_NAMES = Object.keys(CHUNKS) as GlslChunk[];

/** Concatenates chunks with their dependencies, each emitted exactly once. */
export function glsl(...names: readonly GlslChunk[]): string {
  const seen = new Set<GlslChunk>();
  const parts: string[] = [];
  const visit = (name: GlslChunk) => {
    if (seen.has(name)) return;
    seen.add(name);
    for (const need of CHUNKS[name].needs) visit(need);
    parts.push(CHUNKS[name].source);
  };
  for (const name of names) visit(name);
  return parts.join("\n");
}
