"use client";
import * as React from "react";
import {
  isScrubZone,
  pointerToTurn,
  scrubValue,
  snapToStep,
  stepValue,
  turnToValue,
  valueToTurn,
} from "./knob-geometry.js";

type DragMode = "arc" | "scrub";

export interface UseKnobValueOptions {
  value?: number;
  defaultValue?: number;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
  onValueCommitted?: (value: number) => void;
}

interface KeyIntent {
  min: number;
  max: number;
  step: number;
  shiftKey: boolean;
}

function nextForKey(
  key: string,
  value: number,
  { min, max, step, shiftKey }: KeyIntent,
): number | null {
  const move = shiftKey ? step / 10 : step;
  switch (key) {
    case "ArrowUp":
    case "ArrowRight":
      return stepValue(value, 1, min, max, move);
    case "ArrowDown":
    case "ArrowLeft":
      return stepValue(value, -1, min, max, move);
    case "PageUp":
      return stepValue(value, 10, min, max, move);
    case "PageDown":
      return stepValue(value, -10, min, max, move);
    case "Home":
      return min;
    case "End":
      return max;
    default:
      return null;
  }
}

export function useKnobValue({
  value,
  defaultValue,
  min,
  max,
  step,
  disabled,
  onValueChange,
  onValueCommitted,
}: UseKnobValueOptions) {
  const [uncontrolled, setUncontrolled] = React.useState(() =>
    snapToStep(defaultValue ?? min, min, max, step),
  );
  const [mode, setMode] = React.useState<DragMode | null>(null);
  const dragging = mode !== null;

  const isControlled = value !== undefined;
  const current = isControlled
    ? snapToStep(value, min, max, step)
    : uncontrolled;

  const rectRef = React.useRef<DOMRect | null>(null);
  const turnRef = React.useRef(0);
  const pendingRef = React.useRef(false);
  const scrubRef = React.useRef({ x: 0, value: 0 });

  const change = (next: number) => {
    if (next === current) return;
    if (!isControlled) setUncontrolled(next);
    onValueChange?.(next);
  };

  const offsetFrom = (
    event: React.PointerEvent<HTMLElement>,
    rect: DOMRect,
  ) => ({
    dx: event.clientX - (rect.left + rect.width / 2),
    dy: event.clientY - (rect.top + rect.height / 2),
    radius: rect.width / 2,
  });

  const track = (
    event: React.PointerEvent<HTMLElement>,
    active: DragMode,
    jump = false,
  ) => {
    const rect = rectRef.current;
    if (!rect) return;

    if (active === "scrub") {
      const start = scrubRef.current;
      change(
        scrubValue(
          start.value,
          event.clientX - start.x,
          min,
          max,
          step,
          event.shiftKey,
        ),
      );
      return;
    }

    const { dx, dy, radius } = offsetFrom(event, rect);
    const turn = pointerToTurn(dx, dy, radius, jump ? null : turnRef.current);
    if (turn === null) return;
    turnRef.current = turn;
    change(snapToStep(turnToValue(turn, min, max), min, max, step));
  };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (disabled || event.button !== 0) return;
    const element = event.currentTarget;
    element.setPointerCapture?.(event.pointerId);
    const rect = element.getBoundingClientRect();
    rectRef.current = rect;

    const { dx, dy, radius } = offsetFrom(event, rect);
    const active: DragMode = isScrubZone(dx, dy, radius) ? "scrub" : "arc";
    setMode(active);

    if (active === "scrub") {
      scrubRef.current = { x: event.clientX, value: current };
      return;
    }
    turnRef.current = valueToTurn(current, min, max);
    track(event, active, true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (mode) track(event, mode);
  };

  const endDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (!mode) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    rectRef.current = null;
    setMode(null);
    onValueCommitted?.(current);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (disabled) return;
    const next = nextForKey(event.key, current, {
      min,
      max,
      step,
      shiftKey: event.shiftKey,
    });
    if (next === null) return;
    event.preventDefault();
    pendingRef.current = true;
    change(next);
  };

  const onKeyUp = () => {
    if (!pendingRef.current) return;
    pendingRef.current = false;
    onValueCommitted?.(current);
  };

  return {
    value: current,
    dragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onKeyDown,
      onKeyUp,
    },
  };
}
