"use client";

import {
  motion,
  RefusalChip,
  useShake,
} from "@/components/design-language/refusal";
import {
  RAILO_BOX,
  RAILO_CUTS,
  RAILO_VIEW_BOX,
  railoPaths,
} from "@/lib/railo-geometry";

const CUT = RAILO_CUTS.display;
const HALF = RAILO_BOX / 2;
const paths = railoPaths(CUT);

type Variant = "rotated" | "filled" | "outlined" | "apart" | "one-hue";

/** Each specimen is the real geometry pushed one step past the rule. */
function BrokenMark({ variant }: { variant: Variant }) {
  const circle = (cx: number, fill: string) => (
    <circle cx={cx} cy={HALF} r={CUT.radius} fill={fill} />
  );

  return (
    <svg
      aria-hidden="true"
      viewBox={RAILO_VIEW_BOX}
      className="size-16 shrink-0"
    >
      {variant === "filled" ? (
        <>
          {circle(CUT.left, "var(--usva-accent)")}
          {circle(CUT.right, "var(--usva-accent-alt)")}
        </>
      ) : variant === "apart" ? (
        <>
          {circle(18, "var(--usva-accent)")}
          {circle(82, "var(--usva-accent-alt)")}
        </>
      ) : variant === "outlined" ? (
        <g fill="none" stroke="var(--usva-accent)" strokeWidth={3}>
          <path d={paths.left} />
          <path d={paths.right} />
        </g>
      ) : (
        <g
          transform={variant === "rotated" ? `rotate(24 ${HALF} ${HALF})` : ""}
        >
          <path d={paths.left} fill="var(--usva-accent)" />
          <path
            d={paths.right}
            fill={
              variant === "one-hue"
                ? "var(--usva-accent)"
                : "var(--usva-accent-alt)"
            }
          />
        </g>
      )}
    </svg>
  );
}

const REFUSALS: { variant: Variant; message: string }[] = [
  {
    variant: "rotated",
    message: "the fields meet on the level. tilted, it is a mark about itself.",
  },
  {
    variant: "filled",
    message: "fill the gap and there is nothing left to read.",
  },
  {
    variant: "outlined",
    message: "no line here. two masses, and the space they leave.",
  },
  {
    variant: "apart",
    message: "pulled apart, nothing overlaps and nothing is subtracted.",
  },
  {
    variant: "one-hue",
    message: "two voices, or it is only a shape.",
  },
];

function RefusalSpecimen({
  variant,
  message,
}: {
  variant: Variant;
  message: string;
}) {
  const { controls, shake } = useShake();
  return (
    <motion.div
      animate={controls}
      onHoverStart={shake}
      onFocus={shake}
      tabIndex={0}
      className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 outline-none focus-visible:ring-focus"
    >
      <div className="opacity-50 grayscale-[0.35]">
        <BrokenMark variant={variant} />
      </div>
      <RefusalChip>{message}</RefusalChip>
    </motion.div>
  );
}

export function RailoRefusals() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {REFUSALS.map((refusal) => (
        <RefusalSpecimen key={refusal.variant} {...refusal} />
      ))}
    </div>
  );
}
