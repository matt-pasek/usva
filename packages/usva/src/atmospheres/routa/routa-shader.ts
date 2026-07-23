import { glsl } from "../atmospheres-core/atmospheres-glsl.js";

export const routaVertexShader = /* glsl */ `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export const routaFragmentShader = /* glsl */ `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform float uCellScale;
uniform float uHeave;
uniform float uCrackWidth;
uniform float uCrackDepth;
uniform float uUnevenScale;
uniform float uUneven;
uniform float uDrift;
uniform float uGrowthRate;
uniform float uSlope;
uniform float uRough;
uniform float uAmbient;
uniform float uKey;
uniform float uRelief;
uniform float uDither;
uniform float uAlpha;
uniform float uAbsorb;
uniform vec3  uLightDir;
uniform vec3  uPigment;
uniform vec3  uEmission;
uniform vec3  uBody;
uniform vec3  uFissure;
uniform float uStainFloor;

out vec4 fragColor;

${glsl("fbm", "worley", "dither", "stain", "composite")}

const vec3 VIEW = vec3(0.0, 0.0, 1.0);
const float SIGMA = 1.12;
const float SOAK = 0.52;
/** How far in from a fissure the plate has finished rising, in wall units. */
const float PLATE_EDGE = 0.2;

vec2 frostAt(vec2 p) {
  vec2 travel = vec2(uTime * uDrift, -uTime * uDrift * 0.37);
  vec2 q = p + travel;
  float wall = craquelure(q * uCellScale);
  float fissure = 1.0 - smoothstep(0.0, uCrackWidth, wall);
  float arrival = fbm2(
    q * uCellScale * 0.55 + vec2(7.3, 1.9),
    2
  ) / 0.75;
  float progress = clamp(0.1 + uTime * uGrowthRate, 0.0, 1.0);
  fissure *= smoothstep(arrival - 0.08, arrival + 0.08, progress);
  /* A heaved plate is flat, and flatness is also what makes it drawable.
     craquelure is F2 - F1, whose slope kinks along the medial axis of every
     cell, where the second-nearest cell changes. The normal is built by
     differencing the height, so a slope kink becomes a hard seam straight
     across each plate. Doming the interior put a gradient there for the kink
     to bend; a flat interior gives it nothing, and the shape lands where it
     belongs, on the shoulder falling into the seam. */
  float dome = smoothstep(uCrackWidth, uCrackWidth + PLATE_EDGE, wall);
  dome = dome * dome * (3.0 - 2.0 * dome);
  float broad = fbm2(q * uUnevenScale + vec2(13.1, -7.4), 3) / 0.875;
  float lift = dome * mix(1.0 - uUneven, 1.0 + uUneven, broad);
  return vec2(uHeave * lift - uCrackDepth * fissure, fissure);
}

float heightAt(vec2 p) {
  return frostAt(p).x;
}

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
  float unit = max(min(uResolution.x, uResolution.y), 1.0);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution) / unit;
  vec2 field = frostAt(p);
  float height = field.x;

  float eps = 1.5 / unit;
  float heightX = heightAt(p + vec2(eps, 0.0));
  float heightY = heightAt(p + vec2(0.0, eps));
  vec3 normal = normalize(vec3(
    (height - heightX) * uSlope,
    (height - heightY) * uSlope,
    eps * 3.0
  ));

  vec3 light = normalize(uLightDir);
  float diffuse = orenNayar(normal, light, uRough);
  float lit = clamp(uAmbient + uKey * diffuse, 0.0, 1.2);

  // Black ice. The ground is opaque and always painted, and the key only picks
  // out the crests: that surface is what separates frozen earth from a handful
  // of lit lumps floating on whatever happens to be behind the canvas.
  if (uAbsorb < 0.5) {
    float crest = smoothstep(0.0, uHeave, max(height, 0.0));
    float rake = smoothstep(0.36, 1.0, lit);
    vec3 ground = mix(uFissure, uBody, smoothstep(0.18, 0.72, lit));
    vec3 col = mix(ground, uEmission, crest * rake * 0.85);
    col = mix(col, uFissure, field.y * 0.9);
    col = dither(col, gl_FragCoord.xy, uDither);
    fragColor = composite(col, uAlpha);
    return;
  }

  /* Clay carries the heave as damp, never as a darker multiply: the multiply
     composite is inert under isolate, so a light ground can only show relief by
     holding more pigment. Wet in the lee of a plate, dry where the key lands.
     Kept out of the fissures so it never doubles with the pigment already
     there, and an order under them so the seams stay the subject. */
  float relief = smoothstep(0.62, 0.18, lit) * (1.0 - field.y) * uRelief;
  float fissure = field.y * mix(1.0, 0.68, diffuse);
  vec3 absorbed = hold(uPigment, uStainFloor);
  float alpha = clamp(soak(fissure * SOAK + relief, SIGMA) * uAlpha, 0.0, 1.0);
  fragColor = vec4(absorbed * alpha, alpha);
}
`;
