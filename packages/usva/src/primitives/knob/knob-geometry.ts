export const KNOB_SWEEP = 270;
export const KNOB_START_ANGLE = -135;

export const KNOB_DRAG_TRAVEL = 150;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const clamp = (n: number, min: number, max: number) =>
  n < min ? min : n > max ? max : n;

export function valueToTurn(value: number, min: number, max: number): number {
  if (max === min) return 0;
  return clamp01((value - min) / (max - min));
}

export function turnToValue(turn: number, min: number, max: number): number {
  return min + clamp01(turn) * (max - min);
}

export function turnToAngle(turn: number): number {
  return KNOB_START_ANGLE + clamp01(turn) * KNOB_SWEEP;
}

export function arcLength(radius: number): number {
  return (2 * Math.PI * radius * KNOB_SWEEP) / 360;
}

export function dashForTurn(turn: number, radius: number): string {
  const length = arcLength(radius);
  return `${length * clamp01(turn)} ${length}`;
}

export function arcPath(radius: number, center: number): string {
  const at = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: center + radius * Math.sin(rad),
      y: center - radius * Math.cos(rad),
    };
  };
  const round = (n: number) => Math.round(n * 1000) / 1000;
  const start = at(KNOB_START_ANGLE);
  const end = at(KNOB_START_ANGLE + KNOB_SWEEP);
  const largeArc = KNOB_SWEEP > 180 ? 1 : 0;
  return `M ${round(start.x)} ${round(start.y)} A ${radius} ${radius} 0 ${largeArc} 1 ${round(end.x)} ${round(end.y)}`;
}

const decimalsOf = (step: number): number => {
  const text = String(step);
  if (text.includes("e")) return 12;
  const dot = text.indexOf(".");
  return dot === -1 ? 0 : text.length - dot - 1;
};

export function snapToStep(
  value: number,
  min: number,
  max: number,
  step: number,
): number {
  const bounded = clamp(value, min, max);
  if (!(step > 0)) return bounded;
  const snapped = min + Math.round((bounded - min) / step) * step;
  return clamp(
    Number(snapped.toFixed(Math.min(decimalsOf(step), 12))),
    min,
    max,
  );
}

export function stepValue(
  value: number,
  delta: number,
  min: number,
  max: number,
  step: number,
): number {
  return snapToStep(value + delta * step, min, max, step);
}

export function dragValue(
  startValue: number,
  dx: number,
  dy: number,
  min: number,
  max: number,
  step: number,
  fine = false,
): number {
  const travel = dx - dy;
  const moved = (travel / KNOB_DRAG_TRAVEL) * (max - min) * (fine ? 0.25 : 1);
  return snapToStep(startValue + moved, min, max, step);
}
