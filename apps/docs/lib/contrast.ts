export type Rgb = [number, number, number];

/** Parse whatever `getComputedStyle` hands back for a resolved colour: it is
 * serialised as `rgb(r, g, b)` or `rgba(r, g, b, a)`, and newer engines may use
 * space-separated `rgb(r g b / a)`. Alpha is ignored; these are opaque roles. */
export function parseRgb(value: string): Rgb | null {
  const match = value.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance([r, g, b]: Rgb): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

/** WCAG AA for normal-size text. */
export const AA_NORMAL = 4.5;
