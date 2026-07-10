"use client";
import { animate, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../cn.js";
import {
  createField,
  type FieldColors,
  resolveColor,
  shineForBackdrop,
} from "./nav-field.js";
import {
  type Blob,
  bridgeNecks,
  loadPhase,
  measureRestBlobs,
  morphBlob,
  type Neck,
  packUniforms,
  restDiffers,
  revealSide,
  type SwitchRole,
  switchFade,
  switchProgress,
} from "./nav-geometry.js";

/** A section-indicator tab shown inside an expanded view. */
export interface FloatingNavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

/** A navigable view: collapsed to an icon pill, expanded to a bar of its items. */
export interface FloatingNavView {
  href: string;
  label: string;
  icon: React.ReactNode;
  items?: FloatingNavItem[];
}

export interface FloatingNavProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  views: FloatingNavView[];
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

/** Underdamped on purpose: the bar lands with one soft dip and a faint second
 * bob, which loadPhase maps into pixels from the overshoot past 1. */
const BAR_SPRING = {
  type: "spring",
  stiffness: 68,
  damping: 19,
  mass: 2.9,
} as const;
const SIDE_SPRING = {
  type: "spring",
  stiffness: 70,
  damping: 16,
  mass: 2.1,
} as const;
/** Slower and heavier than a reveal: the whole row reshapes as one mass. */
const SWITCH_SPRING = {
  type: "spring",
  stiffness: 115,
  damping: 22,
  mass: 1.45,
} as const;
/** The remaining top tether pulls upward after the bar has landed. */
const DRIP_RETRACT = { duration: 1.05, ease: [0.3, 1.12, 0.36, 1] } as const;
/** The bar's labels come up once, promptly, as it lands. */
const TEXT_FADE = { duration: 0.22, ease: [0.22, 1, 0.36, 1] } as const;

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
/** Peak surface undulation, in px of edge displacement. Alive while moving,
 * gone at rest, so the field is a calm sheet of glass once settled. */
const WOBBLE_MAX = 0.6;
/** How far the row compresses toward its centre at the peak of a switch. */
const PULL_FRAC = 0.06;

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

const clamp01 = (t: number): number => Math.min(1, Math.max(0, t));
/** Symmetric flat-start-flat-end ease, so the whole row glides to its new layout
 * as one coherent mass during a switch. */
const smoother = (t: number): number => {
  const x = clamp01(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
/** The pills and brand fade up once the sides are most of the way out. */
const labelFade = (t: number): number => {
  const s = clamp01((t - 0.82) / 0.16);
  return s * s * (3 - 2 * s);
};

export const FloatingNav = React.forwardRef<HTMLElement, FloatingNavProps>(
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
    const switchRef = React.useRef<(previous: number) => void>(() => {});
    const setSidesRef = React.useRef<(open: boolean) => void>(() => {});
    const sidesOpenRef = React.useRef(sidesOpen);
    sidesOpenRef.current = sidesOpen;

    const [indicator, setIndicator] = React.useState({
      left: 0,
      width: 0,
      ready: false,
    });

    React.useLayoutEffect(() => {
      const el = activeItem ? itemRefs.current[activeItem] : null;
      if (!el) {
        setIndicator((current) => ({ ...current, ready: false }));
        return;
      }
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
    }, [activeItem]);

    const collectParts = React.useCallback(
      () =>
        [brandRef.current, ...viewRefs.current].filter(
          (node): node is HTMLDivElement => node != null,
        ),
      [],
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
      let energy = 0;
      const start = performance.now();

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

      const brandOffset = () => (brandRef.current ? 1 : 0);
      const activePart = () => activeIndexRef.current + brandOffset();

      const drawFrame = (blobs: Blob[], necks: Neck[], liveK: number) => {
        field.draw({
          packed: packUniforms({ blobs, necks, k: liveK }, dpr, canvasH),
          k: liveK * dpr,
          time: (performance.now() - start) / 1000,
          wobble: WOBBLE_MAX * energy,
          alpha: 1,
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
        const blobs: Blob[] = [squash(load.bar, vBar, true), ...load.extras];
        const necks: Neck[] = [...load.necks];

        const barNode = parts[barIndex];
        if (barNode) {
          barNode.style.transform = shift(load.bar, barRest);
          barNode.style.opacity = `${barText.value}`;
        }

        for (let i = 0; i < parts.length; i++) {
          if (i === barIndex) continue;
          const restI = rest[i];
          if (!restI) continue;
          const side = revealSide(load.bar, restI, sT.value, mergeRadius);
          blobs.push(squash(side.blob, vSide, false));
          if (side.neck) necks.push(side.neck);
          const node = parts[i];
          if (node) {
            node.style.transform = shift(side.blob, restI);
            node.style.opacity = `${labelFade(sT.value)}`;
          }
        }

        /* Energy tracks measured velocity, not the springs' finished promises:
         * a spring reports done long after visible rest, and releasing k and
         * wobble that late reads as a phantom width shift a second after the
         * bar has settled. */
        const speed = Math.abs(vBar) + Math.abs(vSide) + Math.abs(vDrip);
        energy = Math.max(energy * 0.9, Math.min(1, speed * 40));
        const liveK = mergeRadius + (K_ACTIVE - mergeRadius) * energy;
        lastBlobs = blobs;
        drawFrame(blobs, necks, liveK);
      };

      const switchFrame = () => {
        const parts = collectParts();
        const t = swT.value;
        const posT = smoother(t);
        const merge = Math.sin(Math.PI * clamp01(t));
        const vSwitch = t - pSwitch;
        pSwitch = t;
        const centroid =
          switchTo.reduce((sum, b) => sum + b.cx, 0) /
          Math.max(1, switchTo.length);

        const blobs: Blob[] = [];
        for (let i = 0; i < parts.length; i++) {
          const from = switchFrom[i];
          const to = switchTo[i];
          if (!from || !to) continue;
          const role = switchRoles[i] ?? "keep";
          const base = morphBlob(from, to, posT, switchProgress(t, role));
          const pulled: Blob = {
            ...base,
            cx: base.cx + (centroid - to.cx) * PULL_FRAC * merge,
          };
          blobs.push(pulled);
          const node = parts[i];
          if (node) {
            node.style.transform = shift(pulled, to);
            node.style.opacity = `${switchFade(t, role)}`;
          }
        }

        energy = Math.max(energy * 0.9, Math.min(1, Math.abs(vSwitch) * 40));
        const liveK = mergeRadius + (K_ACTIVE - mergeRadius) * energy;
        const necks = bridgeNecks(blobs, liveK, merge);
        lastBlobs = blobs;
        drawFrame(blobs, necks, liveK);
      };

      let textStarted = false;
      let dripStarted = false;
      const tick = () => {
        if (switching) switchFrame();
        else loadFrame();

        if (!textStarted && bT.value >= TEXT_AT) {
          textStarted = true;
          run(barText, 1, TEXT_FADE);
        }
        if (!dripStarted && bT.value >= DRIP_AT) {
          dripStarted = true;
          run(dT, 1, DRIP_RETRACT);
        }
        if (running === 0 && energy < 0.02) {
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
        opts:
          | typeof BAR_SPRING
          | typeof SIDE_SPRING
          | typeof SWITCH_SPRING
          | typeof DRIP_RETRACT
          | typeof TEXT_FADE,
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
        sideControl = run(sT, to, SIDE_SPRING);
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
        swControl = run(swT, [0, 1], SWITCH_SPRING);
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
        const barControl = run(bT, 1, BAR_SPRING);
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

    // biome-ignore lint/correctness/useExhaustiveDependencies: brand/views gate which nodes exist
    React.useEffect(() => {
      const nodes = [
        brandRef.current,
        ...viewRefs.current.filter((_, i) => i !== activeViewIndex),
      ];
      for (const node of nodes) {
        if (!node) continue;
        if (sidesOpen) node.removeAttribute("inert");
        else node.setAttribute("inert", "");
      }
    }, [sidesOpen, activeViewIndex, brand, views]);

    const part = cn(
      "relative rounded-full",
      !isFluid &&
        "border border-border bg-surface/85 shadow-raised backdrop-blur-xl",
    );

    const navStyle: React.CSSProperties = {
      ...style,
      ...(offset ? { transform: `translateY(${offset}px)` } : null),
    };

    return (
      <nav
        ref={(node) => {
          navRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        aria-label={ariaLabel}
        data-fluid={isFluid ? "on" : "off"}
        className={cn("relative flex items-center gap-4", className)}
        style={navStyle}
        {...props}
      >
        {isFluid ? (
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
        ) : null}

        {brand ? (
          <div
            ref={brandRef}
            className={cn(part, !sidesOpen && !isFluid && "hidden")}
          >
            <Link
              href={brandHref}
              aria-label={brandLabel}
              onClick={() => onNavigate?.(brandHref)}
              className="flex min-h-11 items-center rounded-full px-5 text-sm font-medium text-ink outline-none focus-visible:ring-focus"
            >
              {brand}
            </Link>
          </div>
        ) : null}

        {views.map((view, index) => {
          const isActive = index === activeViewIndex;
          return (
            <div
              key={view.href}
              ref={(node) => {
                viewRefs.current[index] = node;
              }}
              className={cn(
                part,
                !isActive && !sidesOpen && !isFluid && "hidden",
              )}
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
                      className="relative z-10"
                    >
                      <Link
                        href={item.href}
                        aria-current={
                          item.href === activeItem ? "page" : undefined
                        }
                        onClick={() => onNavigate?.(item.href)}
                        className={cn(
                          "flex min-h-11 items-center gap-2 rounded-full px-4 text-sm whitespace-nowrap outline-none",
                          "text-muted transition-tint duration-fast ease-soft hover:text-ink",
                          "aria-[current=page]:text-ink focus-visible:ring-focus",
                        )}
                      >
                        {item.icon ? (
                          <span
                            aria-hidden="true"
                            className="inline-flex shrink-0"
                          >
                            {item.icon}
                          </span>
                        ) : null}
                        <span
                          className={cn(
                            item.icon &&
                              "max-sm:max-w-0 max-sm:overflow-hidden max-sm:opacity-0",
                          )}
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
        })}
      </nav>
    );
  },
);
FloatingNav.displayName = "FloatingNav";
