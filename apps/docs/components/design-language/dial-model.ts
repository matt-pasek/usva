export const STOPS = ["core", "patterns", "sula", "atmosphere"] as const;
export type StopName = (typeof STOPS)[number];

export const STOP_COPY: Record<
  StopName,
  { title: string; line: string; layer: string }
> = {
  core: {
    title: "core",
    line: "primitives and one pattern. it is legible, it is dense, and nothing moves. this is the floor, and most screens should stop here.",
    layer: "recedes",
  },
  patterns: {
    title: "+ patterns",
    line: "composed blocks arrive and the screen gains structure. they enter in a stagger, because arriving is the only motion a pattern is allowed.",
    layer: "structures",
  },
  sula: {
    title: "+ sula",
    line: "one liquid field takes the chrome. it follows the cursor, it is the loudest thing here, and it is now the only thing allowed to be.",
    layer: "asserts",
  },
  atmosphere: {
    title: "+ atmosphere",
    line: "the room itself starts moving. same skeleton, same components, same information. all that changed is how much of your attention the screen is asking for.",
    layer: "is the room",
  },
};

export type RegionId = "chrome" | "canvas" | "boundary";

export interface Region {
  id: RegionId;
  label: string;
  /** what kind of attention this area competes for. */
  what: string;
}

export const REGIONS: Region[] = [
  {
    id: "chrome",
    label: "chrome",
    what: "a focal control surface. you look at it on purpose.",
  },
  {
    id: "canvas",
    label: "canvas",
    what: "the work. this is where the reading happens.",
  },
  {
    id: "boundary",
    label: "boundary",
    what: "ambient, at the edge, never looked at directly.",
  },
];

export interface DialState {
  stop: number;
  /** a SulaFrame living in the boundary region. */
  boundaryFrame: boolean;
}

/** the stop at which the first sula element enters. */
export const SULA_STOP = 2;

/** one dominant element per region. that is the whole rule. */
export const BUDGET = 1;

export type RegionLoad = Record<RegionId, number>;

export const load = (state: DialState): RegionLoad => ({
  chrome: state.stop >= SULA_STOP ? 1 : 0,
  canvas: 0,
  boundary: state.boundaryFrame ? 1 : 0,
});

/** the load the screen would carry if a refused element had actually landed. */
export const loadWithPhantom = (
  state: DialState,
  phantom: RegionId | null,
): RegionLoad => {
  const base = load(state);
  return phantom ? { ...base, [phantom]: base[phantom] + 1 } : base;
};

export const overBudget = (counts: RegionLoad): RegionId | null =>
  (Object.keys(counts) as RegionId[]).find((id) => counts[id] > BUDGET) ?? null;

export const totalDominant = (counts: RegionLoad): number =>
  Object.values(counts).reduce((sum, n) => sum + n, 0);

export interface Verdict {
  tone: "quiet" | "ok" | "danger";
  label: string;
}

export const verdict = (counts: RegionLoad): Verdict => {
  const breached = overBudget(counts);
  if (breached)
    return {
      tone: "danger",
      label: `2 dominant in ${breached} · over budget`,
    };
  const total = totalDominant(counts);
  if (total === 0)
    return { tone: "quiet", label: "0 dominant · nothing shouts" };
  return {
    tone: "ok",
    label: `${total} dominant, ${total === 1 ? "1 region" : "1 per region"} · within budget`,
  };
};

export const REFUSAL_MS = 2400;

export const REFUSAL_COPY = {
  title: "no. the chrome already holds one.",
  body: "SulaNav is in the chrome region. a SulaFab there would be a second liquid field competing for the same attention, in the same bounded area, and neither would win. the rule is one sula element per region, and the chrome is one region.",
  fix: "put it in a region that is free, or drop the nav.",
};

export const ALLOWED_COPY = {
  title: "yes. that is a different region.",
  body: "the boundary is not the chrome. one is ambient and at the edge, one is a focal control surface you look at on purpose, and they are not asking for the same attention. a SulaFrame at the edge alongside a SulaNav at the top is two regions, one each, and that exact pairing ships on my own site.",
  fix: "the rule is about attention, not about a headcount per page.",
};
