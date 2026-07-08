"use client";
import {
  DndContext,
  type DragEndEvent,
  type DragMoveEvent,
  type KeyboardCoordinateGetter,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  applyPatch,
  canPlace,
  clampItem,
  deltaToCells,
  type GridBounds,
  type GridItem,
  type GridStep,
  measureStep,
} from "./grid-layout.js";

interface GridContextValue {
  bounds: GridBounds;
  editing: boolean;
  layout: GridItem[];
  stepRef: React.RefObject<GridStep>;
  patch: (id: string, patch: Partial<Omit<GridItem, "id">>) => boolean;
  remove: (id: string) => void;
  announce: (message: string) => void;
  registerLabel: (id: string, label: string) => () => void;
  draggingId: string | null;
}

const GridContext = React.createContext<GridContextValue | null>(null);

function useGrid(name: string): GridContextValue {
  const context = React.useContext(GridContext);
  if (!context)
    throw new Error(`${name} must be rendered inside a DashboardGrid`);
  return context;
}

export interface DashboardGridProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  layout: GridItem[];
  onLayoutChange: (layout: GridItem[]) => void;
  columns?: number;
  rows?: number;
  /** Height of one row, in pixels. Rows never grow to fit their content. */
  rowHeight?: number;
  /** Gutter between cells, in pixels. */
  gap?: number;
  /** Drag, resize and remove are only possible while this is true. */
  editing?: boolean;
  /** Read to a screen reader when a drag starts. */
  keyboardInstructions?: string;
}

const DEFAULT_INSTRUCTIONS =
  "Press space to lift the widget, then use the arrow keys to move it one cell at a time. Press space to drop it, or escape to cancel.";

