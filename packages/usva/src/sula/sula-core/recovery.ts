"use client";
import * as React from "react";

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

  React.useEffect(() => {
    if (!failed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onRestored = () => {
      setFailed(false);
      setGeneration((n) => n + 1);
    };
    canvas.addEventListener("webglcontextrestored", onRestored);
    return () => canvas.removeEventListener("webglcontextrestored", onRestored);
  }, [failed, canvasRef]);

  const onContextLost = React.useCallback(() => setFailed(true), []);

  return { failed, generation, onContextLost };
}
