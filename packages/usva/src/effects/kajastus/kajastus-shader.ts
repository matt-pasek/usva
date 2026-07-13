import { glsl } from "../effects-core/effects-glsl.js";

/**
 * Kajastus is an aurora seen from underneath: a vault, not a curtain. Three things
 * carry it and none of them are negotiable.
 *
 * 1. The camera sits at the origin, so a point on a ray is just rd * t and the
 *    radial distance equals t. Altitude is measured in a paraboloid field,
 *    hh = y + curve * r^2, which is a large-radius sphere near its apex. Its
 *    level sets arch overhead and drop away toward the horizon, so the geometry
 *    converges above you with no fake perspective anywhere. hh is quadratic in
 *    t, so the entry and exit of the emitting layer are solved analytically and
 *    every one of the 48 steps lands inside the aurora rather than in vacuum.
 *
 * 2. The noise domain is stretched 8:1 along the field lines, which for an
 *    aurora run vertically. Long and thin along, sharply detailed across: that
 *    anisotropy is the whole difference between an aurora and a cloud, and
 *    isotropic noise here gives violet clouds on near-black.
 *
 * 3. Aurora is optically thin. There is no Beer-Lambert term: emission
 *    accumulates additively with zero absorption, and pow(density, 2.2) keeps
 *    the ribbon edges crisp instead of milky.
 *
 * Hue follows altitude because that is the physics: oxygen green low, nitrogen
 * violet above it. kajo's accent-alt is green and its accent is violet.
 */

/** The march is jittered per pixel per frame, so the dither buys back the bands
 * a coarser step would otherwise show. 48 was paying for detail nobody could see. */
const STEPS = 32;
const H_LOW = 1.2;
const H_HIGH = 6.0;
const T_MAX = 90.0;

