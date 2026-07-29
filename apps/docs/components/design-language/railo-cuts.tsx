import { Railo } from "@/components/railo";
import {
  crescentWidth,
  lensWidth,
  RAILO_CUTS,
  type RailoCutName,
} from "@/lib/railo-geometry";

const CUTS: { name: RailoCutName; when: string; why: string }[] = [
  {
    name: "display",
    when: "24px and up",
    why: "thin crescents around a wide lens. the gap does most of the talking.",
  },
  {
    name: "micro",
    when: "16px to 24px",
    why: "the fields move out until crescent and lens weigh the same, so neither one thins away first.",
  },
];

/** True pixel sizes, not a scaled diagram. The point is what survives. */
const SIZES = [48, 32, 24, 16];

export function RailoCuts() {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {CUTS.map(({ name, when, why }) => {
          const cut = RAILO_CUTS[name];
          return (
            <div
              key={name}
              className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6"
            >
              <div className="flex items-center gap-4">
                <div className="grid size-24 shrink-0 place-items-center rounded-lg bg-sunken">
                  <Railo cut={name} className="size-16" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-ink">{name}</span>
                  <span className="text-muted text-sm">{when}</span>
                </div>
              </div>
              <p className="text-muted text-sm">{why}</p>
              <dl className="flex gap-5 border-border border-t pt-3 font-mono text-[0.7rem] text-muted">
                <div className="flex gap-1.5">
                  <dt>r</dt>
                  <dd className="text-ink">{cut.radius}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt>centres</dt>
                  <dd className="text-ink">
                    {cut.left} / {cut.right}
                  </dd>
                </div>
                <div className="flex gap-1.5">
                  <dt>crescent</dt>
                  <dd className="text-ink">{crescentWidth(cut)}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt>lens</dt>
                  <dd className="text-ink">{lensWidth(cut)}</dd>
                </div>
              </dl>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6">
        <span className="font-mono text-[0.7rem] text-muted uppercase tracking-[0.16em]">
          at true size
        </span>
        <div className="flex flex-wrap items-end gap-8">
          {SIZES.map((size) => (
            <div key={size} className="flex flex-col items-center gap-2">
              <Railo
                cut={size < 24 ? "micro" : "display"}
                className="shrink-0"
                style={{ width: size, height: size }}
              />
              <span className="font-mono text-[0.65rem] text-muted">
                {size}
              </span>
            </div>
          ))}
        </div>
        <p className="max-w-xl text-muted text-sm">
          16 is the floor. below it the lens closes and the mark becomes a
          smudge, so there is nothing to use.
        </p>
      </div>
    </div>
  );
}
