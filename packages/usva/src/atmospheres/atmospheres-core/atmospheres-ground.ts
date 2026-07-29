import type { BlendMode } from "./atmospheres-color.js";

export type GroundSupport = "port" | "restrict" | "forbid";

export const LIGHT_GROUND_SUPPORT = {
  kynnos: "port",
  vare: "port",
  utu: "port",
  kuulto: "restrict",
  hehku: "forbid",
  loimu: "forbid",
  kajastus: "forbid",
  routa: "port",
} as const satisfies Record<string, GroundSupport>;

export type AtmosphereName = keyof typeof LIGHT_GROUND_SUPPORT;

export function supportsGround(
  name: AtmosphereName,
  mode: BlendMode,
): GroundSupport | "n/a" {
  return mode === "emissive" ? "n/a" : LIGHT_GROUND_SUPPORT[name];
}

/** True when the atmosphere must not paint: a light ground it has no form on. */
export function hiddenOnGround(name: AtmosphereName, mode: BlendMode): boolean {
  const support = supportsGround(name, mode);
  return support === "forbid" || support === "restrict";
}
