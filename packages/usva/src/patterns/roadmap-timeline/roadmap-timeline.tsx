import * as React from "react";
import { cn } from "../../cn.js";

export type RoadmapTone = "done" | "current" | "planned";

export interface RoadmapItem {
  label: React.ReactNode;
  /** Lifts the item out of the list and onto its own accent card. */
  featured?: boolean;
}

export interface RoadmapMilestone {
  /** Mono chip in the top left. A version, a quarter, a date. */
  version?: React.ReactNode;
  /** Pill in the top right. The word for where this milestone stands. */
  status?: React.ReactNode;
  title: React.ReactNode;
  body?: React.ReactNode;
  items?: RoadmapItem[];
  tone?: RoadmapTone;
}

export interface RoadmapTimelineProps
  extends React.HTMLAttributes<HTMLDivElement> {
  milestones: RoadmapMilestone[];
  /** Replaces the tick drawn inside a shipped item's marker. */
  markerIcon?: React.ReactNode;
  headingLevel?: "h2" | "h3" | "h4";
  /** Hides the connector track above the cards. */
  hideTrack?: boolean;
}

const cardTones: Record<RoadmapTone, string> = {
  done: "border-border bg-ink/[0.03]",
  current:
    "border-accent/25 bg-accent/[0.05] shadow-[0_24px_60px_-40px_var(--color-accent)]",
  planned: "border-border/60 bg-ink/[0.02]",
};

const statusTones: Record<RoadmapTone, string> = {
  done: "bg-ink/[0.06] text-muted before:bg-muted",
  current: "bg-accent/15 text-accent before:bg-accent",
  planned: "bg-ink/[0.04] text-muted before:bg-faint",
};

const nodeTones: Record<RoadmapTone, string> = {
  done: "border-accent/40 bg-accent/30",
  current:
    "border-accent bg-accent shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent)_18%,transparent)]",
  planned: "border-border-strong bg-sunken",
};

const titleTones: Record<RoadmapTone, string> = {
  done: "text-ink",
  current: "text-ink",
  planned: "text-muted",
};

const bodyTones: Record<RoadmapTone, string> = {
  done: "text-muted",
  current: "text-muted",
  planned: "text-muted",
};

const itemTones: Record<RoadmapTone, string> = {
  done: "text-muted",
  current: "text-muted",
  planned: "text-muted",
};

const markerTones: Record<RoadmapTone, string> = {
  done: "border-accent/40 text-accent",
  current: "border-accent/40 text-accent",
  planned: "border-border-strong text-transparent",
};

/** The node the filled part of the track runs to: the current one, else the last shipped one. */
function progressIndex(milestones: RoadmapMilestone[]): number {
  const current = milestones.findIndex((m) => m.tone === "current");
  if (current !== -1) return current;
  return milestones.reduce(
    (last, milestone, index) => (milestone.tone === "done" ? index : last),
    -1,
  );
}

const center = (index: number, count: number): string =>
  `${((index + 0.5) / count) * 100}%`;

export const RoadmapTimeline = React.forwardRef<
  HTMLDivElement,
  RoadmapTimelineProps
>(
  (
    {
      className,
      milestones,
      markerIcon,
      headingLevel: Heading = "h3",
      hideTrack = false,
      style,
      ...props
    },
    ref,
  ) => {
    const count = milestones.length;
    const reached = progressIndex(milestones);

    return (
      <div
        ref={ref}
        className={cn("@container relative flex flex-col", className)}
        style={{ "--roadmap-columns": count, ...style } as React.CSSProperties}
        {...props}
      >
        {!hideTrack && count > 1 && (
          <div
            data-roadmap-track=""
            aria-hidden="true"
            className="relative -mb-3 hidden h-3 w-full @2xl:block"
          >
            <div
              className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,var(--color-border-strong)_0,var(--color-border-strong)_7px,transparent_7px,transparent_16px)]"
              style={{ left: center(0, count), right: center(0, count) }}
            />
            {reached > 0 && (
              <div
                data-roadmap-track-fill=""
                className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-[linear-gradient(90deg,color-mix(in_oklab,var(--color-accent)_25%,transparent),var(--color-accent))]"
                style={{
                  left: center(0, count),
                  right: `calc(100% - ${center(reached, count)})`,
                }}
              />
            )}
            {milestones.map((milestone, index) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: nodes are positional, and the list is static
                key={index}
                className={cn(
                  "-translate-x-1/2 -translate-y-1/2 absolute top-1/2 size-3 rounded-full border",
                  nodeTones[milestone.tone ?? "planned"],
                )}
                style={{ left: center(index, count) }}
              />
            ))}
          </div>
        )}

        <ol className="grid grid-cols-1 gap-4 @2xl:grid-cols-[repeat(var(--roadmap-columns),minmax(0,1fr))]">
          {milestones.map((milestone, index) => {
            const tone = milestone.tone ?? "planned";
            return (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: milestones are positional, and the list is static
                key={index}
                className={cn(
                  "flex flex-col rounded-2xl border p-6 transition-control duration-fast ease-soft",
                  "hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none",
                  cardTones[tone],
                )}
              >
                {(milestone.version != null || milestone.status != null) && (
                  <div className="mb-5 flex items-center justify-between gap-4">
                    {milestone.version != null && (
                      <span className="inline-flex rounded-lg border border-accent/25 bg-accent/[0.08] px-3 py-2 font-mono font-extrabold text-ink text-xs">
                        {milestone.version}
                      </span>
                    )}
                    {milestone.status != null && (
                      <span
                        className={cn(
                          "ml-auto inline-flex items-center gap-2 rounded-full px-3 py-1 font-bold text-[0.72rem] before:size-1.5 before:rounded-full before:content-['']",
                          statusTones[tone],
                        )}
                      >
                        {milestone.status}
                      </span>
                    )}
                  </div>
                )}

                <Heading
                  className={cn(
                    "font-bold leading-tight",
                    titleTones[tone],
                    tone === "current"
                      ? "text-[clamp(1.35rem,2.4cqi,1.8rem)]"
                      : "text-[clamp(1.22rem,2cqi,1.55rem)]",
                  )}
                >
                  {milestone.title}
                </Heading>

                {milestone.body != null && (
                  <p className={cn("mt-2 text-sm leading-6", bodyTones[tone])}>
                    {milestone.body}
                  </p>
                )}

                {milestone.items != null && milestone.items.length > 0 && (
                  <ul className="mt-5 grid gap-3 text-[0.92rem]">
                    {milestone.items.map((item, itemIndex) => (
                      <li
                        // biome-ignore lint/suspicious/noArrayIndexKey: items are positional, and the list is static
                        key={itemIndex}
                        className={cn(
                          "flex items-start gap-2 leading-6",
                          item.featured
                            ? "rounded-[0.62rem] border border-accent/30 bg-accent/[0.12] px-3 py-2 font-extrabold text-ink"
                            : itemTones[tone],
                        )}
                      >
                        {!item.featured && (
                          <span
                            aria-hidden="true"
                            className={cn(
                              "mt-1 grid size-[1.1rem] shrink-0 place-items-center rounded-[0.28rem] border-[1.5px] [&_svg]:size-3",
                              markerTones[tone],
                            )}
                          >
                            {tone !== "planned" &&
                              (markerIcon ?? <CheckIcon />)}
                          </span>
                        )}
                        {item.label}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    );
  },
);
RoadmapTimeline.displayName = "RoadmapTimeline";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
