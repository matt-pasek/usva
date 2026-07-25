import { Railo } from "@/components/railo";
import { lensWidth, RAILO_BOX, RAILO_CUTS } from "@/lib/railo-geometry";

const MARK = 112;
/** Clearspace is one lens width, so the room around the mark is set by the
 * mark's own gap rather than by a number picked off a grid. */
const GAP = Math.round((lensWidth(RAILO_CUTS.display) / RAILO_BOX) * MARK);

export function RailoClearspace() {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-surface p-10">
      <div
        className="rounded-md border border-accent/30 border-dashed"
        style={{ padding: GAP }}
      >
        <Railo style={{ width: MARK, height: MARK }} />
      </div>
      <p className="max-w-md text-center text-muted text-sm">
        the room around the mark is one lens wide, the same gap the mark leaves
        in itself. nothing sits closer.
      </p>
    </div>
  );
}
