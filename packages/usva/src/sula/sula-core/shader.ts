import { MAX_BLOBS, MAX_NECKS } from "./geometry.js";

export const vertexShader = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

/**
 * The field is signed distance, not a density sum: exact rounded pills merged with
 * a polynomial smooth-min (Inigo Quilez, MIT). A density kernel makes round balls,
 * and the nav needs pills of a given width.
 *
 * The surface normal comes from screen-space derivatives rather than a central
 * difference, which would cost four more field() evaluations per fragment, and
 * field() is a loop of smooth-mins. They must stay outside every branch, because
 * derivatives require uniform control flow.
 *
 * The chromatic fringe shifts the isoline per channel instead of resampling: d is
 * already a distance, so the offset is a first-order step along the normal.
 */
export const fragmentShader = `#version 300 es
precision highp float;

uniform float uTime;
uniform int uBlobCount;
uniform vec4 uBlobs[${MAX_BLOBS}];
uniform float uRadius[${MAX_BLOBS}];
uniform int uNeckCount;
uniform vec4 uNecks[${MAX_NECKS}];
uniform float uNeckR[${MAX_NECKS}];
uniform float uNeckStr[${MAX_NECKS}];
uniform float uK;
uniform vec3 uTint;
uniform vec3 uBackdrop;
uniform vec3 uAccent;
uniform float uAlpha;
uniform float uWobble;
uniform float uShine;
uniform float uDpr;
uniform vec2 uHoverPoint;
uniform float uHoverAmt;
uniform float uHoverSpread;

out vec4 outColor;

float sdRoundBox(vec2 p, vec2 b, float r){
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

float sdSegment(vec2 p, vec2 a, vec2 b, float r){
  vec2 pa = p - a, ba = b - a;
  float denom = max(dot(ba, ba), 1e-4);
  float h = clamp(dot(pa, ba) / denom, 0.0, 1.0);
  return length(pa - ba * h) - r;
}

float smin(float a, float b, float k){
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float field(vec2 p){
  float d = 1e5;
  for (int i = 0; i < ${MAX_BLOBS}; i++) {
    if (i >= uBlobCount) break;
    d = smin(d, sdRoundBox(p - uBlobs[i].xy, uBlobs[i].zw, uRadius[i]), uK);
  }
  for (int i = 0; i < ${MAX_NECKS}; i++) {
    if (i >= uNeckCount) break;
    float sd = sdSegment(p, uNecks[i].xy, uNecks[i].zw, uNeckR[i]);
    d = mix(d, smin(d, sd, uK), clamp(uNeckStr[i], 0.0, 1.0));
  }
  /* Two long travelling waves replace value noise: the edge bends in coherent
     runs instead of accumulating small random bumps. Work in CSS pixels so the
     wavelength stays the same on standard and retina displays. */
  vec2 cssP = p / max(uDpr, 1.0);
  float flow = sin(cssP.x * 0.024 + uTime * 1.25) * 0.62
             + sin((cssP.x + cssP.y) * 0.012 - uTime * 0.8) * 0.38;

  /* Hover follows the live pointer with a broad elliptical falloff. Its target
     position is eased on the CPU, so quick cursor movement pushes a responsive
     wave through the surface without teleporting the deformation. */
  vec2 delta = p - uHoverPoint;
  vec2 local = delta / vec2(max(uHoverSpread * 1.25, 1.0), max(uHoverSpread, 1.0));
  float hoverFall = exp(-dot(local, local) * 2.4);
  vec2 cssDelta = delta / max(uDpr, 1.0);
  float cursorWave = sin(cssDelta.x * 0.042 - uTime * 2.2) * 0.72
                   + sin((cssDelta.x + cssDelta.y) * 0.021 + uTime * 1.1) * 0.28;
  return d + flow * uWobble + cursorWave * uHoverAmt * hoverFall;
}

void main(){
  vec2 p = gl_FragCoord.xy;
  float d = field(p);

  float aa = max(fwidth(d), 1e-4);
  float alpha = 1.0 - smoothstep(-aa, aa, d);

  vec2 g = vec2(dFdx(d), dFdy(d));
  vec2 n = length(g) > 1e-5 ? normalize(g) : vec2(0.0, 1.0);

  float rim = smoothstep(-11.0, 0.0, d) * alpha;
  float fres = pow(1.0 - abs(dot(n, vec2(0.0, 1.0))), 3.0);
  float spec = pow(max(dot(n, normalize(vec2(0.35, 0.94))), 0.0), 18.0);
  float hairline = exp(-pow((d + 1.1) / 1.4, 2.0)) * alpha;

  vec3 glass = mix(uBackdrop, uTint, 0.92);
  glass += uAccent * (fres * 0.22 + spec * 0.5) * rim * uShine;
  glass += (uAccent * 0.16  * uShine + vec3(0.05) * mix(0.3, 1.0, uShine)) * hairline;

  vec3 chroma = vec3(
    1.0 - smoothstep(-aa, aa, d - 0.8),
    alpha,
    1.0 - smoothstep(-aa, aa, d + 0.8)
  );
  glass = mix(glass, glass * chroma, rim * 0.5 * uShine);

  outColor = vec4(glass, alpha * uAlpha);
}
`;
