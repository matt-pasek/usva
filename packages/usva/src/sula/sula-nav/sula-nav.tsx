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
  bridgeNecks,
  measureRestBlobs,
  morphBlob,
  type Neck,
  packHover,
  packUniforms,
  restDiffers,
} from "../sula-core/geometry.js";
import { clamp01, smoother, smoothstep } from "../sula-motion/curves.js";
import { createEnergyTracker } from "../sula-motion/energy.js";
import {
  barSpring,
  dripRetract,
  type SulaMotionSpec,
  sideSpring,
  switchSpring,
  textFade,
} from "../sula-motion/springs.js";
import {
  loadPhase,
  revealSide,
  type SwitchRole,
  switchFade,
  switchProgress,
} from "./nav-geometry.js";

/** A section-indicator tab shown inside an expanded view. */
export interface SulaNavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  /** On the tab itself, so a dense route set can drop its secondary entries at a
   * breakpoint rather than overflowing the bar. */
  className?: string;
}

/** A navigable view: collapsed to an icon pill, expanded to a bar of its items. */
export interface SulaNavView {
  href: string;
  label: string;
  icon: React.ReactNode;
  items?: SulaNavItem[];
}

/**
 * A field that separates off the nav's body and settles in a corner: a control
 * that belongs to the nav but does not belong in the middle of it, like a search
 * trigger or a theme control.
 *
 * It is not a second component. It is the same body, split. One renderer paints
 * the whole bar, so a satellite is a disjoint field of the nav's own material
 * rather than a widget parked beside it, and the separation is what the reveal
 * animates. Peer components crammed into the bar would put several liquid fields
 * in one region, competing for the same attention; a satellite adds none.
 */
export interface SulaNavSatellite {
  id: string;
  /** Which corner it flows out to. Defaults to the right. */
  align?: "left" | "right";
  /** Names the group for assistive tech, since the contents are yours. */
  label: string;
  children: React.ReactNode;
}

/** The width at which item labels unfold; below it the tabs are icon-only. */
export type SulaNavLabelsFrom = "sm" | "md" | "lg" | "xl";

const LABEL_COLLAPSE: Record<SulaNavLabelsFrom, string> = {
  sm: "max-sm:max-w-0 max-sm:overflow-hidden max-sm:opacity-0",
  md: "max-md:max-w-0 max-md:overflow-hidden max-md:opacity-0",
  lg: "max-lg:max-w-0 max-lg:overflow-hidden max-lg:opacity-0",
  xl: "max-xl:max-w-0 max-xl:overflow-hidden max-xl:opacity-0",
};

export interface SulaNavProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  views: SulaNavView[];
  /** href of the expanded view. Controlled. Defaults to the first view. */
  activeView?: string;
  onViewChange?: (href: string) => void;
  /** href of the active section tab inside the expanded view. Controlled. */
  activeItem?: string;
  onNavigate?: (href: string) => void;
  linkComponent?: React.ElementType;

  brand?: React.ReactNode;
  brandHref?: string;
  brandLabel?: string;

  /**
   * Fields that split off the body and settle in a corner. Handing them here
   * rather than rendering them beside the nav is what keeps them one material
   * with it: they are measured, revealed and painted as parts of this field.
   */
  satellites?: SulaNavSatellite[];
  /** Below this width the item labels fold away and the tabs are icons. */
  labelsFrom?: SulaNavLabelsFrom;

  /** Vertical nudge in px from the nav's anchor: positive is down, negative up. */
  offset?: number;

  ariaLabel?: string;
  fluid?: boolean;
  backdrop?: string;
  tint?: string;
  accentColor?: string;
  /** 0 is flat matte glass, 1 is the full neon rim. Defaults to the theme. */
  shine?: number;
  mergeRadius?: number;
  revealDelay?: number;
  /**
   * Whether the brand and the collapsed view pills are out. Defaults to true and
   * reveals on mount. Drive it from scroll or focus to melt everything but the
   * active bar back in; a hidden part is not tabbable.
   */
  sidesOpen?: boolean;
}

