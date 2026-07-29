"use client";
import * as React from "react";
import { dragValue, snapToStep, stepValue } from "./knob-geometry.js";

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
  const [dragging, setDragging] = React.useState(false);

  const isControlled = value !== undefined;
  const current = isControlled
    ? snapToStep(value, min, max, step)
    : uncontrolled;

  const pendingRef = React.useRef(false);
  const dragRef = React.useRef({ x: 0, y: 0, value: 0 });

  const change = (next: number) => {
    if (next === current) return;
    if (!isControlled) setUncontrolled(next);
    onValueChange?.(next);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (disabled || event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, value: current };
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!dragging) return;
    const start = dragRef.current;
    change(
      dragValue(
        start.value,
        event.clientX - start.x,
        event.clientY - start.y,
        min,
        max,
        step,
        event.shiftKey,
      ),
    );
  };

  const endDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (!dragging) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
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
