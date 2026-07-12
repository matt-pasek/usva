/**
 * UtuSphere is a luminous fog volume, not glass. It raymarches an analytic
 * sphere and emits on the isolines of a drifting 3D noise field, so the body
 * reads as stacked glowing contour-shells you can see through, with wispy tails
 * shearing off the equator. Everything here is clean-room field math; it shares
 * nothing with sula-core's metaball shader (which is a lit glass surface, the
 * exact look this avoids). The one forbidden move is a fresnel silhouette rim.
 */

export const sphereVertexShader = /* glsl */ `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/** Fixed march depth. Baked as a constant so the loop stays uniform across the
 * quad, which keeps fwidth() (used for the isoline anti-alias) well defined. */
const STEPS = 32;

export const sphereFragmentShader = /* glsl */ `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform float uRadius;
uniform float uBands;
uniform float uSwirl;
uniform float uOmega;
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform float uNoiseBase;
uniform float uDrift;
uniform float uWispSigma;
uniform float uWispAmt;
uniform float uWispDrift;
uniform float uAbsorb;
uniform float uExposure;
uniform vec3  uDeep;
uniform vec3  uMid;
uniform vec3  uHot;
uniform float uAlpha;
uniform vec2  uLean;
uniform float uLeanAmt;

out vec4 fragColor;

const int STEPS = ${STEPS};

float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.yzx + 33.33);
  return fract((p.x + p.y) * p.z);
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

float fbm(vec3 p) {
  float a = 0.5;
  float s = 0.0;
  for (int i = 0; i < 3; i++) {
    s += a * vnoise(p);
    p = p * 2.02 + vec3(11.3, 7.7, 3.1);
    a *= 0.5;
  }
  return s;
}

float smoother(float t) {
  t = clamp(t, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec3 ramp(float d) {
  float t = clamp(d, 0.0, 1.0);
  vec3 lo = mix(uDeep, uMid, smoothstep(0.0, 0.55, t));
  return mix(lo, uHot, smoothstep(0.55, 1.0, t));
}

void main() {
  float m = min(uResolution.x, uResolution.y);
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / m;
  uv -= uLean * uLeanAmt * 0.12;

  float ym = exp(-(uv.y * uv.y) / max(uWispSigma, 1e-3));
  float Rout = uRadius * (1.0 + uWispAmt * ym);

  float rr2 = dot(uv, uv);
  float core = uRadius * uRadius - rr2;
  float zspan = core > 0.0 ? sqrt(core) : 0.0;

  float wisp = uWispAmt * ym * uRadius * 0.6;
  wisp *= 1.0 - smoothstep(uRadius * 0.4, Rout, length(uv));
  zspan = max(zspan, wisp);

  if (zspan <= 0.0) {
    fragColor = vec4(0.0);
    return;
  }

  float stepLen = (2.0 * zspan) / float(STEPS);
  float dphase = uDrift * uTime;
  vec3 col = vec3(0.0);
  float T = 1.0;

  for (int i = 0; i < STEPS; i++) {
    float z = zspan - (float(i) + 0.5) * stepLen;
    vec3 p = vec3(uv, z);

    float ang = uSwirl * p.y + uOmega * uTime;
    float s = sin(ang);
    float c = cos(ang);
    vec3 q = vec3(c * p.x - s * p.z, p.y, s * p.x + c * p.z);

    vec3 qn = q;
    qn.x *= mix(1.0, 0.65, ym);
    qn.y *= mix(1.0, 1.35, ym);
    qn += vec3(dphase * 0.5 + uWispDrift * uTime * ym, -dphase * 0.3, dphase);

    float ax = p.x / (1.0 + uWispAmt * ym);
    float rad = length(vec3(ax, p.y, p.z));
    float shell = smoother(1.0 - rad / uRadius);

    float n = fbm(qn * uNoiseFreq);
    float density = max(shell * (uNoiseBase + uNoiseAmp * n), 0.0);

    float b = density * uBands;
    float aa = fwidth(b) * 1.5 + 0.04;
    float fb = fract(b);
    float rim = smoothstep(0.5 - aa, 0.5, fb) * (1.0 - smoothstep(0.5, 0.5 + aa, fb));

    float em = (rim * 1.6 + 0.18) * density;
    col += T * em * ramp(density) * (1.0 / float(STEPS));
    T *= exp(-density * uAbsorb * stepLen);
  }

  col *= uExposure;
  col = vec3(1.0) - exp(-col);
  float peak = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
  vec3 display = col / max(peak, 1e-4);
  fragColor = vec4(display, peak * uAlpha);
}
`;