/**
 * The canvas is anchored to the nav, not to the viewport, so the bar falls out of
 * the canvas's own top edge. Kept compact so the drip forms just above the bar and
 * separates near it, rather than trailing a long thread down the whole card.
 */
const DROP_HEIGHT = 124;
/** How far below the nav the canvas reaches, so a neck can hang past the pills. */
const CANVAS_SLACK = 64;
/** Horizontal room past the nav, so a pill's cap and neck are not clipped. */
const SLACK_X = 104;
const MAX_DPR = 2;

/** The bar's labels start fading in at this much of the drop, not on settle. */
const TEXT_AT = 0.75;
/** The tether lets go the moment the bar first reaches its line, mid-settle,
 * instead of waiting out the spring's long formal tail. */
const DRIP_AT = 0.97;
/** Merge radius while a transition is live; things read gooey, then firm. */
const K_ACTIVE = 24;
/** Signed elastic deformation: stretch along the travel, squash against it on
 * the rebound, capped so it never tears. */
const SQUASH_GAIN = 3.4;
const SQUASH_MAX = 0.11;
/** Peak surface undulation, in px of edge displacement. Kept below the authored
 * stretch/squash motion so long bars read as fluid glass, not a noisy coastline. */
const WOBBLE_MAX = 0.24;
/** How far the row compresses toward its centre at the peak of a switch. */
const PULL_FRAC = 0.06;
/** Merge floor: adjacent parts within reach hold a soft surface-tension waist at
 * rest, so the row reads as parts pulling toward each other rather than floating
 * apart. Kept low so it never fuses into one slab. */
const REST_MERGE = 0.32;
/** Bridge-neck reach as a multiple of the merge radius. The switch tail and the
 * rest path must share it: a spring's `.finished` resolves about a second after
 * the visual settle, and only then does the rest path take over, so if it reached
 * for necks any differently the bridges would visibly recalculate a beat late. */
const NECK_REACH = 1.15;
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
  return {
    backdrop,
    tint: resolveColor(overrides.tint ?? token("--usva-surface")),
    accent: resolveColor(overrides.accent ?? token("--usva-accent")),
    shine: overrides.shine ?? shineForBackdrop(backdrop),
  };
}

const shift = (blob: Blob, rest: Blob): string =>
  `translate3d(${blob.cx - rest.cx}px, ${blob.cy - rest.cy}px, 0)`;

/** The pills and brand fade up once the sides are most of the way out. */
const labelFade = (t: number): number => {
  const s = clamp01((t - 0.82) / 0.16);
  return s * s * (3 - 2 * s);
};

