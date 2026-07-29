"use client";
import * as React from "react";
import {
  type BlendMode,
  blendModeFor,
  type Rgb,
  relativeLuminance,
  resolveColor,
} from "./atmospheres-color.js";

/**
 * Increments on every theme change. For atmospheres whose colours come from props
 * rather than roles: re-resolve on this and repaint.
 */
export function useThemeVersion(): number {
  const [version, setVersion] = React.useState(0);
  React.useEffect(() => {
    if (typeof MutationObserver === "undefined") return;
    const observer = new MutationObserver(() => setVersion((v) => v + 1));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });
    return () => observer.disconnect();
  }, []);
  return version;
}

export interface TokenColors<R extends string> {
  /** Resolved channels for each requested role, keyed by role name. */
  colors: Record<R, Rgb>;
  /** The page ground, always resolved, because the blend flip depends on it. */
  bg: Rgb;
  /** Relative luminance of the ground, 0..1. */
  luminance: number;
  /** The house law, defaulted from the ground. */
  mode: BlendMode;
}

export interface UseTokenColorsOptions {
  /** Resolve against a scoped theme node rather than the document root. */
  scopeRef?: React.RefObject<HTMLElement | null>;
}

const BLACK: Rgb = [0, 0, 0];

function read<R extends string>(
  roles: readonly R[],
  scope: HTMLElement | null,
): TokenColors<R> {
  const node = scope ?? document.documentElement;
  const styles = getComputedStyle(node);
  const token = (role: string) =>
    styles.getPropertyValue(`--usva-${role}`).trim();

  const colors = {} as Record<R, Rgb>;
  for (const role of roles) colors[role] = resolveColor(token(role));

  const bg = resolveColor(token("bg"));
  return {
    colors,
    bg,
    luminance: relativeLuminance(bg),
    mode: blendModeFor(bg),
  };
}

function fallback<R extends string>(roles: readonly R[]): TokenColors<R> {
  const colors = {} as Record<R, Rgb>;
  for (const role of roles) colors[role] = BLACK;
  return { colors, bg: BLACK, luminance: 0, mode: "emissive" };
}

function serialize<R extends string>(state: TokenColors<R>): string {
  return `${state.mode}|${state.bg.join()}|${Object.entries(state.colors)
    .map(([role, rgb]) => `${role}:${(rgb as Rgb).join()}`)
    .join("|")}`;
}

/**
 * Resolves token roles to channels and re-resolves them whenever the theme
 * changes. Without the MutationObserver a runtime theme swap leaves every
 * canvas painted in the colours of the theme it mounted under.
 */
export function useTokenColors<R extends string>(
  roles: readonly R[],
  options: UseTokenColorsOptions = {},
): TokenColors<R> {
  const { scopeRef } = options;
  const key = roles.join(",");
  const rolesRef = React.useRef(roles);
  rolesRef.current = roles;

  const [state, setState] = React.useState<TokenColors<R>>(() =>
    fallback(roles),
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: the role list rides a ref, so its contents key the effect, not its identity.
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const current = rolesRef.current;

    let last = "";
    const sync = () => {
      const next = read(current, scopeRef?.current ?? null);
      const signature = serialize(next);
      if (signature === last) return;
      last = signature;
      setState(next);
    };
    sync();

    if (typeof MutationObserver === "undefined") return;
    const observer = new MutationObserver(sync);
    const attributeFilter = ["data-theme", "class", "style"];
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter,
    });
    const scope = scopeRef?.current;
    if (scope && scope !== document.documentElement) {
      observer.observe(scope, { attributes: true, attributeFilter });
    }
    return () => observer.disconnect();
  }, [key, scopeRef]);

  return state;
}
