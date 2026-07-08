export interface GridItem {
  id: string;
  /** Zero-based column of the left edge. */
  x: number;
  /** Zero-based row of the top edge. */
  y: number;
  /** Width in columns. */
  w: number;
  /** Height in rows. */
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface GridBounds {
  columns: number;
  rows: number;
}

const clampRange = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Squeezes an item inside the grid and inside its own min/max. Size is settled
 * before position, because how far left an item may sit depends on how wide it
 * ended up being.
 */
export function clampItem(item: GridItem, bounds: GridBounds): GridItem {
  const w = clampRange(
    item.w,
    Math.max(item.minW ?? 1, 1),
    Math.min(item.maxW ?? bounds.columns, bounds.columns),
  );
  const h = clampRange(
    item.h,
    Math.max(item.minH ?? 1, 1),
    Math.min(item.maxH ?? bounds.rows, bounds.rows),
  );
  return {
    ...item,
    w,
    h,
    x: clampRange(item.x, 0, bounds.columns - w),
    y: clampRange(item.y, 0, bounds.rows - h),
  };
}

export function itemsOverlap(first: GridItem, second: GridItem): boolean {
  return (
    first.x < second.x + second.w &&
    first.x + first.w > second.x &&
    first.y < second.y + second.h &&
    first.y + first.h > second.y
  );
}

/** Whether `candidate` fits, ignoring the item it came from. */
export function canPlace(
  layout: GridItem[],
  candidate: GridItem,
  bounds: GridBounds,
): boolean {
  const clamped = clampItem(candidate, bounds);
  return !layout.some(
    (item) => item.id !== candidate.id && itemsOverlap(item, clamped),
  );
}

/** Scans row by row for the first position `item` fits in. */
export function findOpenSlot(
  layout: GridItem[],
  item: GridItem,
  bounds: GridBounds,
): GridItem | null {
  const candidate = clampItem(item, bounds);
  for (let y = 0; y <= bounds.rows - candidate.h; y += 1) {
    for (let x = 0; x <= bounds.columns - candidate.w; x += 1) {
      const next = { ...candidate, x, y };
      if (canPlace(layout, next, bounds)) return next;
    }
  }
  return null;
}

/**
 * Returns the layout with `id` patched, or the same array reference when the
 * move is refused. Callers compare by reference to know whether to shake.
 */
export function applyPatch(
  layout: GridItem[],
  id: string,
  patch: Partial<Omit<GridItem, "id">>,
  bounds: GridBounds,
): GridItem[] {
  const current = layout.find((item) => item.id === id);
  if (!current) return layout;

  const candidate = clampItem({ ...current, ...patch }, bounds);
  if (
    candidate.x === current.x &&
    candidate.y === current.y &&
    candidate.w === current.w &&
    candidate.h === current.h
  ) {
    return layout;
  }
  if (!canPlace(layout, candidate, bounds)) return layout;

  return layout.map((item) => (item.id === id ? candidate : item));
}

export function addItem(
  layout: GridItem[],
  item: GridItem,
  bounds: GridBounds,
): GridItem[] {
  if (layout.some((existing) => existing.id === item.id)) return layout;
  const placed = findOpenSlot(layout, item, bounds);
  return placed ? [...layout, placed] : layout;
}

export function removeItem(layout: GridItem[], id: string): GridItem[] {
  return layout.filter((item) => item.id !== id);
}

export interface GridStep {
  column: number;
  row: number;
}

/**
 * The pixel distance from one cell's left edge to the next, gaps included.
 * Read off the live element rather than the props, because the column width is
 * whatever the grid resolved to.
 */
export function measureStep(
  grid: HTMLElement,
  columns: number,
  rowHeight: number,
): GridStep {
  const styles = window.getComputedStyle(grid);
  const columnGap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
  const rowGap = Number.parseFloat(styles.rowGap || styles.gap) || 0;
  const width = grid.getBoundingClientRect().width;
  const columnWidth = (width - columnGap * (columns - 1)) / columns;
  return { column: columnWidth + columnGap, row: rowHeight + rowGap };
}

// `|| 0` folds away the negative zero that Math.round returns for small negative
// deltas, which otherwise survives into layout state and trips Object.is.
const toCells = (distance: number, step: number): number =>
  step > 0 ? Math.round(distance / step) || 0 : 0;

/** Turns a pixel drag delta into a whole number of cells. */
export function deltaToCells(
  delta: { x: number; y: number },
  step: GridStep,
): { x: number; y: number } {
  return {
    x: toCells(delta.x, step.column),
    y: toCells(delta.y, step.row),
  };
}
