import { glsl } from "../effects-core/effects-glsl.js";

/** Eight taps. The sheet is thin, so a long march would only oversample void. */
const TAPS = 8;

export const loimuFragmentShader = /* glsl */ `#version 300 es
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;
uniform float uPointer;
uniform float uFocal;
uniform float uSheetDist;
uniform float uSheetSpan;
uniform float uSigma;
uniform float uFold;
uniform float uFoldScale;
uniform vec3  uNormal;
uniform vec3  uFlow;
uniform vec2  uSource;
uniform float uNoiseFreq;
uniform float uStretch;
uniform float uCurlScale;
uniform float uCurlAmt;
uniform float uFlowSpeed;
uniform float uOmega;
uniform float uThreshold;
uniform float uSharpen;
uniform float uFalloff;
uniform float uGain;
uniform float uEdge;
uniform float uEdgeBands;
uniform float uFlowLength;
uniform float uAlpha;
uniform float uAbsorb;
uniform vec3  uBody;
uniform vec3  uDeep;
uniform vec3  uEdgeColor;

out vec4 fragColor;

${glsl("fbm", "curl", "isoband", "dither", "tonemap")}

/** Where a ray leaving the eye crosses the sheet plane. Grazing rays would run
 * to infinity, so the denominator is floored rather than discarded: the arrival
 * falloff has already taken those pixels to zero anyway. */
float sheetHit(vec3 dir, vec3 nrm) {
  return uSheetDist / max(dot(dir, nrm), 0.08);
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 ndc = (2.0 * gl_FragCoord.xy - uResolution) / uResolution.y;

  vec3 dir = normalize(vec3(ndc, uFocal));
  vec3 nrm = normalize(uNormal);
  vec3 flowAxis = normalize(uFlow - nrm * dot(uFlow, nrm));
  vec3 crossAxis = cross(nrm, flowAxis);

  vec3 srcDir = normalize(vec3(uSource.x * aspect, uSource.y, uFocal));
  vec3 source = srcDir * sheetHit(srcDir, nrm);
  vec3 mouseDir = normalize(vec3(uMouse, uFocal));
  vec3 mouse = mouseDir * sheetHit(mouseDir, nrm);

  float hit = sheetHit(dir, nrm);
  float stepLen = (2.0 * uSheetSpan) / float(${TAPS});
  float jitter = ign(gl_FragCoord.xy);

  vec3 col = vec3(0.0);
  float acc = 0.0;

  for (int i = 0; i < ${TAPS}; i++) {
    float t = hit - uSheetSpan + (float(i) + jitter) * stepLen;
    vec3 p = dir * t;

    float bend = fbm(p * uFoldScale + vec3(0.0, 0.0, uTime * 0.02), 2) - 0.5;
    float s = dot(p, nrm) - uSheetDist - bend * uFold;
    float shell = exp(-(s * s) / (uSigma * uSigma));

    vec3 vel = curl(p * uCurlScale + vec3(0.0, 0.0, uTime * 0.05), 0.35);
    vec2 sheetVel = vec2(dot(vel, flowAxis), dot(vel, crossAxis));

    vec3 toMouse = p - mouse;
    vec2 mAB = vec2(dot(toMouse, flowAxis), dot(toMouse, crossAxis));
    sheetVel += clamp(
      uPointer * uOmega * vec2(-mAB.y, mAB.x) / (1.0 + dot(mAB, mAB)),
      vec2(-0.65),
      vec2(0.65)
    );

    vec2 disp = sheetVel * uCurlAmt;
    vec3 q = p + disp.x * flowAxis + disp.y * crossAxis
           - flowAxis * (uFlowSpeed * uTime);

    vec3 domain = vec3(
      dot(q, flowAxis) / uStretch,
      dot(q, crossAxis),
      dot(q, nrm) * 0.6
    ) * uNoiseFreq;

    float fb = fbm(domain, 3);
    float along = domain.x;
    float across = domain.y;
    float tear = (fbm(vec3(along * 0.32, across * 1.8, domain.z), 3) - 0.5) * 0.6;
    float d0 = across + 0.62 + tear;
    float d1 = across - 0.05 + tear * 0.7;
    float d2 = across - 0.72 - tear * 0.5;
    float lanes = exp(-5.0 * d0 * d0)
      + 0.85 * exp(-7.0 * d1 * d1)
      + 0.65 * exp(-6.0 * d2 * d2);
    float body = pow(smoothstep(uThreshold, 0.9, fb), uSharpen);
    float rayWave = 0.5 + 0.5 * sin(along * 18.0 - uTime * 1.4);
    float rays = 0.72 + 0.28 * rayWave * rayWave * rayWave;
    float density = shell * (0.15 + 0.85 * lanes) * (0.08 + 0.92 * body) * rays;

    float flow = clamp(dot(q - source, flowAxis) / uFlowLength, 0.0, 1.0);
    vec3 hue = mix(uBody, uDeep, flow);
    hue += uEdgeColor * isobands(fb, uEdgeBands) * uEdge;

    float reach = length(p - source);
    float alongReach = dot(p - source, flowAxis);
    float launched = smoothstep(-1.2, 0.8, alongReach);
    float arrival = launched / (1.0 + uFalloff * reach * reach);

    col += hue * density * arrival * stepLen;
    acc += density * arrival * stepLen;
  }

  col *= uGain;
  float amount = clamp(acc * uGain, 0.0, 1.0);

  // Tonemapped on luminance, not per channel, so a bright pass saturates
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
