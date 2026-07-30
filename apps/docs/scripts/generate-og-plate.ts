import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { chromium } from "playwright";
import { kajastusFragmentShader } from "../../../packages/usva/src/atmospheres/kajastus/kajastus-shader.js";
import { KAJASTUS_DEFAULTS } from "../../../packages/usva/src/atmospheres/kajastus/kajastus-uniforms.js";
import {
  auroraPlacement,
  OG_AURORA,
  OG_PLATE_FILE,
  OG_PLATE_SCALE,
  OG_SIZE,
  ogMarkTransform,
} from "../lib/og-plate.js";
import { RAILO_CUTS, railoPaths } from "../lib/railo-geometry.js";

const DOCS = join(dirname(new URL(import.meta.url).pathname), "..");

const KAJO = {
  bg: "#0a0613",
  ink: "#e6e3f2",
  accent: "#a78bfa",
  accentAlt: "#52c989",
};

const rgb = (hex: string): [number, number, number] => [
  Number.parseInt(hex.slice(1, 3), 16) / 255,
  Number.parseInt(hex.slice(3, 5), 16) / 255,
  Number.parseInt(hex.slice(5, 7), 16) / 255,
];

const SHADER_PAGE = (width: number, height: number) => `<!doctype html>
<html><body style="margin:0">
<canvas id="c" width="${width}" height="${height}"></canvas>
<script>
window.render = (fragment, uniforms) => {
  const canvas = document.getElementById('c');
  const gl = canvas.getContext('webgl2', {
    alpha: true, premultipliedAlpha: true, antialias: false,
    preserveDrawingBuffer: true,
  });
  if (!gl) throw new Error('webgl2 unavailable');
  const compile = (type, src) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
      throw new Error(gl.getShaderInfoLog(sh));
    return sh;
  };
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER,
    '#version 300 es\\nin vec2 position;\\nvoid main(){gl_Position=vec4(position,0.,1.);}'));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  for (const [name, value] of Object.entries(uniforms)) {
    const u = gl.getUniformLocation(program, name);
    if (u === null) continue;
    if (Array.isArray(value)) {
      if (value.length === 2) gl.uniform2fv(u, value);
      else if (value.length === 3) gl.uniform3fv(u, value);
    } else gl.uniform1f(u, value);
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  return canvas.toDataURL('image/png');
};
</script></body></html>`;

const platePage = (aurora: string) => {
  const paths = railoPaths(RAILO_CUTS.display);
  const place = auroraPlacement();
  const transform = ogMarkTransform();
  const { width, height } = OG_SIZE;

  return `<!doctype html><html><head><style>
    html,body{margin:0;padding:0;background:${KAJO.bg}}
  </style></head><body>
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="railo-fields" clipPathUnits="userSpaceOnUse">
        <path transform="${transform}" d="${paths.left}"/>
        <path transform="${transform}" d="${paths.right}"/>
      </clipPath>
    </defs>
    <rect x="0" y="0" width="${width}" height="${height}" fill="${KAJO.bg}"/>
    <image x="0" y="0" width="${width}" height="${height}"
           opacity="${OG_AURORA.wash}" href="${aurora}"/>
    <image x="${place.x}" y="${place.y}" width="${place.width}" height="${place.height}"
           clip-path="url(#railo-fields)" href="${aurora}"/>
  </svg></body></html>`;
};

const bake = async () => {
  const width = OG_SIZE.width * OG_PLATE_SCALE;
  const height = OG_SIZE.height * OG_PLATE_SCALE;

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: OG_SIZE,
    deviceScaleFactor: OG_PLATE_SCALE,
  });

  try {
    const shaderPage = await context.newPage();
    await shaderPage.setContent(SHADER_PAGE(width, height));
    const aurora = await shaderPage.evaluate(
      ([fragment, uniforms]) =>
        (
          window as unknown as {
            render: (f: string, u: unknown) => string;
          }
        ).render(fragment as string, uniforms),
      [
        kajastusFragmentShader,
        {
          uTime: OG_AURORA.seekMs / 1000,
          uResolution: [width, height],
          uLow: rgb(KAJO.accentAlt),
          uHigh: rgb(KAJO.accent),
          uStar: rgb(KAJO.ink),
          uAlpha: 1,
          uBlend: 0,
          ...Object.fromEntries(
            Object.entries(KAJASTUS_DEFAULTS).map(([key, value]) => [
              `u${key.charAt(0).toUpperCase()}${key.slice(1)}`,
              value,
            ]),
          ),
        },
      ] as const,
    );
    await shaderPage.close();

    const page = await context.newPage();
    await page.setContent(platePage(aurora));
    const png = await page.screenshot({ type: "png" });
    await page.close();

    const out = join(DOCS, OG_PLATE_FILE);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, png);
    console.log(
      `plate baked: ${OG_PLATE_FILE} at ${width}x${height}, ${Math.round(png.length / 1024)} KB`,
    );
  } finally {
    await browser.close();
  }
};

await bake();
