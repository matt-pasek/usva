import { glsl } from "../atmospheres-core/atmospheres-glsl.js";

const WAVES = 4;

export const vareFragmentShader = /* glsl */ `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;
uniform float uPointer;
uniform float uAngle;
uniform float uSpread;
uniform float uWavenumber;
uniform float uSpeed;
uniform float uWarp;
uniform float uWarpScale;
uniform float uJitter;
uniform float uSoft;
uniform float uDetail;
uniform float uNode;
uniform float uGain;
uniform vec2  uSource;
uniform float uFalloff;
uniform float uSpan;
uniform float uLens;
uniform float uLensSigma;
uniform float uAlpha;
uniform float uAbsorb;
uniform vec3  uBody;
uniform vec3  uDeep;
uniform vec3  uEdgeColor;

out vec4 fragColor;

${glsl("fbm", "dither")}

const float TAU = 6.28318530718;

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 ndc = (2.0 * gl_FragCoord.xy - uResolution) / uResolution.y;

  vec2 warp = vec2(
    fbm2(ndc * uWarpScale + vec2(uTime * 0.03, 0.0), 2),
    fbm2(ndc * uWarpScale + vec2(9.7, uTime * 0.024), 2)
  ) - 0.5;
  vec2 p = ndc + warp * uWarp;

  vec2 source = vec2(uSource.x * aspect, uSource.y);
  vec2 travel = vec2(cos(uAngle), sin(uAngle));

  vec2 toMouse = p - uMouse;
  float lens = uPointer * uLens
    * exp(-dot(toMouse, toMouse) / (uLensSigma * uLensSigma));

  float bands = 0.0;
  float squares = 0.0;

  for (int i = 0; i < ${WAVES}; i++) {
    float fi = float(i);
    float angle = uAngle + (hash11(fi * 3.17 + 0.5) - 0.5) * uSpread;
    float k = uWavenumber * (0.7 + 1.1 * hash11(fi * 7.31 + 1.7));
    float w = uSpeed * (0.6 + 0.8 * hash11(fi * 11.7 + 4.3));

    vec2 dir = vec2(cos(angle), sin(angle));

    // The shared domain warp bends every front identically, so on its own it
    // cannot stop two fronts beating against each other. This one is per front.
    float drift = fbm2(
      p * uWarpScale * 1.7 + vec2(fi * 21.7, uTime * 0.018), 2
    ) - 0.5;

    vec2 bendAxis = normalize(vec2(
      cos(angle + 1.5708 + fi * 0.31),
      sin(angle + 1.5708 + fi * 0.31)
    ));
    float bend = (fbm2(
      p * (uWarpScale * (0.7 + 0.18 * fi)) + vec2(fi * 7.1),
      2
    ) - 0.375) * (0.7 + 0.22 * fi);

    float phase = dot(p - source + bendAxis * bend, dir) * k - w * uTime
      + hash11(fi * 5.13 + 2.9) * TAU + drift * uJitter * TAU + lens;

    float thickness = 0.5 + 0.5
      * fbm2(p * uDetail + vec2(fi * 13.0, uTime * 0.02), 2);
    float weight = fi < 2.0 ? 1.0 : mix(0.4, 0.6, hash11(fi + 8.4));
    // A soft cosine ridge, not a hairline: the boundary glows and falls off,
    // and a faint square-law fill keeps the space between from reading as a
    // diagram on black.
    float wave = 0.5 + 0.5 * cos(phase);
    float crest = pow(wave, uSoft * (0.8 + 0.4 * hash11(fi * 2.3 + 0.7)));
    float band = (crest + 0.1 * wave * wave) * thickness * weight;

    bands += band;
    squares += band * band;
  }

  float overlap = max(0.5 * (bands * bands - squares), 0.0);
  float nodes = smoothstep(0.3, 1.0, overlap);
  nodes *= nodes;
  float emission = bands + nodes * uNode;

  float depth = clamp(dot(p - source, travel) / uSpan, 0.0, 1.0);
  vec3 hue = mix(uBody, uDeep, depth);
  hue = mix(uEdgeColor, hue, smoothstep(0.0, 0.3, depth));

  float reach = length(p - source);
  float arrival = 1.0 / (1.0 + uFalloff * reach * reach);

  vec3 col = hue * emission * arrival * uGain;
  float amount = clamp(emission * arrival * uGain, 0.0, 1.0);

  // Tonemapped on luminance, not per channel, so a bright node saturates
  // toward the accent instead of washing to white. sisu must not bloom.
  float lum = max(col.r, max(col.g, col.b));
  float peak = 1.0 - exp(-lum);
  vec3 tint = col / max(lum, 1e-4);

  vec3 rgb = dither(mix(tint, tint * 0.78, uAbsorb), gl_FragCoord.xy, 0.006);
  float alpha = mix(peak, amount * 0.85, uAbsorb) * uAlpha;
  alpha = ditherAlpha(alpha, gl_FragCoord.xy, 0.004);

  fragColor = vec4(clamp(rgb, 0.0, 1.0), clamp(alpha, 0.0, 1.0));
}
`;
