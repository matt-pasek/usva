export const borderVertexShader = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

/** How many pointer blobs the ring can smooth-union at once. The cursor is one;
 * the slot for a second keeps the door open for an eased trailing blob without
 * touching the shader. */
export const MAX_FRAME_BLOBS = 2;

/**
 * The frame is signed distance, not a density sum: an exact rounded-box ring
 * (`abs(win) - thickness`) with the pointer merged in by the same polynomial
 * smooth-min the fill field uses. This is the clean-room answer to LiquidBorder's
 * density-summed metaball, so the two share no technique.
 *
 * Lighting reuses the fill path's vocabulary: curvature-keyed accent rim, a
 * fresnel-ish flank, a directional shine, and a hairline core.
 */
export const borderFragmentShader = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uRadius;
uniform float uThickness;
uniform float uWobble;
uniform float uEnergy;
uniform float uSweep;
uniform float uDpr;
uniform int uBlobCount;
uniform vec4 uBlobs[${MAX_FRAME_BLOBS}];
uniform float uBlobK;
uniform vec3 uTint;
uniform vec3 uBackdrop;
uniform vec3 uAccent;
uniform float uShine;
uniform float uIntro;

out vec4 outColor;

float sdRoundBox(vec2 p, vec2 b, float r){
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

float smin(float a, float b, float k){
  float h = clamp(0.5 + 0.5 * (b - a) / max(k, 1e-4), 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float ringField(vec2 p){
  vec2 q = p - uCenter;
  float win = sdRoundBox(q, uHalf, uRadius);

  /* Two long travelling waves bend the edge in coherent runs. Measured in CSS
     pixels so the wavelength holds on retina, and scaled by the live energy so
     the ring is a still faint band at rest. */
  vec2 cssP = p / max(uDpr, 1.0);
  float introTurbulence = 1.0 + (1.0 - uIntro) * 2.2;
  float flow = sin(cssP.x * 0.020 + uTime * 1.10) * 0.60
             + sin((cssP.x + cssP.y) * 0.011 - uTime * 0.70) * 0.40;
  win += flow * uWobble * introTurbulence;

  /* Material occupies the outside of the rounded window, including the canvas
     corners. During intro its inner front travels from the canvas edge to the
     final border instead of fading a fully formed ring. */
  float edgeInset = max(min(uCenter.x - uHalf.x, uCenter.y - uHalf.y), 0.0);
  float front = mix(edgeInset, -uThickness, uIntro);
  float d = front - win;

  /* The pointer disc is smooth-union'd into the band, so the nearest edge necks
     and bulges toward the cursor. Its strength is gated on the CPU by how close
     the cursor sits to the ring, so it never reads as a dot in open space. */
  for (int i = 0; i < ${MAX_FRAME_BLOBS}; i++) {
    if (i >= uBlobCount) break;
    vec4 b = uBlobs[i];
    float disc = length(p - b.xy) - b.z;
    d = mix(d, smin(d, disc, uBlobK), clamp(b.w, 0.0, 1.0));
  }
  return d;
}

void main(){
  vec2 p = gl_FragCoord.xy;
  float d = ringField(p);

  float dCss = d / max(uDpr, 1.0);
  float aa = max(fwidth(d), 0.75 * uDpr);
  float alpha = 1.0 - smoothstep(-aa, aa, d);

  vec2 g = vec2(dFdx(d), dFdy(d));
  vec2 n = length(g) > 1e-5 ? normalize(g) : vec2(0.0, 1.0);

  float curv = clamp(
    (abs(dFdx(n.x)) + abs(dFdy(n.x)) + abs(dFdx(n.y)) + abs(dFdy(n.y)))
      * uBlobK * 0.6,
    0.0, 1.2);

  float rim = smoothstep(-3.0, 0.0, dCss) * alpha;
  float fres = pow(1.0 - abs(dot(n, vec2(0.0, 1.0))), 3.0);
  float spec = pow(max(dot(n, normalize(vec2(0.35, 0.94))), 0.0), 18.0);
  float hairline = exp(-pow((dCss + 0.55) / 0.9, 2.0)) * alpha;

  vec2 q = p - uCenter;
  float ang = atan(q.y, q.x) / 6.28318530718 + 0.5;
  float arc = abs(fract(ang - uSweep + 0.5) - 0.5);
  float sweep = exp(-pow(arc * 7.0, 2.0)) * uEnergy;

  /* The exterior shell is the exact theme background, so wrapper canvases
     disappear into the page instead of exposing tinted square corners. Only a
     narrow band at the liquid edge receives the SULA glass material. */
  float glassMask = smoothstep(-7.0, -0.15, dCss) * alpha * 0.82;
  vec3 edgeGlass = mix(uTint, uAccent, 0.12);
  vec3 glass = uBackdrop;
  glass = mix(glass, edgeGlass, glassMask);
  glass += uAccent * (fres * 0.22 + spec * 0.5) * (1.0 + curv * 0.8)
             * rim * uShine * (1.0 + uEnergy * 0.9);
  glass += uAccent * (0.16 + curv * 1.0) * hairline * uShine;
  glass += uAccent * sweep * glassMask * 0.6 * uShine;
  glass += vec3(0.05) * mix(0.3, 1.0, uShine) * hairline;

  outColor = vec4(glass, alpha);
}
`;
