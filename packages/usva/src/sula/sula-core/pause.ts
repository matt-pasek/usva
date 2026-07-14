export interface PauseGateOptions {
  /** The element whose visibility decides whether the surface may draw. */
  target: Element;
  /** Runs when the surface goes offscreen or the tab is hidden. */
  onPause: () => void;
  /** Runs when it comes back. */
  onResume: () => void;
  /**
   * Slack around the viewport before a surface counts as gone. Chrome like a nav
   * sits at the very edge of the viewport and a stricter test would park it while
   * it is still in front of the reader, so any overlap at all counts as visible
   * and this margin keeps a hair of hysteresis around that.
   */
  margin?: string;
}

export interface PauseGate {
  /** False while the surface is offscreen or the tab is hidden. */
  awake(): boolean;
  dispose(): void;
}

const DEFAULT_MARGIN = "20%";

/**
 * The one place a Sula surface decides whether it is allowed to draw. Every
 * surface parks its own loop on idle, but idle is not the same as unseen: a
 * hovered nav, a live switch or a standing ambient loop will happily burn frames
 * in a background tab. The gate is the shared answer, so a new surface inherits
 * it by construction rather than by remembering to bolt an observer on.
 *
 * It reports transitions only, never the current frame's state, so a resume
 * hands control back to a loop that picks up from its live values: nothing here
 * rewinds a choreography.
 */
export function createPauseGate(options: PauseGateOptions): PauseGate {
  const { target, onPause, onResume, margin = DEFAULT_MARGIN } = options;

  let onScreen = true;
  let awake = true;

  const sync = () => {
    const next = onScreen && !isHidden();
    if (next === awake) return;
    awake = next;
    if (next) onResume();
    else onPause();
  };

  const io =
    typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(
          (entries) => {
            onScreen = entries[entries.length - 1]?.isIntersecting ?? true;
            sync();
          },
          { rootMargin: margin },
        );
  io?.observe(target);

  const onVisibility = () => sync();
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", onVisibility);
  }

  return {
    awake: () => awake,
    dispose() {
      io?.disconnect();
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", onVisibility);
      }
    },
  };
}

function isHidden(): boolean {
  return typeof document !== "undefined" && document.hidden;
}
