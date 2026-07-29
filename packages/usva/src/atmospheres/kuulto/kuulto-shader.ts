import { glsl } from "../atmospheres-core/atmospheres-glsl.js";
import { CREASES } from "./kuulto-field.js";

/** The gradient is taken across a fixed fraction of a fold rather than a pixel:
 * sampling the height field a pixel apart would resolve the fbm's own grain and
 * the sheet would come back sandpapered. */
const GRAD_EPS = 0.035;

export const kuultoFragmentShader = /* glsl */ `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform float uScale;
uniform float uRelief;
uniform float uCrease;
uniform float uCreaseWidth;
uniform float uDrift;
uniform float uDrape;
uniform float uDrapeScale;
uniform float uSheen;
uniform float uGloss;
uniform float uWrap;
uniform float uContrast;
uniform float uPurity;
uniform vec3  uKey;
uniform vec3  uFill;
uniform vec3  uRim;
uniform float uGain;
uniform float uAlpha;
uniform float uAbsorb;
uniform vec3  uKeyColor;
uniform vec3  uFillColor;
uniform vec3  uRimColor;

out vec4 fragColor;

${glsl("fbm", "dither", "composite")}

/** One pleat. Odd in the signed distance to its axis, so the sheet lifts on one
 * side of the crease and drops on the other the way real cloth does. A Gaussian
 * bump would only ever make a welt. */
float pleat(vec2 p, float angle, vec2 centre, float width) {
  vec2 axis = vec2(cos(angle), sin(angle));
  float d = dot(p - centre, axis) / max(width, 1e-3);
  return d * exp(-d * d);
}

/** The drape, as a height. Three pleats on slow lissajous paths, plus one gentle
 * fbm so the cloth wanders and the eye can never trace a pleat back to a line. */
float height(vec2 p, float t) {
  float h = 0.0;

  for (int i = 0; i < ${CREASES}; i++) {
    float fi = float(i);
    // Golden-angle spacing: any rational fraction of a turn would let the pleats
    // line up into a corrugation every few seconds.
    float angle = 2.39996 * fi + t * uDrift * (0.6 + 0.2 * fi);
    vec2 centre = vec2(
      sin(t * uDrift * (1.3 + 0.4 * fi) + fi * 2.1),
      cos(t * uDrift * (0.9 + 0.5 * fi) + fi * 1.7)
    ) * 1.15;
    h += pleat(p, angle, centre, uCreaseWidth) * uCrease;
  }

  h += (fbm(vec3(p * uDrapeScale, t * 0.035), 3) - 0.5) * uDrape * 2.0;
  return h;
}

/** Central differences. The sheet is a height field, so the normal is just the
 * gradient stood up: a fold's whole appearance is decided here. */
vec3 surfaceNormal(vec2 p, float t) {
  vec2 e = vec2(${GRAD_EPS.toFixed(3)}, 0.0);
  float hx = height(p + e.xy, t) - height(p - e.xy, t);
  float hy = height(p + e.yx, t) - height(p - e.yx, t);
  vec2 grad = vec2(hx, hy) / (2.0 * e.x);
  return normalize(vec3(-grad * uRelief, 1.0));
}

/** Wrapped Lambert raised to a contrast power. The wrap softens the terminator
 * into cloth; the power drives everything that does not face a lamp down to
 * black, which is where the ground between the folds comes from. */
float lambert(vec3 n, vec3 l) {
  float d = (dot(n, l) + uWrap) / (1.0 + uWrap);
  return pow(max(d, 0.0), uContrast);
}

/** Blinn-Phong against a viewer straight down the z axis. This is the sheen that
 * a band function cannot have, and the whole reason the folds read as silk. */
float sheen(vec3 n, vec3 l) {
  vec3 h = normalize(l + vec3(0.0, 0.0, 1.0));
  return pow(max(dot(n, h), 0.0), uSheen);
}

vec3 lamp(vec3 n, vec3 dir, vec3 hue, float weight) {
  return hue * (lambert(n, dir) * weight + sheen(n, dir) * uGloss);
}

void main() {
  vec2 ndc = (2.0 * gl_FragCoord.xy - uResolution) / uResolution.y;
  vec2 p = ndc * uScale;

  vec3 n = surfaceNormal(p, uTime);

  vec3 col = lamp(n, normalize(uKey), uKeyColor, 1.0)
           + lamp(n, normalize(uFill), uFillColor, 0.85)
           + lamp(n, normalize(uRim), uRimColor, 0.55);

  col *= uGain;

  // Tonemapped on luminance, not per channel, so a lit crest saturates toward its
  // lamp instead of washing to white.
  float lum = max(col.r, max(col.g, col.b));
  float peak = 1.0 - exp(-lum);
  vec3 tint = col / max(lum, 1e-4);
  // A gamma on the normalised tint. Where two lamps overlap the mix drifts
  // grey; this deepens the minor channels so the dominant lamp keeps its hue,
  // and a pure lamp colour passes through untouched.
  tint = pow(tint, vec3(uPurity));

  vec3 rgb = dither(mix(tint, tint * 0.65, uAbsorb), gl_FragCoord.xy, 0.006);
  float alpha = peak * uAlpha;
  alpha = ditherAlpha(alpha, gl_FragCoord.xy, 0.004);

  fragColor = composite(rgb, alpha);
}
`;
