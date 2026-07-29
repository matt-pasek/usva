import { RAILO_BOX, RAILO_CUTS } from "./railo-geometry";

export const OG_SIZE = { width: 1200, height: 630 } as const;

export const OG_PLATE_SCALE = 2;

export const OG_PLATE_FILE = "public/og/plate.png";

export const OG_MARK = { box: 1010, x: 520, y: -190 } as const;

export const OG_CUT = RAILO_CUTS.display;

export const OG_AURORA = {
  seekMs: 6000,
  zoom: 2.2,
  focal: [0.24, 0.62],
  wash: 0.2,
} as const;

export interface AuroraPlacement {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function auroraPlacement(): AuroraPlacement {
  const scale = OG_MARK.box / RAILO_BOX;
  const width = OG_SIZE.width * OG_AURORA.zoom;
  const height = OG_SIZE.height * OG_AURORA.zoom;
  const markCx = OG_MARK.x + scale * ((OG_CUT.left + OG_CUT.right) / 2);
  const markCy = OG_MARK.y + scale * (RAILO_BOX / 2);
  return {
    width,
    height,
    x: Math.round(markCx - OG_AURORA.focal[0] * width),
    y: Math.round(markCy - OG_AURORA.focal[1] * height),
  };
}

export const ogMarkTransform = (): string =>
  `translate(${OG_MARK.x} ${OG_MARK.y}) scale(${OG_MARK.box / RAILO_BOX})`;
