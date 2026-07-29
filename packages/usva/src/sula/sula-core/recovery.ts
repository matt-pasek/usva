"use client";
import * as React from "react";

/** Backoff between retries, in ms. The last value repeats until attempts run out. */
const BACKOFF = [400, 900, 2000, 4000];
const MAX_ATTEMPTS = 6;

/**
 * Failure state for a field, and the way back out of it.
 *
 * A lost context is not permanent: the browser takes one to satisfy a new
 * request elsewhere on the page and hands it back once the pressure drops. It
 * only makes that offer to a canvas still in the document, so a component that
 * unmounts its canvas on failure is the reason a static fallback lasts until a
 * reload. Keep the canvas mounted, hide it, and rebuild on `generation`.
 */
export function useContextRecovery(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const [failed, setFailed] = React.useState(false);
  const [generation, setGeneration] = React.useState(0);
  const attempts = React.useRef(0);

  const retry = React.useCallback(() => {
    setFailed(false);
    setGeneration((n) => n + 1);
  }, []);

  React.useEffect(() => {
    if (!failed) return;

    const canvas = canvasRef.current;
    const onRestored = () => {
      attempts.current = 0;
      retry();
    };
    canvas?.addEventListener("webglcontextrestored", onRestored);

    let timer = 0;
    if (attempts.current < MAX_ATTEMPTS) {
      const wait = BACKOFF[Math.min(attempts.current, BACKOFF.length - 1)];
      attempts.current += 1;
      timer = window.setTimeout(retry, wait);
    }

    return () => {
      window.clearTimeout(timer);
      canvas?.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [failed, canvasRef, retry]);

  const onContextLost = React.useCallback(() => setFailed(true), []);

  const onContextReady = React.useCallback(() => {
    attempts.current = 0;
  }, []);

  return { failed, generation, onContextLost, onContextReady };
}
