const SCALE = [
  {
    role: "display",
    weight: 800,
    className:
      "text-[clamp(2.25rem,6cqi,3.5rem)] font-extrabold tracking-[-0.03em] leading-[1.02]",
    sample: "beauty that stays usable",
    note: "800, tracking pulled to -0.03em. the only place the family is allowed to shout.",
  },
  {
    role: "heading",
    weight: 700,
    className: "text-2xl font-bold tracking-tight",
    sample: "one grammar, three registers",
    note: "700. still tight, no longer loud.",
  },
  {
    role: "body",
    weight: 400,
    className: "text-base font-normal leading-relaxed",
    sample:
      "the distance between 400 and 800 is where the personality lives. a second family would only dilute it.",
    note: "400, normal tracking, relaxed leading. most of the site is this.",
  },
  {
    role: "small",
    weight: 400,
    className: "text-sm font-normal text-muted",
    note: "400 at a smaller size, in muted. secondary, still AA.",
    sample: "secondary copy, captions, the line under a heading.",
  },
  {
    role: "label",
    weight: 500,
    mono: true,
    className: "font-mono text-xs uppercase tracking-widest text-muted",
    sample: "region · boundary",
    note: "the mono, and the only job it has: indices, tags, metadata, code. never prose.",
  },
];

export function TypeScale() {
  return (
    <div className="@container flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
      {SCALE.map((step) => (
        <div
          key={step.role}
          className="flex flex-col gap-2 p-5 sm:grid sm:grid-cols-[7rem_1fr] sm:gap-6"
        >
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-ink text-xs">{step.role}</span>
            <span className="font-mono text-[10px] text-muted tabular-nums">
              {step.mono ? "mono" : "sans"} {step.weight}
            </span>
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <p className={`min-w-0 break-words text-ink ${step.className}`}>
              {step.sample}
            </p>
            <p className="text-muted text-xs">{step.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