export function DashboardGrid({
  className,
  style,
  layout,
  onLayoutChange,
  columns = 10,
  rows = 8,
  rowHeight = 72,
  gap = 16,
  editing = false,
  keyboardInstructions = DEFAULT_INSTRUCTIONS,
  children,
  ...props
}: DashboardGridProps) {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const stepRef = React.useRef<GridStep>({ column: 0, row: 0 });
  const [preview, setPreview] = React.useState<GridItem | null>(null);
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState("");

  const bounds = React.useMemo<GridBounds>(
    () => ({ columns, rows }),
    [columns, rows],
  );

  React.useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const measure = () => {
      stepRef.current = measureStep(grid, columns, rowHeight);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    return () => observer.disconnect();
  }, [columns, rowHeight]);

  const labels = React.useRef(new Map<string, string>());
  const registerLabel = React.useCallback((id: string, label: string) => {
    labels.current.set(id, label);
    return () => {
      labels.current.delete(id);
    };
  }, []);

  const announce = React.useCallback((next: string) => {
    // The text has to change for a live region to fire again, so an identical
    // message gets a zero-width space appended to make it a different string.
    setMessage((current) => (current === next ? `${next}​` : next));
  }, []);

  const patch = React.useCallback(
    (id: string, change: Partial<Omit<GridItem, "id">>) => {
      const next = applyPatch(layout, id, change, bounds);
      if (next === layout) return false;
      onLayoutChange(next);
      return true;
    },
    [layout, bounds, onLayoutChange],
  );

  const remove = React.useCallback(
    (id: string) => onLayoutChange(layout.filter((item) => item.id !== id)),
    [layout, onLayoutChange],
  );

  const candidateFor = React.useCallback(
    (id: string, delta: { x: number; y: number }): GridItem | null => {
      const current = layout.find((entry) => entry.id === id);
      if (!current) return null;
      const cells = deltaToCells(delta, stepRef.current);
      return clampItem(
        { ...current, x: current.x + cells.x, y: current.y + cells.y },
        bounds,
      );
    },
    [layout, bounds],
  );

  const coordinateGetter = React.useCallback<KeyboardCoordinateGetter>(
    (event, { currentCoordinates }) => {
      const step = stepRef.current;
      const moves: Record<string, { x: number; y: number }> = {
        ArrowRight: { x: step.column, y: 0 },
        ArrowLeft: { x: -step.column, y: 0 },
        ArrowDown: { x: 0, y: step.row },
        ArrowUp: { x: 0, y: -step.row },
      };
      const move = moves[event.code];
      if (!move) return undefined;
      event.preventDefault();
      return {
        x: currentCoordinates.x + move.x,
        y: currentCoordinates.y + move.y,
      };
    },
    [],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter }),
  );

  const handleDragMove = (event: DragMoveEvent) => {
    setPreview(candidateFor(String(event.active.id), event.delta));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setPreview(null);
    setDraggingId(null);
    const id = String(event.active.id);
    const candidate = candidateFor(id, event.delta);
    if (!candidate) return;
    const label = labels.current.get(id) ?? id;
    if (patch(id, { x: candidate.x, y: candidate.y })) {
      announce(
        `${label} moved to column ${candidate.x + 1}, row ${candidate.y + 1}.`,
      );
    } else {
      announce(`${label} cannot move there. That spot is taken.`);
    }
  };

  const previewValid = preview != null && canPlace(layout, preview, bounds);

  return (
    <DndContext
      sensors={sensors}
      // No droppables are registered: the drop position is the drag delta
      // rounded to whole cells, so there is nothing for a collision pass to do.
      collisionDetection={() => []}
      accessibility={{
        screenReaderInstructions: { draggable: keyboardInstructions },
        // dnd-kit keeps its own live region. Ours says more, because it knows the
        // cell the widget landed on, so dnd-kit's is silenced rather than doubled.
        announcements: {
          onDragStart: () => undefined,
          onDragMove: () => undefined,
          onDragOver: () => undefined,
          onDragEnd: () => undefined,
          onDragCancel: () => undefined,
        },
      }}
      onDragStart={(event) => setDraggingId(String(event.active.id))}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={() => {
        setPreview(null);
        setDraggingId(null);
        announce("Move cancelled.");
      }}
    >
      <GridContext.Provider
        value={{
          bounds,
          editing,
          layout,
          stepRef,
          patch,
          remove,
          announce,
          registerLabel,
          draggingId,
        }}
      >
        <div
          ref={gridRef}
          data-dashboard-grid=""
          data-editing={editing ? "" : undefined}
          className={cn("relative grid w-full", className)}
          style={
            {
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, ${rowHeight}px)`,
              gap: `${gap}px`,
              // The edit-mode cell outlines are painted, not built from
              // `columns * rows` elements. A 10 by 8 grid would be 80 nodes,
              // every one of them a layout and paint the browser has to do.
              ...(editing
                ? {
                    backgroundImage:
                      "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
                    backgroundSize: `calc((100% + ${gap}px) / ${columns}) ${rowHeight + gap}px`,
                    backgroundPosition: `${-gap / 2}px ${-gap / 2}px`,
                  }
                : null),
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          {preview != null && (
            <div
              data-dashboard-grid-preview={previewValid ? "valid" : "invalid"}
              aria-hidden="true"
              className={cn(
                "pointer-events-none z-0 rounded-xl border-2 border-dashed",
                previewValid
                  ? "border-accent/70 bg-accent/10"
                  : "border-danger/70 bg-danger/10",
              )}
              style={{
                gridColumn: `${preview.x + 1} / span ${preview.w}`,
                gridRow: `${preview.y + 1} / span ${preview.h}`,
              }}
            />
          )}
          {children}
        </div>

        <div
          data-dashboard-grid-status=""
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {message}
        </div>
      </GridContext.Provider>
    </DndContext>
  );
}

export interface DashboardGridItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  id: string;
  /** Names the widget in every control's label and in the live region. */
  label: string;
  /** Hides the remove button for a widget the user must not drop. */
  removable?: boolean;
}

export function DashboardGridItem({
  className,
  id,
  label,
  removable = true,
  children,
  ...props
}: DashboardGridItemProps) {
  const {
    bounds,
    editing,
    layout,
    stepRef,
    patch,
    remove,
    announce,
    registerLabel,
  } = useGrid("DashboardGridItem");
  const item = layout.find((entry) => entry.id === id);

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform } =
    useDraggable({ id, disabled: !editing });

  React.useEffect(() => registerLabel(id, label), [registerLabel, id, label]);

  if (!item) return null;

  const resize = (w: number, h: number) => {
    if (patch(id, { w, h })) {
      const next = clampItem({ ...item, w, h }, bounds);
      announce(`${label} resized to ${next.w} by ${next.h}.`);
    } else {
      announce(`${label} cannot grow there.`);
    }
  };

  const startPointerResize =
    (axis: "x" | "y" | "both"): React.PointerEventHandler<HTMLButtonElement> =>
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const start = { x: event.clientX, y: event.clientY };
      const origin = item;
      let lastW = origin.w;
      let lastH = origin.h;

      const onMove = (move: PointerEvent) => {
        const cells = deltaToCells(
          { x: move.clientX - start.x, y: move.clientY - start.y },
          stepRef.current,
        );
        const w = axis === "y" ? origin.w : origin.w + cells.x;
        const h = axis === "x" ? origin.h : origin.h + cells.y;
        if (w === lastW && h === lastH) return;
        lastW = w;
        lastH = h;
        patch(id, { w, h });
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        announce(`${label} resized to ${lastW} by ${lastH}.`);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    };

  // Arrow keys resize along whichever axis the focused handle owns, so a keyboard
  // user can widen a widget without also making it taller. sisu's only keyboard
  // affordance changes both at once.
  const resizeKeys =
    (axis: "x" | "y" | "both"): React.KeyboardEventHandler<HTMLButtonElement> =>
    (event) => {
      const horizontal = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
      const vertical = { ArrowDown: 1, ArrowUp: -1 }[event.key];
      if (horizontal !== undefined && axis !== "y") {
        event.preventDefault();
        resize(item.w + horizontal, item.h);
      } else if (vertical !== undefined && axis !== "x") {
        event.preventDefault();
        resize(item.w, item.h + vertical);
      }
    };

  return (
    <div
      ref={setNodeRef}
      data-dashboard-grid-item=""
      className={cn(
        "relative z-10 min-h-0",
        transform && "z-30 opacity-50",
        className,
      )}
      style={{
        gridColumn: `${item.x + 1} / span ${item.w}`,
        gridRow: `${item.y + 1} / span ${item.h}`,
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : undefined,
      }}
      {...(editing ? listeners : null)}
      {...props}
    >
      {children}

      {editing && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl border border-accent/45"
          />
          <span
            aria-hidden="true"
            className="-right-2 -bottom-2 absolute z-20 rounded-full bg-accent px-2.5 py-1 font-mono font-semibold text-[10px] text-on-accent"
          >
            {item.w}×{item.h}
          </span>

          <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
            <button
              ref={setActivatorNodeRef}
              type="button"
              aria-label={`Move ${label}`}
              className="grid size-8 cursor-grab place-items-center rounded-lg bg-ink/[0.06] text-muted outline-none hover:bg-ink/10 hover:text-ink focus-visible:ring-focus active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripIcon />
            </button>
            {removable && (
              <button
                type="button"
                aria-label={`Remove ${label}`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => {
                  remove(id);
                  announce(`${label} removed.`);
                }}
                className="grid size-8 place-items-center rounded-lg bg-danger/15 text-danger outline-none hover:bg-danger/25 focus-visible:ring-focus"
              >
                <CloseIcon />
              </button>
            )}
          </div>

          <button
            type="button"
            aria-label={`Resize ${label} horizontally`}
            onPointerDown={startPointerResize("x")}
            onKeyDown={resizeKeys("x")}
            className="-right-2 absolute top-14 bottom-10 z-20 w-4 cursor-ew-resize rounded-full outline-none hover:bg-accent/25 focus-visible:ring-focus"
          />
          <button
            type="button"
            aria-label={`Resize ${label} vertically`}
            onPointerDown={startPointerResize("y")}
            onKeyDown={resizeKeys("y")}
            className="-bottom-2 absolute right-10 left-10 z-20 h-4 cursor-ns-resize rounded-full outline-none hover:bg-accent/25 focus-visible:ring-focus"
          />
          <button
            type="button"
            aria-label={`Resize ${label}`}
            onPointerDown={startPointerResize("both")}
            onKeyDown={resizeKeys("both")}
            className="-right-2 -bottom-2 absolute z-30 size-7 cursor-nwse-resize rounded-full border border-accent/50 bg-accent/25 outline-none hover:bg-accent/40 focus-visible:ring-focus"
          />
        </>
      )}
    </div>
  );
}

function GripIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-3.5"
      aria-hidden="true"
    >
      <circle cx="9" cy="6" r="1.6" />
      <circle cx="15" cy="6" r="1.6" />
      <circle cx="9" cy="12" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="9" cy="18" r="1.6" />
      <circle cx="15" cy="18" r="1.6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="size-3.5"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
