import { emergeDroplet } from "../sula-core/emerge.js";
import { type Blob, bridgeNecks, type Neck } from "../sula-core/geometry.js";

export type FabLayout = "line" | "arc";
export type FabDirection = "up" | "down" | "left" | "right";

export interface FabSlot {
  x: number;
  y: number;
}

/** Real trigger and bead radii plus the constant edge gap between neighbours. */
export interface FabSpacing {
  triggerR: number;
  beadR: number;
  gap: number;
}

/** Per-bead launch delay, as a fraction of open progress. Nearer beads lead. */
export const FAB_STAGGER = 0.08;
/** The arc fan spans this many degrees, centred on the layout direction. */
const ARC_SPAN = (100 * Math.PI) / 180;

const UNIT: Record<FabDirection, FabSlot> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function lineSlots(
  count: number,
  direction: FabDirection,
  { triggerR, beadR, gap }: FabSpacing,
): FabSlot[] {
  const unit = UNIT[direction];
  /* Edge gaps are constant: the trigger edge to bead0 edge is `gap`, and every
   * bead edge to the next bead edge is `gap`, whatever the two radii are. */
  const first = triggerR + beadR + gap;
  const step = 2 * beadR + gap;
  return Array.from({ length: count }, (_, i) => {
    const distance = first + i * step;
    return { x: unit.x * distance, y: unit.y * distance };
  });
}

function arcSlots(
  count: number,
  direction: FabDirection,
  { triggerR, beadR, gap }: FabSpacing,
): FabSlot[] {
  /* Fan evenly across ARC_SPAN centred on the direction's axis. A single bead
   * sits on that axis. Every bead is one radius from the trigger centre, so the
   * trigger edge to bead edge gap is `gap`. */
  const unit = UNIT[direction];
  const center = Math.atan2(unit.y, unit.x);
  const radius = triggerR + beadR + gap;
  return Array.from({ length: count }, (_, i) => {
    const frac = count === 1 ? 0.5 : i / (count - 1);
    const angle = center - ARC_SPAN / 2 + frac * ARC_SPAN;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  });
}

/** Slot centres for the actions, relative to the trigger centre at (0,0). */
export function fabSlots(
  count: number,
  layout: FabLayout,
  direction: FabDirection,
  spacing: FabSpacing,
): FabSlot[] {
  if (count <= 0) return [];
  return layout === "arc"
    ? arcSlots(count, direction, spacing)
    : lineSlots(count, direction, spacing);
}

/** A fully rounded blob from a measured rect, relative to the stage box. */
export function blobFromRect(rect: {
  left: number;
  top: number;
  width: number;
  height: number;
}): Blob {
  const hw = rect.width / 2;
  const hh = rect.height / 2;
  return {
    cx: rect.left + hw,
    cy: rect.top + hh,
    hw,
    hh,
    r: Math.min(hw, hh),
  };
}

/**
 * The field at open-progress `t` (0 closed, 1 open; may pass 1 for spring
 * overshoot): the trigger blob plus one bead per action, each emerging from the
 * trigger to its slot, staggered so nearer beads lead. Necks tether the beads
 * that are still travelling. `slots` are the beads at their rest slot positions.
 */
export function fabPhase(
  trigger: Blob,
  slots: Blob[],
  t: number,
): { blobs: Blob[]; necks: Neck[] } {
  const blobs: Blob[] = [trigger];
  const necks: Neck[] = [];

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i] as Blob;
    /* Later beads launch after the nearer ones, but every local timeline maps
     * global t=1 back to exactly 1. This preserves the cascade without leaving
     * the early beads stranded at different overshoot positions at rest. */
    const delay = i * FAB_STAGGER;
    const ti = (t - delay) / (1 - delay);
    const { blob, neck } = emergeDroplet(trigger, slot, ti);
    blobs.push(blob);
    if (neck) necks.push(neck);
  }

  return { blobs, necks };
}

/** Resting surface tension follows the layout's visual topology. Arc actions
 * radiate from the trigger. Line actions form a strong chain, with only the first
 * action tied weakly to the trigger so the menu reads as one strand that can be
 * pulled back into the FAB. */
export function fabBridges(
  blobs: Blob[],
  k: number,
  merge: number,
  layout: FabLayout,
): Neck[] {
  const trigger = blobs[0];
  if (!trigger) return [];
  const actions = blobs.slice(1);
  if (layout === "arc") {
    return actions.flatMap((bead) => bridgeNecks([trigger, bead], k, merge));
  }

  const actionChain = bridgeNecks(actions, k, merge);
  const first = actions[0];
  const triggerTie = first ? bridgeNecks([trigger, first], k, merge * 0.5) : [];
  return [...actionChain, ...triggerTie];
}
