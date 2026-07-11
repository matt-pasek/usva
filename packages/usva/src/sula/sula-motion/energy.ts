export interface EnergyTracker {
  readonly value: number;
  bump(speed: number): number;
  parked(): boolean;
}

export interface EnergyOptions {
  decay?: number;
  gain?: number;
  parkBelow?: number;
}

/**
 * Tracks how lively the field is from measured per-frame speed, not from a
 * spring's finished promise: a spring resolves long after visible rest, so
 * releasing merge radius and wobble on it reads as a phantom width shift a second
 * late. Energy jumps to the current speed and decays each frame; the field parks
 * once it falls below the threshold.
 */
export function createEnergyTracker(
  options: EnergyOptions = {},
): EnergyTracker {
  const decay = options.decay ?? 0.9;
  const gain = options.gain ?? 40;
  const parkBelow = options.parkBelow ?? 0.02;
  let energy = 0;
  return {
    get value() {
      return energy;
    },
    bump(speed: number): number {
      energy = Math.max(energy * decay, Math.min(1, speed * gain));
      return energy;
    },
    parked(): boolean {
      return energy < parkBelow;
    },
  };
}
