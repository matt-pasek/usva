"use client";
import { animate, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  createField,
  type FieldColors,
  resolveColor,
  shineForBackdrop,
} from "../sula-core/field.js";
import {
  type Blob,
  type Neck,
  packHover,
  packUniforms,
} from "../sula-core/geometry.js";
import { createPauseGate } from "../sula-core/pause.js";
import { clamp01, smoothstep } from "../sula-motion/curves.js";
import { createEnergyTracker } from "../sula-motion/energy.js";
import { sideSpring } from "../sula-motion/springs.js";
import {
  FAB_STAGGER,
  type FabDirection,
  type FabLayout,
  fabBridges,
  fabPhase,
  fabSlots,
} from "./fab-geometry.js";

export interface SulaFabAction {
  icon: React.ReactNode;
  /** The accessible name and the tooltip text. */
  label: string;
  onClick?: () => void;
  href?: string;
}

export type SulaFabTooltipPosition = "left" | "right" | "top";

export interface SulaFabProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  actions: SulaFabAction[];
  /** The trigger glyph. Defaults to a plus. */
  icon?: React.ReactNode;
  /** The trigger's accessible name. Defaults to "Actions". */
  label?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  layout?: FabLayout;
  direction?: FabDirection;
  /** Tooltip side. Defaults to left for line layouts and top for arcs. */
  tooltipPosition?: SulaFabTooltipPosition;
  /** Constant edge gap in px between the trigger and beads, and between beads. */
  gap?: number;
  /** false or reduced-motion renders a plain stacked menu with no canvas. */
  fluid?: boolean;
  accentColor?: string;
  backdrop?: string;
  tint?: string;
  shine?: number;
}

/** Edge gap between neighbours in px. Kept tight so open beads sit within bridge
 * reach and hold the rest necks. */
const GAP_DEFAULT = 12;
/** Nominal trigger radius from the `size-14` class (56px box), for the non-fluid
 * fallback layout before any measurement runs. */
const NOMINAL_TRIGGER_R = 28;
/** Nominal bead radius from the `size-11` class (44px box). */
const NOMINAL_BEAD_R = 22;
/** Room past the outermost bead so its cap and neck are never clipped. */
const SLACK = 26;
const MAX_DPR = 2;
/** Merge radius at rest: firm glass. */
const REST_K = 16;
/** Merge radius while beads travel: gooey. */
const K_ACTIVE = 26;
/** Peak surface undulation in px, alive only while beads move. */
const WOBBLE = 0.6;
/** Merge floor while open: adjacent beads hold a soft surface-tension waist at
 * rest instead of floating apart. Kept low so the chain never fuses. */
const REST_MERGE = 0.32;
/** Peak edge displacement of the hover ripple, in px. Local to the hovered
 * part, so it can run hotter than the global settle wobble. */
const HOVER_WOBBLE = 1.1;
/** Per-frame ease toward the hover target, in and out. */
const HOVER_EASE = 0.16;

function readColors(
  node: HTMLElement,
  overrides: {
    backdrop?: string;
    tint?: string;
    accent?: string;
    shine?: number;
  },
): FieldColors {
  const styles = getComputedStyle(node);
  const token = (name: string) => styles.getPropertyValue(name).trim();
  const backdrop = resolveColor(overrides.backdrop ?? token("--usva-bg"));
  const tintToken =
    overrides.tint ?? token("--usva-surface-2") ?? token("--usva-surface");
  return {
    backdrop,
    tint: resolveColor(tintToken || token("--usva-surface")),
    accent: resolveColor(overrides.accent ?? token("--usva-accent")),
    shine: overrides.shine ?? shineForBackdrop(backdrop),
  };
}

