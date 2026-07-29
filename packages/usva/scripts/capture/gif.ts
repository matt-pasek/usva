import { applyPalette, GIFEncoder, quantize } from "gifenc";
import { PNG } from "pngjs";

const MAX_COLORS = 64;

const toRgba = (png: Buffer) => {
  const decoded = PNG.sync.read(png);
  return {
    data: new Uint8Array(decoded.data),
    width: decoded.width,
    height: decoded.height,
  };
};

/**
 * One palette, derived from the mid-loop frame and reused for every frame.
 * Quantising each frame independently makes the palette drift between frames,
 * which reads as the whole field shimmering even where nothing moved.
 */
export const encodeGif = async (frames: Buffer[], dtMs: number) => {
  if (frames.length === 0) throw new Error("encodeGif: no frames");

  const decoded = frames.map(toRgba);
  const { width, height } = decoded[0];
  const reference = decoded[Math.floor(decoded.length / 2)];
  const palette = quantize(reference.data, MAX_COLORS);

  const encoder = GIFEncoder();
  for (const frame of decoded) {
    const index = applyPalette(frame.data, palette);
    encoder.writeFrame(index, width, height, {
      palette,
      delay: Math.round(dtMs),
    });
  }
  encoder.finish();

  return Buffer.from(encoder.bytes());
};
