import { tokens } from "./tokens.js";

type DTCGToken = { $type: string; $value: string };
const dim = (v: string): DTCGToken => ({ $type: "dimension", $value: v });
const dur = (v: string): DTCGToken => ({ $type: "duration", $value: v });

export function toDTCG() {
  return {
    radius: Object.fromEntries(
      Object.entries(tokens.radius).map(([k, v]) => [k, dim(v)]),
    ),
    space: Object.fromEntries(
      Object.entries(tokens.space).map(([k, v]) => [k, dim(v)]),
    ),
    text: Object.fromEntries(
      Object.entries(tokens.text).map(([k, v]) => [k, dim(v)]),
    ),
    motion: {
      duration: {
        fast: dur(tokens.motion.duration.fast),
        base: dur(tokens.motion.duration.base),
        slow: dur(tokens.motion.duration.slow),
      },
    },
  };
}