export const kajastusFragmentShader = /* glsl */ `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uLow;
uniform vec3  uHigh;
uniform vec3  uStar;
uniform float uPitch;
uniform float uCurve;
uniform float uFold;
uniform float uFoldScale;
uniform float uWarp;
uniform float uOffset;
uniform float uWidth;
uniform float uDetail;
uniform float uThreshold;
uniform float uDrift;
uniform float uRayFreq;
uniform float uRaySpeed;
uniform float uFar;
uniform float uExposure;
uniform float uStars;
uniform float uCorridor;
uniform float uCorridorY;
uniform float uCorridorH;
uniform float uAlpha;
uniform float uBlend;

out vec4 fragColor;

${glsl("fbm", "dither", "tonemap")}

const int STEPS = ${STEPS};
const float H_LOW = ${H_LOW.toFixed(2)};
const float H_HIGH = ${H_HIGH.toFixed(2)};
const float T_MAX = ${T_MAX.toFixed(1)};

/** Where a ray crosses altitude h, given hh(t) = ry*t + a*t^2. Always one
 * positive root for h > 0, so rays that dip below the eye still find the vault
 * far out, which is how it reaches past the horizon. */
float tAtHeight(float ry, float a, float h) {
  if (a < 1e-5) return ry > 1e-4 ? h / ry : -1.0;
  return (-ry + sqrt(ry * ry + 4.0 * a * h)) / (2.0 * a);
}

/** The ribbon centreline, meandering in z as a function of x. The warp is
 * applied on one axis only: that gives folds in the fabric, not turbulence. */
float centreline(float x, float t) {
  float warp = uWarp * (fbm2(vec2(x * uFoldScale * 0.35, t * 0.008), 2) - 0.5) * 2.0;
  float u = x + warp;
  return uOffset + uFold * (fbm2(vec2(u * uFoldScale, t * 0.011), 3) - 0.5) * 2.0;
}

float ribbon(float dz, float width) {
  return exp(-(dz * dz) / max(width * width, 1e-4));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / uResolution.y;

  float cp = cos(uPitch);
  float sp = sin(uPitch);
  vec3 rd = normalize(vec3(uv.x, uv.y * cp + 1.25 * sp, uv.y * sp - 1.25 * cp));

  float ry = rd.y;
  float aq = uCurve * (1.0 - ry * ry);
  float t0 = tAtHeight(ry, aq, H_LOW);
  float t1 = tAtHeight(ry, aq, H_HIGH);

  vec3 acc = vec3(0.0);
  float cover = 0.0;

  if (t0 > 0.0 && t1 > t0 && t0 < T_MAX) {
    t1 = min(t1, T_MAX);
    float dt = (t1 - t0) / float(STEPS);
    float jitter = ign(gl_FragCoord.xy + vec2(uTime * 61.7, uTime * 37.3));
    float span = H_HIGH - H_LOW;

    for (int i = 0; i < STEPS; i++) {
      float t = t0 + (float(i) + jitter) * dt;
      vec3 p = rd * t;
      float hh = p.y + uCurve * dot(p.xz, p.xz);
      float alt = (hh - H_LOW) / span;
      if (alt < 0.0 || alt > 1.0) continue;

      float zc = centreline(p.x, uTime);
      float mainSheet = ribbon(p.z - zc, uWidth);
      float sideA = ribbon(p.z - zc - 3.8, uWidth * 0.78);
      float sideB = ribbon(p.z - zc + 4.6, uWidth * 0.66);
      float sheet = mainSheet + 0.64 * sideA + 0.46 * sideB;
      if (sheet < 0.004) continue;

      float n = fbm2(
        vec2(p.x * uDetail + uDrift * uTime, hh * uDetail * 0.125),
        3
      );
      float shaped = clamp(n * 1.7 - uThreshold, 0.0, 1.0);
      float density = sheet * pow(shaped, 2.2);
      if (density < 1e-4) continue;

      float low = smoothstep(0.0, 0.08, alt);
      float crown = mix(1.0, 0.24, smoothstep(0.2, 1.0, alt));
      float phase = 6.2831853 * fbm2(vec2(p.x * 0.3, 4.7), 2);
      float rayWave = 0.5 + 0.5 * sin(uRayFreq * hh - uRaySpeed * uTime + phase);
      float rays = 0.58 + 0.42 * rayWave * rayWave * rayWave;

      float em = density * low * crown * rays * exp(-t * uFar) * dt;
      acc += em * mix(uLow, uHigh, smoothstep(0.02, 0.6, alt));
      cover += em;
    }
  }

  // pow() is undefined for a negative base in GLSL ES, and uv.y - uCorridorY is
  // negative over most of the lower frame. Squaring by hand, never pow(x, 2.0).
  float cd = (uv.y - uCorridorY) / max(uCorridorH, 1e-3);
  float corridor = 1.0 - min(uCorridor, 0.38) * exp(-0.55 * cd * cd);
  acc *= corridor;
  cover *= corridor;

  vec2 sky = vec2(atan(rd.z, rd.x), asin(clamp(rd.y, -1.0, 1.0))) * 26.0;
  vec2 cell = floor(sky);
  vec2 off = hash22(cell) - 0.5;
  vec2 local = fract(sky) - 0.5 - off * 0.7;
  float twinkle = step(0.962, hash12(cell + 3.1));
  float star = twinkle * exp(-dot(local, local) * 90.0);
  star *= smoothstep(-0.15, 0.06, rd.y) * exp(-cover * 3.0);

  vec3 col = acc * uExposure + star * uStars * uStar * (1.0 - uBlend);

  // Tonemapped on luminance, not per channel: the hot lobe of a fold stays
  // violet instead of clipping to white, and only the very peak heats up.
  float lm = max(col.r, max(col.g, col.b));
  float peak = 1.0 - exp(-lm);
  // Re-saturating exponent: rays that crossed both the green floor and the
  // violet folds average out milky, and the pow pulls the hue back.
  vec3 display = pow(col / max(lm, 1e-4), vec3(1.6));
  float heat = peak * peak;
  display = mix(display, vec3(1.0), heat * heat * 0.22);
  display = mix(display, display * display, uBlend);
  display = dither(display, gl_FragCoord.xy, 1.0 / 255.0);

  fragColor = vec4(clamp(display, 0.0, 1.0), peak * uAlpha);
}
`;
