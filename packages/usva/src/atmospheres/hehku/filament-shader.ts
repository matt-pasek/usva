import { glsl } from "../atmospheres-core/atmospheres-glsl.js";

/**
 * Hehku is one object, not a field: a single filament coiling through void,
 * heated until the places where it bunches against itself glow green-white
 * while the long thin runs stay deep violet.
 *
 * There is no march. Around a thin capsule the squared distance along a ray is
 * a parabola, so the ray integral of the gaussian core has a closed form:
 * exp(-k * d0^2) / sin(theta), with d0 the closest approach and theta the angle
 * between ray and segment. That 1 / sin factor is the physics of the piece: a
 * ray running along the filament collects more light, which is why the coil
 * blooms exactly where it turns toward the eye or bunches against itself.
 */

const MAX_KNOTS = 97;

export const MAX_FILAMENT_SEGMENTS = MAX_KNOTS - 1;

export const filamentFragmentShader = /* glsl */ `#version 300 es
precision highp float;

uniform vec2  uResolution;
uniform vec3  uKnots[${MAX_KNOTS}];
uniform int   uSegments;
uniform float uDist;
uniform float uFocal;
uniform vec2  uOffset;
uniform float uThickness;
uniform float uGlow;
uniform float uBloom;
uniform vec3  uCool;
uniform vec3  uHot;
uniform float uExposure;
uniform float uAlpha;
uniform float uBlend;

out vec4 fragColor;

${glsl("dither", "composite")}

const int MAX_SEGMENTS = ${MAX_KNOTS - 1};

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / uResolution.y;

  vec3 ro = vec3(uOffset, uDist);
  vec3 rd = normalize(vec3(uv, -uFocal));

  float spark = 0.0;
  float core = 0.0;
  float halo = 0.0;

  for (int s = 0; s < MAX_SEGMENTS; s++) {
    if (s >= uSegments) break;
    vec3 a = uKnots[s];
    vec3 ba = uKnots[s + 1] - a;
    float ba2 = max(dot(ba, ba), 1e-5);
    vec3 w = ro - a;
    float bd = dot(rd, ba);
    // The denominator is ba2 * sin^2(theta); the floor caps the alignment
    // bloom so a ray staring straight down a segment stays finite.
    float denom = max(ba2 - bd * bd, ba2 * 0.1);
    float h = clamp((dot(w, ba) - bd * dot(w, rd)) / denom, 0.0, 1.0);
    vec3 q = a + ba * h;
    float t = max(dot(q - ro, rd), 0.0);
    vec3 pc = ro + rd * t - q;
    float dr = length(pc);
    float d = max(dr - uThickness, 0.0);
    // The coil's slow wander can sweep the strand through the eye point, and
    // a pass through the camera would white out the whole frame; the near
    // fade lets it slide past the lens instead.
    float boost = inversesqrt(max(1.0 - bd * bd / ba2, 0.1))
      * smoothstep(0.1, 0.9, t);
    spark += exp(-uGlow * 4.0 * dr * dr) * boost;
    core += exp(-uGlow * d * d) * boost;
    halo += exp(-uGlow * 0.14 * d * d) * boost;

    // The chain is closed, so every knot is the clamped end of two segments
    // and would be counted twice. One point term per segment start pays the
    // whole loop back exactly once.
    float ta = max(dot(-w, rd), 0.0);
    float dra = length(w + rd * ta);
    float da = max(dra - uThickness, 0.0);
    float nfa = smoothstep(0.1, 0.9, ta);
    spark -= exp(-uGlow * 4.0 * dra * dra) * nfa;
    core -= exp(-uGlow * da * da) * nfa;
    halo -= exp(-uGlow * 0.14 * da * da) * nfa;
  }

  spark = max(spark, 0.0);
  core = max(core, 0.0);
  halo = max(halo, 0.0);

  float bunch = max(halo - uBloom, 0.0);
  float heat = 1.0 - exp(-bunch * bunch * 0.1);
  // The heat ramp runs violet body, green-white strand centre, white where the
  // coil bunches: incandescence, not a flat white clip.
  vec3 glowRamp = mix(uHot, vec3(1.0), heat * 0.7);
  vec3 col = (uCool * (core * 0.5 + halo * 0.06)
    + glowRamp * (spark * (0.45 + 1.1 * heat) + 0.4 * core * heat))
    * uExposure;

  // Tonemapped on luminance, not per channel, so the bright passes saturate
  // toward the heat ramp instead of clipping to flat white.
  float lum = max(col.r, max(col.g, col.b));
  float peak = 1.0 - exp(-lum);
  vec3 display = col / max(lum, 1e-4);
  display = mix(display, display * display, uBlend);
  display = dither(display, gl_FragCoord.xy, 1.0 / 255.0);

  fragColor = composite(display, peak * uAlpha);
}
`;
