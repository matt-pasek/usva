import { cn } from "@matt-pasek/usva/cn";
import type { CSSProperties } from "react";
import {
  RAILO_CUTS,
  RAILO_VIEW_BOX,
  type RailoCutName,
  railoInkBox,
  railoPaths,
} from "@/lib/railo-geometry";

export interface RailoProps {
  /** display above 24px, micro below it. */
  cut?: RailoCutName;
  /** two-voice is the mark. mono is for one-ink reproduction only. */
  tone?: "two-voice" | "mono";
  /** Trim the viewBox to the fields, for anything measuring off the mark's edge. */
  crop?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * railo, settled. Two fields and the lens they leave between them.
 *
 * Drawn as two fill paths rather than masked rects, so there are no element ids
 * to collide when the mark appears more than once on a page, and so this renders
 * on the server. The masked form lives in railo-motion.tsx and exists only
 * because an animated boolean has to be redone every frame.
 */
export function Railo({
  cut = "display",
  tone = "two-voice",
  crop = false,
  className,
  style,
}: RailoProps) {
  const paths = railoPaths(RAILO_CUTS[cut]);
  const twoVoice = tone === "two-voice";
  const ink = railoInkBox(RAILO_CUTS[cut]);

  return (
    <svg
      aria-hidden="true"
      viewBox={
        crop ? `${ink.x} ${ink.y} ${ink.width} ${ink.height}` : RAILO_VIEW_BOX
      }
      className={cn("size-7 shrink-0", className)}
      style={style}
    >
      <path
        d={paths.left}
        fill={twoVoice ? "var(--usva-accent)" : "currentColor"}
      />
      <path
        d={paths.right}
        fill={twoVoice ? "var(--usva-accent-alt)" : "currentColor"}
        opacity={twoVoice ? undefined : 0.55}
      />
    </svg>
  );
}
