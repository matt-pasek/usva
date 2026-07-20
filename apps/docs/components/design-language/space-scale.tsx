import { buildTokenReference } from "@/lib/token-reference";

export function SpaceScale() {
  const { spacing } = buildTokenReference();
  return (
    <div className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
      {spacing.map(({ name, value }) => (
        <div
          key={name}
          className="grid items-center gap-3 p-3 sm:grid-cols-[4rem_5rem_1fr] sm:gap-4"
        >
          <code className="font-mono text-ink text-xs">{name}</code>
          <span className="font-mono text-muted text-xs tabular-nums">
            {value}
          </span>
          <span className="flex items-center">
            <span
              className="h-3 rounded-sm bg-accent/70"
              style={{ width: value, maxWidth: "100%" }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}
