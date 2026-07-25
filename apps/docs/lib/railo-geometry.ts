export const RAILO_BOX = 100;
const CENTRE_Y = RAILO_BOX / 2;

export interface RailoCut {
  radius: number;
  /** centre of the left field. */
  left: number;
  /** centre of the right field. */
  right: number;
}

export const RAILO_CUTS = {
  /** 24px and up. Tight, thin crescents, a wide lens. */
  display: { radius: 31, left: 38, right: 64 },
  /** 16px to 24px. Solves crescent === lens so neither thins out in a tab. */
  micro: { radius: 34, left: 33, right: 67 },
} as const satisfies Record<string, RailoCut>;

export type RailoCutName = keyof typeof RAILO_CUTS;

export const crescentWidth = (cut: RailoCut): number => cut.right - cut.left;

export const lensWidth = (cut: RailoCut): number =>
  2 * cut.radius - crescentWidth(cut);

export const clearspace = lensWidth;

const round = (n: number): number => Math.round(n * 1e4) / 1e4;

function crossings(cut: RailoCut): { x: number; top: number; bottom: number } {
  const half = crescentWidth(cut) / 2;
  const rise = Math.sqrt(cut.radius ** 2 - half ** 2);
  return {
    x: round(cut.left + half),
    top: round(CENTRE_Y - rise),
    bottom: round(CENTRE_Y + rise),
  };
}

export function railoPaths(cut: RailoCut): { left: string; right: string } {
  const { x, top, bottom } = crossings(cut);
  const r = cut.radius;
  const arc = (large: 0 | 1, sweep: 0 | 1, y: number) =>
    `A${r} ${r} 0 ${large} ${sweep} ${x} ${y}`;

  return {
    left: `M${x} ${top}${arc(1, 0, bottom)}${arc(0, 1, top)}Z`,
    right: `M${x} ${top}${arc(1, 1, bottom)}${arc(0, 0, top)}Z`,
  };
}

export const RAILO_VIEW_BOX = `0 0 ${RAILO_BOX} ${RAILO_BOX}`;

export function railoLens(cut: RailoCut): string {
  const { x, top, bottom } = crossings(cut);
  const r = cut.radius;

  return (
    `M${x} ${top}` +
    `A${r} ${r} 0 0 0 ${x} ${bottom}` +
    `A${r} ${r} 0 0 0 ${x} ${top}Z`
  );
}
