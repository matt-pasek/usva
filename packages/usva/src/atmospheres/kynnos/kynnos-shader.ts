import { glsl } from "../atmospheres-core/atmospheres-glsl.js";

/**
 * kynnos is a lit heightfield, not a volume: one clay surface seen from above,
 * turning on a wheel far slower than you first notice. It reflects, it never
 * emits. There is no specular term anywhere below and there must never be one:
 * a lobe of any kind turns fired clay into wet glaze, and matte is the brief.
 */
export const kynnosFragmentShader = /* glsl */ `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uOrigin;
uniform float uSpin;
uniform float uFurrowFreq;
uniform float uWarpAmt;
uniform float uWarpFreq;
uniform float uBreakAmt;
uniform float uRidgeShape;
uniform float uDepth;
uniform float uSlope;
uniform float uMicroScale;
uniform float uMicroAmt;
uniform float uCrackScale;
uniform float uCrackAmt;
uniform float uAo;
uniform float uRough;
uniform float uAmbient;
uniform float uKey;
uniform float uDrift;
uniform float uDither;
uniform float uAlpha;
uniform float uAbsorb;
uniform float uMaxLum;
uniform vec3  uLightDir;
uniform vec3  uBody;
uniform vec3  uRidge;
uniform vec3  uShadow;
uniform vec3  uKeyColor;

out vec4 fragColor;

${glsl("fbm", "worley", "dither")}

const vec3 VIEW = vec3(0.0, 0.0, 1.0);

float ridgeProfile(float x) {
  float tri = 1.0 - abs(fract(x) * 2.0 - 1.0);
  return pow(tri, uRidgeShape);
}

/* fbm2 sums halving amplitudes from 0.5, so 3 octaves land in [0, 0.875] and 2
   in [0, 0.75]. Recentre and rescale, or the warp is a third of the amplitude
   the parameter claims and the rings survive it. */
float signedFbm3(vec2 p) {
  return (fbm2(p, 3) - 0.4375) / 0.4375;
}

float signedFbm2(vec2 p) {
  return (fbm2(p, 2) - 0.375) / 0.375;
}

float lumaOf(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

/* Oren-Nayar: retroreflective, so the surface stays flat and powdery at grazing
   angles instead of rolling off like plastic. Diffuse only, by law. */
float orenNayar(vec3 n, vec3 l, float rough) {
  float s2 = rough * rough;
  float a = 1.0 - 0.5 * s2 / (s2 + 0.33);
  float b = 0.45 * s2 / (s2 + 0.09);
  float ndl = dot(n, l);
  float ndv = dot(n, VIEW);
  float thetaL = acos(clamp(ndl, -1.0, 1.0));
  float thetaV = acos(clamp(ndv, -1.0, 1.0));
  float alpha = max(thetaL, thetaV);
  float beta = min(thetaL, thetaV);
  vec3 lp = l - n * ndl;
  vec3 vp = VIEW - n * ndv;
  float cosPhi = 0.0;
  if (length(lp) > 1e-4 && length(vp) > 1e-4) {
    cosPhi = max(dot(normalize(lp), normalize(vp)), 0.0);
  }
  return max(ndl, 0.0) * (a + b * cosPhi * sin(alpha) * tan(min(beta, 1.5)));
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float unit = max(min(uResolution.x, uResolution.y), 1.0);
  vec2 p = (frag - 0.5 * uResolution) / unit;
  vec2 q = p - uOrigin;
  float r = length(q);

  float spin = uTime * uSpin;
  float cs = cos(spin);
  float sn = sin(spin);
  vec2 qr = vec2(cs * q.x - sn * q.y, sn * q.x + cs * q.y);

  /* The named risk. Unwarped concentric furrows are a vinyl record, and the
     warp is what stops the rings reading as rings. It is load-bearing, and so is
     the off-frame origin: both are floored in resolveParams. uWarpAmt counts
     furrow spacings, so the displacement is several grooves and neighbouring
     furrows genuinely cross each other's old radius rather than wobbling in
     lockstep. The broad term shoves whole arcs off the circle; the finer term
     undulates them at the scale of a few grooves. */
  float w1 = signedFbm3(qr * uWarpFreq + vec2(0.0, uTime * uDrift));
  float w2 = signedFbm2(qr * uWarpFreq * 2.7 + vec2(19.7, -4.3));
  float spacing = 1.0 / uFurrowFreq;
  float rw = r + uWarpAmt * spacing * (w1 + 0.22 * w2);

  float breakField = fbm2(qr * 1.6 + vec2(7.3, uTime * uDrift * 0.6), 3);
  float alive = smoothstep(0.5 - uBreakAmt, 0.5 + uBreakAmt, breakField + 0.14);
  float thick = 0.55 + 0.9 * fbm2(qr * 0.85 + vec2(3.1, 11.9), 2);

  float x = rw * uFurrowFreq;
  float profile = ridgeProfile(x);
  float h = uDepth * thick * alive * profile;

  float e = 0.22;
  float lap = ridgeProfile(x + e) - 2.0 * profile + ridgeProfile(x - e);
  float cavity = pow(1.0 - profile, 1.6);
  float occ = uAo * alive * thick * (0.7 * cavity + 0.5 * clamp(lap * 6.0, 0.0, 1.0));
  float ao = 1.0 - clamp(occ, 0.0, 0.88);

  float px = 1.0 / unit;
  vec2 grad = vec2(dFdx(h), dFdy(h)) / px;
  vec3 n = normalize(vec3(-grad * uSlope, 1.0));

  /* Grain perturbs the normal and never the height. Fold it into h instead and
     the occlusion term eats it, and the clay reads as moulded latex, not grog. */
  vec2 gp = qr * uMicroScale;
  float g0 = vnoise2(gp);
  vec2 dg = vec2(
    vnoise2(gp + vec2(0.6, 0.0)) - g0,
    vnoise2(gp + vec2(0.0, 0.6)) - g0
  );
  n = normalize(n + vec3(dg * uMicroAmt, 0.0));

  // halkeama: drying cracks, and only where clay pools, so only in the floors.
  float crack = (1.0 - smoothstep(0.0, 0.06, craquelure(qr * uCrackScale)))
    * (1.0 - smoothstep(0.15, 0.6, profile));
  vec2 dc = vec2(dFdx(crack), dFdy(crack)) / px;
  n = normalize(n - vec3(dc * uCrackAmt * 0.02, 0.0));

  vec3 l = normalize(uLightDir);
  float diff = orenNayar(n, l, uRough);
  float lit = (uAmbient + uKey * diff) * ao * (1.0 - 0.35 * crack * uCrackAmt);

  vec3 pigment = mix(uShadow, uBody, smoothstep(0.05, 0.62, lit));
  pigment = mix(pigment, uRidge, smoothstep(0.62, 1.05, lit));

  /* Dark ground: same relief, different material. A grazing key that only the
     crests catch, furrows falling back to the ground. Brushed metal, not clay. */
  float caught = pow(clamp(diff, 0.0, 1.0), 5.0);
  float crest = profile * profile * profile * profile * profile;
  float grazing = 1.0 - abs(n.z);
  grazing *= grazing;
  float ridgeCatch = crest * grazing * caught;
  vec3 metal = uBody + uKeyColor * ((caught * uKey * 1.15 + ridgeCatch * 0.55) * ao)
    + (uShadow - uBody) * (1.0 - ao);

  vec3 col = mix(metal, pigment, uAbsorb);

  float lum = lumaOf(col);
  if (lum > uMaxLum) col *= uMaxLum / max(lum, 1e-4);

  col = dither(col, frag, uDither);
  fragColor = vec4(clamp(col, 0.0, 1.0), uAlpha);
}
`;
