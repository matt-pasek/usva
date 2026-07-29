/**
 * Rasterises railo into the PNG icons that browsers still ask for.
 *
 * The fields are evaluated straight from the circle definitions rather than by
 * parsing the SVG path, so this agrees with lib/railo-geometry.ts by
 * construction: a pixel belongs to a field when it is inside one circle and
 * outside the other. Run it after changing a cut.
 *
 *   bun apps/docs/scripts/generate-railo-icons.mjs
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const DOCS = join(dirname(fileURLToPath(import.meta.url)), "..");

const MICRO = { radius: 34, left: 33, right: 67 };
const BOX = 100;
const SAMPLES = 4;

const KAJO = {
  a: [0xa7, 0x8b, 0xfa],
  b: [0x52, 0xc9, 0x89],
  bg: [0x0a, 0x06, 0x13],
};

const inside = (x, y, cx) =>
  (x - cx) ** 2 + (y - BOX / 2) ** 2 <= MICRO.radius ** 2;

function coverage(px, py, size) {
  let left = 0;
  let right = 0;
  for (let sy = 0; sy < SAMPLES; sy++) {
    for (let sx = 0; sx < SAMPLES; sx++) {
      const x = ((px + (sx + 0.5) / SAMPLES) / size) * BOX;
      const y = ((py + (sy + 0.5) / SAMPLES) / size) * BOX;
      const a = inside(x, y, MICRO.left);
      const b = inside(x, y, MICRO.right);
      if (a && !b) left++;
      if (b && !a) right++;
    }
  }
  const total = SAMPLES * SAMPLES;
  return { left: left / total, right: right / total };
}

const over = (src, dst, alpha) => Math.round(src * alpha + dst * (1 - alpha));

function render(size, ground) {
  const rgba = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const { left, right } = coverage(x, y, size);
      const i = (y * size + x) * 4;
      const base = ground ?? [0, 0, 0];
      let [r, g, b] = base;
      let alpha = ground ? 1 : 0;
      for (const [cov, colour] of [
        [left, KAJO.a],
        [right, KAJO.b],
      ]) {
        if (cov <= 0) continue;
        r = over(colour[0], r, cov);
        g = over(colour[1], g, cov);
        b = over(colour[2], b, cov);
        alpha = alpha + cov * (1 - alpha);
      }
      rgba[i] = r;
      rgba[i + 1] = g;
      rgba[i + 2] = b;
      rgba[i + 3] = Math.round(alpha * 255);
    }
  }
  return rgba;
}

const CRC = Int32Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
const crc32 = (buf) => {
  let c = -1;
  for (const byte of buf) c = CRC[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};

function chunk(type, data) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, "ascii");
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, tail]);
}

function png(size, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // truecolour with alpha
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // no per-row filter
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function ico(sizes) {
  const images = sizes.map((size) => png(size, render(size, null)));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(sizes.length, 4);

  let offset = 6 + sizes.length * 16;
  const entries = sizes.map((size, index) => {
    const entry = Buffer.alloc(16);
    entry[0] = size >= 256 ? 0 : size;
    entry[1] = size >= 256 ? 0 : size;
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(images[index].length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += images[index].length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images]);
}

const targets = [
  // Raster fallback for anything that will not take the SVG.
  { file: join(DOCS, "app", "icon.png"), size: 32, ground: null },
  // Apple refuses transparency and composites onto white, so it gets the ground.
  { file: join(DOCS, "app", "apple-icon.png"), size: 180, ground: KAJO.bg },
];

for (const { file, size, ground } of targets) {
  writeFileSync(file, png(size, render(size, ground)));
  console.log(`wrote ${file} (${size}x${size})`);
}

const ICO_SIZES = [16, 32, 48];
const icoFile = join(DOCS, "app", "favicon.ico");
writeFileSync(icoFile, ico(ICO_SIZES));
console.log(`wrote ${icoFile} (${ICO_SIZES.join(", ")})`);
