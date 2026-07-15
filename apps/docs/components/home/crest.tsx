import { crestLine, crestPath } from "./home-motion";

/**
 * The curved leading edge of a section arriving over the scene beneath it.
 * The fill is the page ground, so the mass reads as the page itself sliding
 * in, with one faint rim of light riding the crest.
 */
export function Crest({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 96"
      preserveAspectRatio="none"
      className={`-mb-px block h-[clamp(3rem,9vh,6rem)] w-full ${className ?? ""}`}
    >
      <path d={crestPath()} style={{ fill: "var(--usva-bg)" }} />
      <path
        d={crestLine()}
        fill="none"
        strokeWidth={1.5}
        style={{
          stroke: "color-mix(in oklab, var(--usva-accent) 35%, transparent)",
        }}
      />
    </svg>
  );
}