const DefaultPlus = (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const SulaFab = React.forwardRef<HTMLDivElement, SulaFabProps>(
  (
    {
      actions,
      icon = DefaultPlus,
      label = "Actions",
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      layout = "line",
      direction = "up",
      tooltipPosition,
      gap = GAP_DEFAULT,
      fluid = true,
      accentColor,
      backdrop,
      tint,
      shine,
      className,
      ...props
    },
    forwardedRef,
  ) => {
    const reduced = useReducedMotion();
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const stageRef = React.useRef<HTMLDivElement | null>(null);
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const actionRefs = React.useRef<Array<HTMLElement | null>>([]);

    const [failed, setFailed] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    const isFluid = fluid && !reduced && !failed && mounted;
    const resolvedTooltipPosition =
      tooltipPosition ?? (layout === "arc" ? "top" : "left");

    const isControlled = openProp !== undefined;
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const open = isControlled ? openProp : uncontrolledOpen;

    const openRef = React.useRef(open);
    openRef.current = open;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setUncontrolledOpen(next);
        onOpenChange?.(next);
      },
      [isControlled, onOpenChange],
    );

    const slotOffsets = React.useMemo(
      () =>
        fabSlots(actions.length, layout, direction, {
          triggerR: NOMINAL_TRIGGER_R,
          beadR: NOMINAL_BEAD_R,
          gap,
        }),
      [actions.length, layout, direction, gap],
    );

    const openTargetRef = React.useRef<(next: boolean) => void>(() => {});

    React.useEffect(() => {
      if (!isFluid) return;
      const canvas = canvasRef.current;
      const stage = stageRef.current;
      const root = rootRef.current;
      const trigger = triggerRef.current;
      if (!canvas || !stage || !root || !trigger) return;

      const overrides = { backdrop, tint, accent: accentColor, shine };
      const field = createField({
        canvas,
        colors: readColors(root, overrides),
        onContextLost: () => setFailed(true),
      });
      if (!field) {
        setFailed(true);
        return;
      }

      let triggerBlob: Blob = { cx: 0, cy: 0, hw: 0, hh: 0, r: 0 };
      let triggerCenter = { x: 0, y: 0 };
      let slotBlobs: Blob[] = [];
      let canvasH = 0;
      let dpr = 1;
      let raf = 0;
      let running = 0;
      let hoverIndex = -1;
      let hoverAmt = 0;
      let hoverBlob: Blob | null = null;
      const energy = createEnergyTracker();
      const start = performance.now();

      const oT = { value: openRef.current ? 1 : 0 };
      let pOpen = oT.value;

      /* Index 0 is the trigger, i + 1 the beads, matching fabPhase's blob order.
       * On leave the last blob is kept so the ripple fades in place. */
      const updateHover = (blobs: Blob[]) => {
        const focus = hoverIndex >= 0 ? blobs[hoverIndex] : null;
        hoverAmt += ((focus ? 1 : 0) - hoverAmt) * HOVER_EASE;
        if (focus) hoverBlob = focus;
      };

      let lastW = 0;
      let lastH = 0;
      const measure = () => {
        const rootBox = root.getBoundingClientRect();
        const triggerRect = trigger.getBoundingClientRect();
        /* Layout sizes, never rect sizes: the open trigger carries rotate-45,
         * which inflates its client-rect AABB by sqrt(2). Measured that way the
         * first slot sat a near-doubled edge gap out. The rect centre is still
         * exact under any rotation, so positions may keep using it. */
        const tw = trigger.offsetWidth || triggerRect.width;
        const th = trigger.offsetHeight || triggerRect.height;

        const firstNode = actionRefs.current[0];
        const beadH = firstNode ? firstNode.offsetHeight : th * 0.7;
        const triggerR = Math.min(tw, th) / 2;
        const beadR = firstNode
          ? Math.min(firstNode.offsetWidth, firstNode.offsetHeight) / 2
          : beadH / 2;
        const offsets = fabSlots(actions.length, layout, direction, {
          triggerR,
          beadR,
          gap,
        });

        // Stage bounds in root coords, covering the trigger and every slot.
        const cx0 = triggerRect.left - rootBox.left + triggerRect.width / 2;
        const cy0 = triggerRect.top - rootBox.top + triggerRect.height / 2;
        let minX = -tw / 2;
        let maxX = tw / 2;
        let minY = -th / 2;
        let maxY = th / 2;
        for (const [i, off] of offsets.entries()) {
          const node = actionRefs.current[i];
          const bw = (node?.offsetWidth || beadH) / 2;
          const bh = (node?.offsetHeight || beadH) / 2;
          minX = Math.min(minX, off.x - bw);
          maxX = Math.max(maxX, off.x + bw);
          minY = Math.min(minY, off.y - bh);
          maxY = Math.max(maxY, off.y + bh);
        }
        stage.style.left = `${cx0 + minX - SLACK}px`;
        stage.style.top = `${cy0 + minY - SLACK}px`;
        stage.style.width = `${maxX - minX + SLACK * 2}px`;
        stage.style.height = `${maxY - minY + SLACK * 2}px`;

        const stageBox = stage.getBoundingClientRect();
        const width = Math.ceil(stageBox.width);
        const height = Math.ceil(stageBox.height);
        const nextDpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        if (width !== lastW || height !== lastH || nextDpr !== dpr) {
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          field.resize(width, height, nextDpr);
          lastW = width;
          lastH = height;
        }
        canvasH = height;
        dpr = nextDpr;

        triggerBlob = {
          cx: triggerRect.left + triggerRect.width / 2 - stageBox.left,
          cy: triggerRect.top + triggerRect.height / 2 - stageBox.top,
          hw: tw / 2,
          hh: th / 2,
          r: triggerR,
        };
        triggerCenter = { x: triggerBlob.cx, y: triggerBlob.cy };
        slotBlobs = offsets.map((off, i) => {
          const node = actionRefs.current[i];
          const bw = (node?.offsetWidth || beadH) / 2;
          const bh = (node?.offsetHeight || beadH) / 2;
          return {
            cx: triggerCenter.x + off.x,
            cy: triggerCenter.y + off.y,
            hw: bw,
            hh: bh,
            r: Math.min(bw, bh),
          };
        });
      };

      const paint = (blobs: Blob[], necks: Neck[], liveK: number) => {
        field.draw({
          packed: packUniforms({ blobs, necks, k: liveK }, dpr, canvasH),
          k: liveK * dpr,
          time: (performance.now() - start) / 1000,
          wobble: WOBBLE * energy.value,
          alpha: 1,
          hover:
            hoverBlob && hoverAmt > 0.01
              ? packHover(hoverBlob, hoverAmt * HOVER_WOBBLE, dpr, canvasH)
              : null,
        });
      };

      const liveK = () => REST_K + (K_ACTIVE - REST_K) * energy.value;

      const tick = () => {
        const t = oT.value;
        const prog = clamp01(t);
        const v = t - pOpen;
        pOpen = t;
        energy.bump(Math.abs(v));

        const { blobs, necks } = fabPhase(triggerBlob, slotBlobs, t);
        updateHover(blobs);
        const k = liveK();
        /* Melt the neck as the fab closes: the whole merge fades to zero by the
         * time the beads absorb, so the trigger-to-bead neck recedes by strength
         * instead of snapping off at the clean-close cut. At settled open the
         * floor keeps a faint pull; mid-travel the sine drives the full goo.
         * Floor the neck merge while open so settled-open beads keep a faint
         * pull; necks still fully retract as prog falls to 0 on close. */
        const merge =
          prog > 0
            ? Math.max(REST_MERGE, Math.sin(Math.PI * prog)) *
              smoothstep(0.02, 0.28, prog)
            : 0;
        const bridge = fabBridges(blobs, k, merge, layout);
        /* Below this the field settles to a clean trigger, no absorbed-bead halo. */
        const closed = prog < 0.06;
        const drawBlobs = closed ? [triggerBlob] : blobs;
        const drawNecks = closed ? [] : [...necks, ...bridge];
        paint(drawBlobs, drawNecks, k);

        // Beads are DOM parts moved to match their blob each frame.
        const last = slotBlobs.length;
        for (let i = 0; i < last; i++) {
          const node = actionRefs.current[i];
          const bead = blobs[i + 1];
          if (!node || !bead) continue;
          node.style.transform = `translate(-50%, -50%) translate(${
            bead.cx - triggerCenter.x
          }px, ${bead.cy - triggerCenter.y}px)`;
          node.style.opacity = closed
            ? "0"
            : `${clamp01((prog - i * FAB_STAGGER) / 0.22)}`;
        }

        if (
          running === 0 &&
          energy.parked() &&
          hoverIndex < 0 &&
          hoverAmt < 0.02
        ) {
          return;
        }
        raf = requestAnimationFrame(tick);
      };
      const wake = () => {
        if (!gate.awake()) return;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      };
      const gate = createPauseGate({
        target: root,
        onPause: () => cancelAnimationFrame(raf),
        onResume: () => wake(),
      });

      const controls = new Set<ReturnType<typeof animate>>();
      const run = (to: [number, number]) => {
        running += 1;
        const control = animate(oT, { value: to }, sideSpring);
        controls.add(control);
        const finish = () => {
          running = Math.max(0, running - 1);
          controls.delete(control);
        };
        void control.finished.then(finish, finish);
        wake();
        return control;
      };

      let openControl: ReturnType<typeof animate> | null = null;
      const toOpen = (next: boolean) => {
        measure();
        openControl?.stop();
        /* Motion caches one visual element per animated subject and reads the
         * next "from" out of it, so a bare oT.value reset is invisible to it.
         * The explicit [0,1] / [1,0] keyframes are what make the second and
         * every later toggle animate instead of snapping. */
        openControl = run(next ? [0, 1] : [1, 0]);
      };
      openTargetRef.current = toOpen;

      measure();
      wake();

      /* Hovering the trigger or a bead wakes a ripple on that part alone; the
       * rest of the chain stays a calm sheet of glass. */
      const hoverNodes = [trigger, ...actionRefs.current].filter(
        (node): node is HTMLElement => node != null,
      );
      const hoverHandlers = hoverNodes.map((node, index) => {
        const enter = () => {
          hoverIndex = index;
          wake();
        };
        const leave = () => {
          if (hoverIndex === index) hoverIndex = -1;
        };
        node.addEventListener("pointerenter", enter);
        node.addEventListener("pointerleave", leave);
        return { node, enter, leave };
      });

      const remeasure = () => {
        measure();
        wake();
      };
      const observer =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(remeasure);
      observer?.observe(root);
      window.addEventListener("resize", remeasure);
      void document.fonts?.ready.then(remeasure).catch(() => undefined);

      const themeObserver =
        typeof MutationObserver === "undefined"
          ? null
          : new MutationObserver(() => {
              field.setColors(readColors(root, overrides));
              wake();
            });
      themeObserver?.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class"],
      });

      return () => {
        for (const control of controls) control.stop();
        openTargetRef.current = () => {};
        for (const { node, enter, leave } of hoverHandlers) {
          node.removeEventListener("pointerenter", enter);
          node.removeEventListener("pointerleave", leave);
        }
        window.removeEventListener("resize", remeasure);
        observer?.disconnect();
        themeObserver?.disconnect();
        gate.dispose();
        cancelAnimationFrame(raf);
        field.dispose();
        canvas.style.width = "";
        canvas.style.height = "";
        for (const node of actionRefs.current) {
          if (!node) continue;
          node.style.transform = "";
          node.style.opacity = "";
        }
      };
    }, [
      isFluid,
      backdrop,
      tint,
      accentColor,
      shine,
      actions.length,
      layout,
      direction,
      gap,
    ]);

    // Drive the field toggle from the open state.
    const previousOpen = React.useRef(open);
    React.useLayoutEffect(() => {
      const was = previousOpen.current;
      previousOpen.current = open;
      if (isFluid && was !== open) openTargetRef.current(open);
    }, [open, isFluid]);

    // Hide the actions from AT and the tab order while closed, and move focus.
    React.useEffect(() => {
      const nodes = actionRefs.current;
      for (const node of nodes) {
        if (!node) continue;
        if (open) node.removeAttribute("inert");
        else node.setAttribute("inert", "");
      }
      if (open) {
        const first = nodes[0]?.querySelector<HTMLElement>(
          "a, button, [tabindex]",
        );
        first?.focus();
      }
    }, [open]);

    const onRootKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Escape" && openRef.current) {
        event.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const runAction = (action: SulaFabAction) => {
      action.onClick?.();
      setOpen(false);
    };

    return (
      // biome-ignore lint/a11y/noStaticElementInteractions: the root is a plain container; the keydown only closes the menu on Escape, while the real controls are the trigger button and the action buttons inside it
      <div
        ref={(node) => {
          rootRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        data-fluid={isFluid ? "on" : "off"}
        data-open={open || undefined}
        onKeyDown={onRootKeyDown}
        className={cn("relative inline-flex", className)}
        {...props}
      >
        {isFluid ? (
          <div
            ref={stageRef}
            aria-hidden="true"
            className="pointer-events-none absolute overflow-hidden"
          >
            <canvas ref={canvasRef} />
          </div>
        ) : null}

        {actions.map((action, index) => {
          const offset = slotOffsets[index] ?? { x: 0, y: 0 };
          const restTransform = `translate(-50%, -50%) translate(${
            open ? offset.x : 0
          }px, ${open ? offset.y : 0}px)`;
          const domStyle: React.CSSProperties | undefined = isFluid
            ? undefined
            : {
                transform: restTransform,
                opacity: open ? 1 : 0,
              };
          const Tag = action.href ? "a" : "button";
          return (
            <div
              key={action.label}
              ref={(node) => {
                actionRefs.current[index] = node;
              }}
              style={domStyle}
              className={cn(
                "absolute top-1/2 left-1/2 z-10",
                !isFluid &&
                  "transition-[transform,opacity] duration-slow ease-spring motion-reduce:transition-none",
                !isFluid && !open && "pointer-events-none",
              )}
            >
              <Tag
                type={action.href ? undefined : "button"}
                href={action.href}
                aria-label={action.label}
                onClick={() => runAction(action)}
                className={cn(
                  "peer grid size-11 place-items-center rounded-full outline-none",
                  "border border-border bg-surface/80 text-ink shadow-raised backdrop-blur-md",
                  "transition-tint duration-fast ease-soft hover:text-accent",
                  "focus-visible:ring-focus",
                )}
              >
                <span aria-hidden="true" className="inline-flex">
                  {action.icon}
                </span>
              </Tag>
              <span
                aria-hidden="true"
                data-tooltip-position={resolvedTooltipPosition}
                className={cn(
                  "pointer-events-none absolute",
                  resolvedTooltipPosition === "left" &&
                    "top-1/2 right-full mr-3 -translate-y-1/2",
                  resolvedTooltipPosition === "right" &&
                    "top-1/2 left-full ml-3 -translate-y-1/2",
                  resolvedTooltipPosition === "top" &&
                    "bottom-full left-1/2 mb-3 -translate-x-1/2",
                  "rounded-md border border-border bg-sunken px-2 py-1 text-xs whitespace-nowrap text-on-sunken",
                  "opacity-0 transition-opacity duration-fast",
                  "peer-hover:opacity-100 peer-focus-visible:opacity-100",
                )}
              >
                {action.label}
              </span>
            </div>
          );
        })}

        <button
          ref={triggerRef}
          type="button"
          aria-label={label}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen(!open)}
          className={cn(
            "relative z-20 grid size-14 place-items-center rounded-full outline-none",
            "border border-border bg-surface text-ink shadow-raised",
            "transition-transform duration-fast ease-soft focus-visible:ring-focus",
            "data-[open=true]:rotate-45",
          )}
          data-open={open || undefined}
        >
          <span aria-hidden="true" className="inline-flex">
            {icon}
          </span>
        </button>
      </div>
    );
  },
);
SulaFab.displayName = "SulaFab";