export const SulaNav = React.forwardRef<HTMLElement, SulaNavProps>(
  (
    {
      views,
      activeView,
      onViewChange,
      activeItem,
      onNavigate,
      linkComponent: Link = "a",
      brand,
      brandHref = "/",
      brandLabel,
      satellites,
      labelsFrom = "sm",
      offset = 0,
      ariaLabel = "Primary",
      fluid = true,
      backdrop,
      tint,
      accentColor,
      shine,
      mergeRadius = 14,
      revealDelay = 120,
      sidesOpen = true,
      className,
      style,
      ...props
    },
    forwardedRef,
  ) => {
    const reduced = useReducedMotion();
    const navRef = React.useRef<HTMLElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const stageRef = React.useRef<HTMLDivElement | null>(null);
    const brandRef = React.useRef<HTMLDivElement | null>(null);
    const viewRefs = React.useRef<Array<HTMLDivElement | null>>([]);
    const itemRefs = React.useRef<Record<string, HTMLLIElement | null>>({});
    const satRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

    const leftSats = React.useMemo(
      () => (satellites ?? []).filter((s) => s.align === "left"),
      [satellites],
    );
    const rightSats = React.useMemo(
      () => (satellites ?? []).filter((s) => s.align !== "left"),
      [satellites],
    );
    const hasSatellites = leftSats.length > 0 || rightSats.length > 0;
    const leftKey = leftSats.map((s) => s.id).join(" ");
    const rightKey = rightSats.map((s) => s.id).join(" ");

    const [failed, setFailed] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    const isFluid = fluid && !reduced && !failed && mounted;

    const resolvedActiveView = activeView ?? views[0]?.href;
    const activeViewIndex = Math.max(
      0,
      views.findIndex((view) => view.href === resolvedActiveView),
    );
    const activeItems = views[activeViewIndex]?.items ?? [];

    const activeIndexRef = React.useRef(activeViewIndex);
    activeIndexRef.current = activeViewIndex;
    const leftCountRef = React.useRef(leftSats.length);
    leftCountRef.current = leftSats.length;
    const switchRef = React.useRef<(previous: number) => void>(() => {});
    const setSidesRef = React.useRef<(open: boolean) => void>(() => {});
    const sidesOpenRef = React.useRef(sidesOpen);
    sidesOpenRef.current = sidesOpen;

    const [indicator, setIndicator] = React.useState({
      left: 0,
      width: 0,
      ready: false,
    });

    /* A tab the route set drops at this breakpoint measures zero wide, and an
     * indicator pinned to it would read as the first tab being active. */
    React.useLayoutEffect(() => {
      const place = () => {
        const el = activeItem ? itemRefs.current[activeItem] : null;
        if (!el || el.offsetWidth === 0) {
          setIndicator((current) => ({ ...current, ready: false }));
          return;
        }
        setIndicator({
          left: el.offsetLeft,
          width: el.offsetWidth,
          ready: true,
        });
      };
      place();
      window.addEventListener("resize", place);
      return () => window.removeEventListener("resize", place);
    }, [activeItem]);

    /* Left to right, because bridgeNecks reads adjacency out of this order. */
    const collectParts = React.useCallback(
      () =>
        [
          brandRef.current,
          ...(leftKey ? leftKey.split(" ") : []).map(
            (id) => satRefs.current[id] ?? null,
          ),
          ...viewRefs.current,
          ...(rightKey ? rightKey.split(" ") : []).map(
            (id) => satRefs.current[id] ?? null,
          ),
        ].filter((node): node is HTMLDivElement => node != null),
      [leftKey, rightKey],
    );

    React.useEffect(() => {
      if (!isFluid) return;
      const canvas = canvasRef.current;
      const stage = stageRef.current;
      const nav = navRef.current;
      if (!canvas || !stage || !nav) return;

      const overrides = { backdrop, tint, accent: accentColor, shine };
      const field = createField({
        canvas,
        colors: readColors(nav, overrides),
        onContextLost: () => setFailed(true),
      });
      if (!field) {
        setFailed(true);
        return;
      }

      let rest: Blob[] = [];
      /** Blob coordinates are relative to the stage box. A width change re-centres
       * the nav, so the box shifts on screen and the two ends of a switch would be
       * measured in different frames; the last box lets a switch reconcile them. */
      let stageBox: DOMRect | null = null;
      let canvasH = 0;
      let dpr = 1;
      let raf = 0;
      let running = 0;
      let hoverIndex = -1;
      let hoverAmt = 0;
      let hoverBlob: Blob | null = null;
      let hoverPoint = { x: 0, y: 0 };
      let hoverTarget = { x: 0, y: 0 };
      let hasHoverPoint = false;
      const energy = createEnergyTracker();
      const start = performance.now();

      /* The ripple follows the hovered part's live blob; on leave the blob is
       * kept so the ripple fades in place instead of teleporting to zero. */
      const updateHover = (aligned: Array<Blob | undefined>) => {
        const focus =
          hoverIndex >= 0 ? (aligned[hoverIndex] ?? rest[hoverIndex]) : null;
        hoverAmt += ((focus ? 1 : 0) - hoverAmt) * HOVER_EASE;
        if (focus) {
          hoverBlob = focus;
          if (!hasHoverPoint) {
            hoverPoint = { x: focus.cx, y: focus.cy };
            hoverTarget = hoverPoint;
            hasHoverPoint = true;
          }
        }
        hoverPoint.x += (hoverTarget.x - hoverPoint.x) * HOVER_EASE;
        hoverPoint.y += (hoverTarget.y - hoverPoint.y) * HOVER_EASE;
      };

      const bT = { value: 0 };
      const dT = { value: 0 };
      const sT = { value: 0 };
      const swT = { value: 1 };
      let switchFrom: Blob[] = [];
      let switchTo: Blob[] = [];
      let switchRoles: SwitchRole[] = [];
      let switching = false;
      let loaded = false;
      let lastBlobs: Blob[] = [];

      let pBar = 0;
      let pSide = 0;
      let pDrip = 0;
      let pSwitch = 1;
      const barText = { value: 0 };

      const squash = (b: Blob, v: number, vertical: boolean): Blob => {
        const s = Math.max(-SQUASH_MAX, Math.min(SQUASH_MAX, v * SQUASH_GAIN));
        if (Math.abs(s) <= 0.001) return b;
        const hw = vertical ? b.hw * (1 - s * 0.5) : b.hw * (1 + s);
        const hh = vertical ? b.hh * (1 + s) : b.hh * (1 - s * 0.5);
        return { ...b, hw, hh, r: Math.min(b.r, Math.abs(hw), Math.abs(hh)) };
      };

      let lastW = 0;
      let lastH = 0;
      const measure = (): boolean => {
        const parts = collectParts();

        const box = stage.getBoundingClientRect();
        stageBox = box;
        const width = Math.ceil(box.width);
        const height = Math.ceil(box.height);
        const nextDpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        const sized = width !== lastW || height !== lastH || nextDpr !== dpr;

        if (sized) {
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          field.resize(width, height, nextDpr);
          lastW = width;
          lastH = height;
        }
        canvasH = height;
        dpr = nextDpr;

        const next = measureRestBlobs(parts, box);
        if (!sized && !restDiffers(rest, next)) return false;
        rest = next;
        return true;
      };

      /* Parts run [left satellites, brand, views, right satellites], so the view
       * block starts past whatever sits to its left. */
      const brandOffset = () =>
        leftCountRef.current + (brandRef.current ? 1 : 0);
      const activePart = () => activeIndexRef.current + brandOffset();

      const drawFrame = (blobs: Blob[], necks: Neck[], liveK: number) => {
        field.draw({
          packed: packUniforms({ blobs, necks, k: liveK }, dpr, canvasH),
          k: liveK * dpr,
          time: (performance.now() - start) / 1000,
          wobble: WOBBLE_MAX * energy.value * energy.value,
          alpha: 1,
          hover:
            hoverBlob && hoverAmt > 0.01
              ? packHover(
                  hoverBlob,
                  hoverAmt * HOVER_WOBBLE,
                  dpr,
                  canvasH,
                  hoverPoint,
                )
              : null,
        });
      };

      const loadFrame = () => {
        const parts = collectParts();
        const barIndex = activePart();
        const barRest = rest[barIndex];
        if (!barRest) return;

        const vBar = bT.value - pBar;
        const vSide = sT.value - pSide;
        const vDrip = dT.value - pDrip;
        pBar = bT.value;
        pSide = sT.value;
        pDrip = dT.value;

        const load = loadPhase(barRest, bT.value, 0, dT.value);
        const barBlob = squash(load.bar, vBar, true);
        /* The row in left-to-right part order (brand, active bar, side pills),
         * so bridgeNecks can hold a neck between each adjacent pair. */
        const rowBlobs: Blob[] = [];
        const aligned: Array<Blob | undefined> = [];
        const necks: Neck[] = [...load.necks];

        const barNode = parts[barIndex];
        if (barNode) {
          barNode.style.transform = shift(load.bar, barRest);
          barNode.style.opacity = `${barText.value}`;
        }

        for (let i = 0; i < parts.length; i++) {
          if (i === barIndex) {
            rowBlobs.push(barBlob);
            aligned[i] = barBlob;
            continue;
          }
          const restI = rest[i];
          if (!restI) continue;
          const side = revealSide(load.bar, restI, sT.value, mergeRadius);
          const sideBlob = squash(side.blob, vSide, false);
          rowBlobs.push(sideBlob);
          aligned[i] = sideBlob;
          if (side.neck) necks.push(side.neck);
          const node = parts[i];
          if (node) {
            node.style.transform = shift(side.blob, restI);
            node.style.opacity = `${labelFade(sT.value)}`;
          }
        }

        /* Energy is measured velocity, not a spring's finished promise: a
         * spring reports done long after visible rest, so releasing k and
         * wobble on it reads as a phantom width shift a second late. */
        const speed = Math.abs(vBar) + Math.abs(vSide) + Math.abs(vDrip);
        energy.bump(speed);
        const liveK = mergeRadius + (K_ACTIVE - mergeRadius) * energy.value;
        /* Rest tension necks between adjacent row parts. The reach uses a
         * slightly wider k so parts at the default flex gap still neck at rest.
         * They persist because the last drawn frame keeps them once the field
         * parks. Transition necks come first so they win the MAX_NECKS budget.
         * Scaled by how far the sides are out (sT): when they melt in, the merge
         * fades to zero so a lone bar shows no orphan pinch toward a hidden part,
         * and adjacency stays correct because the row order is unchanged. */
        const restMerge = REST_MERGE * smoothstep(0.5, 0.95, sT.value);
        const restNecks =
          restMerge > 0.001
            ? bridgeNecks(rowBlobs, liveK * NECK_REACH, restMerge)
            : [];
        const blobs: Blob[] = [...rowBlobs, ...load.extras];
        lastBlobs = blobs;
        updateHover(aligned);
        drawFrame(blobs, [...necks, ...restNecks], liveK);
      };

      const switchFrame = () => {
        const parts = collectParts();
        const t = swT.value;
        const posT = smoother(t);
        /* The transition envelope is zero at both ends of the switch and peaks in
         * the middle. Necks floor at REST_MERGE so the row keeps its rest surface
         * tension, but the centroid pull rides the raw envelope so it releases
         * fully at t=1; a floored pull would leave the row compressed at rest and
         * jump the moment loadFrame takes over. */
        const transition = Math.sin(Math.PI * clamp01(t));
        const merge = Math.max(REST_MERGE, transition);
        const vSwitch = t - pSwitch;
        pSwitch = t;
        const centroid =
          switchTo.reduce((sum, b) => sum + b.cx, 0) /
          Math.max(1, switchTo.length);

        const blobs: Blob[] = [];
        const aligned: Array<Blob | undefined> = [];
        for (let i = 0; i < parts.length; i++) {
          const from = switchFrom[i];
          const to = switchTo[i];
          if (!from || !to) continue;
          const role = switchRoles[i] ?? "keep";
          const base = morphBlob(from, to, posT, switchProgress(t, role));
          const pulled: Blob = {
            ...base,
            cx: base.cx + (centroid - to.cx) * PULL_FRAC * transition,
          };
          blobs.push(pulled);
          aligned[i] = pulled;
          const node = parts[i];
          if (node) {
            node.style.transform = shift(pulled, to);
            node.style.opacity = `${switchFade(t, role)}`;
          }
        }

        energy.bump(Math.abs(vSwitch));
        const liveK = mergeRadius + (K_ACTIVE - mergeRadius) * energy.value;
        /* Same reach as the rest path, so when the switch spring's `.finished`
         * hands off to loadFrame a beat after settle the necks do not resize. */
        const necks = bridgeNecks(blobs, liveK * NECK_REACH, merge);
        lastBlobs = blobs;
        updateHover(aligned);
        drawFrame(blobs, necks, liveK);
      };

      let textStarted = false;
      let dripStarted = false;
      const tick = () => {
        if (switching) switchFrame();
        else loadFrame();

        if (!textStarted && bT.value >= TEXT_AT) {
          textStarted = true;
          run(barText, 1, textFade);
        }
        if (!dripStarted && bT.value >= DRIP_AT) {
          dripStarted = true;
          run(dT, 1, dripRetract);
        }
        if (
          running === 0 &&
          energy.parked() &&
          hoverIndex < 0 &&
          hoverAmt < 0.02
        ) {
          switching = false;
          return;
        }
        raf = requestAnimationFrame(tick);
      };
      const wake = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      };

      const controls = new Set<ReturnType<typeof animate>>();
      const run = (
        target: { value: number },
        to: number | [number, number],
        opts: SulaMotionSpec,
      ) => {
        running += 1;
        const control = animate(target, { value: to }, opts);
        controls.add(control);
        const finish = () => {
          running = Math.max(0, running - 1);
          controls.delete(control);
        };
        void control.finished.then(finish, finish);
        wake();
        return control;
      };

      let disposed = false;
      let revealComplete = false;
      let revealTimer = 0;
      let sideControl: ReturnType<typeof animate> | null = null;
      let swControl: ReturnType<typeof animate> | null = null;
      let switchId = 0;
      let measureQueued = false;

      const setSides = (open: boolean) => {
        if (!revealComplete) return;
        const to = open ? 1 : 0;
        if (sT.value === to) return;
        sideControl?.stop();
        sideControl = run(sT, to, sideSpring);
      };
      setSidesRef.current = setSides;

      const doSwitch = (previousIndex: number) => {
        if (!loaded) return;
        const currentSwitchId = ++switchId;
        const off = brandOffset();
        const oldBox = stageBox;
        const from =
          switching && lastBlobs.length === rest.length ? lastBlobs : rest;
        measure();
        const dx = oldBox && stageBox ? oldBox.left - stageBox.left : 0;
        const dy = oldBox && stageBox ? oldBox.top - stageBox.top : 0;
        switchFrom = from.map((b) => ({ ...b, cx: b.cx + dx, cy: b.cy + dy }));
        switchTo = rest.map((b) => ({ ...b }));
        switchRoles = rest.map((_, i) => {
          const view = i - off;
          if (view === activeIndexRef.current) return "show";
          if (view === previousIndex) return "hide";
          return "keep";
        });
        switching = true;
        swT.value = 0;
        pSwitch = 0;
        swControl?.stop();
        /* Motion caches one visual element per animated subject and reads the
         * next "from" out of it, so a bare swT.value reset is invisible to it.
         * The explicit [0, 1] keyframes are what make the second and every
         * later switch animate instead of snapping. */
        swControl = run(swT, [0, 1], switchSpring);
        void swControl.finished.then(
          () => {
            if (disposed || currentSwitchId !== switchId) return;
            switching = false;
            if (measureQueued) {
              measureQueued = false;
              measure();
            }
            wake();
          },
          () => undefined,
        );
        switchFrame();
      };
      switchRef.current = doSwitch;

      measure();
      for (const node of collectParts()) node.style.opacity = "0";
      let fontTimer = 0;
      let revealed = false;
      const beginReveal = () => {
        if (disposed || revealed) return;
        revealed = true;
        window.clearTimeout(fontTimer);
        measure();
        const barControl = run(bT, 1, barSpring);
        void barControl.finished
          .then(() => {
            if (disposed) return;
            const handOff = () => {
              if (disposed) return;
              revealComplete = true;
              loaded = true;
              if (collectParts().length > 1) setSides(sidesOpenRef.current);
            };
            if (revealDelay > 0) {
              revealTimer = window.setTimeout(handOff, revealDelay);
            } else {
              handOff();
            }
          })
          .catch(() => undefined);
        wake();
      };
      /* A late webfont swap re-measures wider text and twitches a bar that
       * already looks settled, so the drop waits for the fonts, capped so a
       * slow font file cannot hold the nav hostage. */
      const fonts = document.fonts;
      if (fonts && fonts.status !== "loaded") {
        void fonts.ready.then(beginReveal).catch(beginReveal);
        fontTimer = window.setTimeout(beginReveal, 400);
      } else {
        beginReveal();
      }

      /* Hovering a part wakes a broad wave at the pointer. The target updates on
       * pointermove while updateHover eases the rendered point toward it. */
      const hoverNodes = collectParts();
      const hoverHandlers = hoverNodes.map((node, index) => {
        const move = (event: PointerEvent) => {
          if (!stageBox) return;
          hoverTarget = {
            x: event.clientX - stageBox.left,
            y: event.clientY - stageBox.top,
          };
          if (!hasHoverPoint) {
            hoverPoint = hoverTarget;
            hasHoverPoint = true;
          }
          wake();
        };
        const enter = (event: PointerEvent) => {
          hoverIndex = index;
          move(event);
        };
        const leave = () => {
          if (hoverIndex === index) hoverIndex = -1;
        };
        node.addEventListener("pointerenter", enter);
        node.addEventListener("pointermove", move);
        node.addEventListener("pointerleave", leave);
        return { node, enter, move, leave };
      });

      const remeasure = () => {
        if (switching) {
          measureQueued = true;
          return;
        }
        if (measure()) wake();
      };
      const observer =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(remeasure);
      observer?.observe(nav);

      window.addEventListener("resize", remeasure);
      void document.fonts?.ready.then(remeasure).catch(() => undefined);

      const themeObserver =
        typeof MutationObserver === "undefined"
          ? null
          : new MutationObserver(() => {
              field.setColors(readColors(nav, overrides));
              wake();
            });
      themeObserver?.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "class"],
      });

      return () => {
        disposed = true;
        window.clearTimeout(revealTimer);
        window.clearTimeout(fontTimer);
        for (const control of controls) control.stop();
        switchRef.current = () => {};
        setSidesRef.current = () => {};
        for (const { node, enter, move, leave } of hoverHandlers) {
          node.removeEventListener("pointerenter", enter);
          node.removeEventListener("pointermove", move);
          node.removeEventListener("pointerleave", leave);
        }
        window.removeEventListener("resize", remeasure);
        observer?.disconnect();
        themeObserver?.disconnect();
        cancelAnimationFrame(raf);
        field.dispose();
        for (const node of collectParts()) {
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
      mergeRadius,
      revealDelay,
      collectParts,
    ]);

    const previousViewIndex = React.useRef(activeViewIndex);
    React.useLayoutEffect(() => {
      const previous = previousViewIndex.current;
      previousViewIndex.current = activeViewIndex;
      if (isFluid && previous !== activeViewIndex) {
        switchRef.current(previous);
      }
    }, [activeViewIndex, isFluid]);

    React.useEffect(() => {
      if (isFluid) setSidesRef.current(sidesOpen);
    }, [sidesOpen, isFluid]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: brand/views/satellites gate which nodes exist
    React.useEffect(() => {
      const nodes = [
        brandRef.current,
        ...viewRefs.current.filter((_, i) => i !== activeViewIndex),
        ...Object.values(satRefs.current),
      ];
      for (const node of nodes) {
        if (!node) continue;
        if (sidesOpen) node.removeAttribute("inert");
        else node.setAttribute("inert", "");
      }
    }, [sidesOpen, activeViewIndex, brand, views, satellites]);

    const part = cn(
      "relative rounded-full",
      !isFluid &&
        "border border-border bg-surface/85 shadow-raised backdrop-blur-xl",
    );

    const navStyle: React.CSSProperties = {
      ...style,
      ...(offset ? { transform: `translateY(${offset}px)` } : null),
    };

    const brandNode = brand ? (
      <div
        ref={brandRef}
        className={cn(part, !sidesOpen && !isFluid && "hidden")}
      >
        <Link
          href={brandHref}
          aria-label={brandLabel}
          onClick={() => onNavigate?.(brandHref)}
          className="flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-ink outline-none focus-visible:ring-focus sm:px-5"
        >
          {brand}
        </Link>
      </div>
    ) : null;

    const satelliteNode = (satellite: SulaNavSatellite) => (
      // biome-ignore lint/a11y/useSemanticElements: a fieldset is for form controls; this is a named grouping of nav controls inside a landmark
      <div
        key={satellite.id}
        ref={(node) => {
          satRefs.current[satellite.id] = node;
        }}
        role="group"
        aria-label={satellite.label}
        className={cn(part, !sidesOpen && !isFluid && "hidden")}
      >
        {satellite.children}
      </div>
    );

    const viewNodes = views.map((view, index) => {
      const isActive = index === activeViewIndex;
      return (
        <div
          key={view.href}
          ref={(node) => {
            viewRefs.current[index] = node;
          }}
          className={cn(part, !isActive && !sidesOpen && !isFluid && "hidden")}
          data-active={isActive || undefined}
        >
          {isActive ? (
            <ul className="flex items-center gap-1 p-1.5">
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute top-1.5 bottom-1.5 left-0 rounded-full bg-ink/6",
                  "transition-layout duration-slow ease-spring motion-reduce:transition-none",
                  !indicator.ready && "opacity-0",
                )}
                style={{
                  width: indicator.width,
                  transform: `translateX(${indicator.left}px)`,
                }}
              />
              {activeItems.map((item) => (
                <li
                  key={item.href}
                  ref={(node) => {
                    itemRefs.current[item.href] = node;
                  }}
                  className={cn("relative z-10", item.className)}
                >
                  <Link
                    href={item.href}
                    aria-current={item.href === activeItem ? "page" : undefined}
                    onClick={() => onNavigate?.(item.href)}
                    className={cn(
                      "flex min-h-11 items-center gap-2 rounded-full px-3 text-sm whitespace-nowrap outline-none sm:px-4",
                      "text-muted transition-tint duration-fast ease-soft hover:text-ink",
                      "aria-[current=page]:text-ink focus-visible:ring-focus",
                    )}
                  >
                    {item.icon ? (
                      <span aria-hidden="true" className="inline-flex shrink-0">
                        {item.icon}
                      </span>
                    ) : null}
                    <span
                      className={cn(item.icon && LABEL_COLLAPSE[labelsFrom])}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Link
              href={view.href}
              aria-label={view.label}
              onClick={(event: React.MouseEvent) => {
                if (onViewChange) {
                  event.preventDefault();
                  onViewChange(view.href);
                }
              }}
              className="grid size-11 place-items-center rounded-full text-ink outline-none focus-visible:ring-focus"
            >
              {view.icon}
            </Link>
          )}
        </div>
      );
    });

    const stage = isFluid ? (
      <div
        ref={stageRef}
        aria-hidden="true"
        className="pointer-events-none absolute overflow-hidden"
        style={{
          top: -DROP_HEIGHT,
          bottom: -CANVAS_SLACK,
          left: -SLACK_X,
          right: -SLACK_X,
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    ) : null;

    return (
      <nav
        ref={(node) => {
          navRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        aria-label={ariaLabel}
        data-fluid={isFluid ? "on" : "off"}
        className={cn(
          "relative items-center",
          /* Satellites need real corners to fly to, and the body needs to stay
           * centred no matter how unbalanced the two ends are, which is what a
           * flex row cannot give. */
          hasSatellites
            ? "grid w-full grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4"
            : "flex gap-4",
          className,
        )}
        style={navStyle}
        {...props}
      >
        {stage}

        {hasSatellites ? (
          <>
            <div className="flex items-center gap-2 justify-self-start sm:gap-4">
              {brandNode}
              {leftSats.map(satelliteNode)}
            </div>
            <div className="flex items-center gap-4 justify-self-center">
              {viewNodes}
            </div>
            <div className="flex items-center gap-2 justify-self-end sm:gap-4">
              {rightSats.map(satelliteNode)}
            </div>
          </>
        ) : (
          <>
            {brandNode}
            {viewNodes}
          </>
        )}
      </nav>
    );
  },
);
SulaNav.displayName = "SulaNav";
