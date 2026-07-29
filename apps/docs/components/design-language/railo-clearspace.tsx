import { Railo } from "@/components/railo";
import {
  lensWidth,
  RAILO_CUTS,
  railoInkBox,
  railoLens,
  railoLensBox,
} from "@/lib/railo-geometry";

const CUT = RAILO_CUTS.display;
const INK = railoInkBox(CUT);
const LENS = railoLensBox(CUT);

const MARK_W = 132;
/** Everything is measured off the fields, not the viewBox, so the room reads as
 * one lens from the edge of the mark rather than from its empty margin. */
const SCALE = MARK_W / INK.width;
const MARK_H = Math.round(INK.height * SCALE);

/** Clearspace is one lens width, so the room around the mark is set by the
 * mark's own gap rather than by a number picked off a grid. */
const GAP = Math.round(lensWidth(CUT) * SCALE);
const LENS_LONG = Math.round(LENS.height * SCALE);

const CENTRE = { x: LENS.x + LENS.width / 2, y: LENS.y + LENS.height / 2 };
const UPRIGHT_VIEW_BOX = `${LENS.x} ${LENS.y} ${LENS.width} ${LENS.height}`;
/** Rotating the path alone would leave a portrait viewBox around a landscape
 * shape, and preserveAspectRatio would quietly shrink it to fit. */
const LAID_VIEW_BOX = [
  CENTRE.x - LENS.height / 2,
  CENTRE.y - LENS.width / 2,
  LENS.height,
  LENS.width,
].join(" ");

const EDGES = [
  { key: "top", className: "top-0 left-1/2 -translate-x-1/2", upright: false },
  {
    key: "bottom",
    className: "bottom-0 left-1/2 -translate-x-1/2",
    upright: false,
  },
  { key: "left", className: "top-1/2 left-0 -translate-y-1/2", upright: true },
  {
    key: "right",
    className: "top-1/2 right-0 -translate-y-1/2",
    upright: true,
  },
] as const;

function GhostLens({ upright }: { upright: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={upright ? UPRIGHT_VIEW_BOX : LAID_VIEW_BOX}
      width={upright ? GAP : LENS_LONG}
      height={upright ? LENS_LONG : GAP}
      className="block text-accent/25"
    >
      <path
        d={railoLens(CUT)}
        fill="currentColor"
        transform={upright ? undefined : `rotate(90 ${CENTRE.x} ${CENTRE.y})`}
      />
    </svg>
  );
}

export function RailoClearspace() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-surface p-10">
      <div
        className="relative rounded-md border border-accent/30 border-dashed"
        style={{ padding: GAP }}
      >
        {EDGES.map(({ key, className, upright }) => (
          <span
            key={key}
            aria-hidden="true"
            className={`pointer-events-none absolute ${className}`}
          >
            <GhostLens upright={upright} />
          </span>
        ))}

        <Railo crop style={{ width: MARK_W, height: MARK_H }} />
      </div>
      <p className="max-w-md text-center text-muted text-sm">
        the room around the mark is one lens wide, the same gap the mark leaves
        in itself. nothing sits closer.
      </p>
    </div>
  );
}
