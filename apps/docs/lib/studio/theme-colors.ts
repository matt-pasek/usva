/** Normalise any CSS colour (oklch, hsl, named…) to #rrggbb via a 1px canvas. */
function cssColorToHex(value: string): string | null {
  if (!value) return null;
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.fillStyle = "#000000";
  ctx.fillStyle = value;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  const hex = (i: number) => (data[i] ?? 0).toString(16).padStart(2, "0");
  return `#${hex(0)}${hex(1)}${hex(2)}`;
}

/**
 * The value of a --usva-* role as hex. When `theme` is given, it is resolved
 * under that theme via a throwaway element rather than the live <html> theme.
 */
export function resolveRoleHex(
  role: string,
  fallback: string,
  theme?: string,
): string {
  if (typeof document === "undefined") return fallback;
  let host: HTMLElement = document.documentElement;
  let temp: HTMLElement | null = null;
  if (theme) {
    temp = document.createElement("div");
    temp.setAttribute("data-theme", theme);
    temp.style.position = "absolute";
    temp.style.visibility = "hidden";
    temp.style.pointerEvents = "none";
    document.body.appendChild(temp);
    host = temp;
  }
  const raw = getComputedStyle(host).getPropertyValue(`--usva-${role}`).trim();
  temp?.remove();
  return cssColorToHex(raw) ?? fallback;
}
