export type Seek = {
  seekMs: number;
  loopMs?: number;
};

/**
 * At t=0 most of these render a uniform field: the noise has not accumulated,
 * the wavefronts have not crossed, nothing is lit. A still at zero is a truthful
 * capture of a blank frame. These offsets are picked by eye, per effect, to land
 * on a frame that looks like the effect.
 */
export const SEEKS: Record<string, Seek> = {
  hehku: { seekMs: 4200, loopMs: 6000 },
  kajastus: { seekMs: 6000, loopMs: 8000 },
  kuulto: { seekMs: 3500, loopMs: 6000 },
  kynnos: { seekMs: 5000, loopMs: 8000 },
  loimu: { seekMs: 7000, loopMs: 8000 },
  utu: { seekMs: 5500, loopMs: 8000 },
  vare: { seekMs: 6500, loopMs: 10000 },
  "sula-nav": { seekMs: 900 },
  "sula-segmented": { seekMs: 900 },
  "sula-fab": { seekMs: 900 },
  "sula-loader": { seekMs: 1200, loopMs: 2400 },
  "sula-field": { seekMs: 4000, loopMs: 8000 },
  "sula-frame": { seekMs: 2000, loopMs: 6000 },
};

export const DEFAULT_SEEK: Seek = { seekMs: 400 };

export const seekFor = (storyId: string): Seek => {
  const match = Object.keys(SEEKS).find((key) => storyId.includes(key));
  return match ? SEEKS[match] : DEFAULT_SEEK;
};
