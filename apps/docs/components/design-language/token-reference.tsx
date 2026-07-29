import { buildTokenReference } from "@/lib/token-reference";

function Table({
  title,
  rows,
}: {
  title: string;
  rows: { name: string; value: string }[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="font-mono text-[0.7rem] text-muted uppercase tracking-widest">
        {title}
      </h3>
      <dl className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
        {rows.map(({ name, value }) => (
          <div
            key={name}
            className="grid items-center gap-3 p-3 sm:grid-cols-[1fr_auto] sm:gap-6"
          >
            <dt className="font-mono text-ink text-xs">{name}</dt>
            <dd className="font-mono text-muted text-xs tabular-nums">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function TokenReference() {
  const { spacing, radius, type, motion } = buildTokenReference();
  return (
    <div className="flex flex-col gap-8">
      <Table title="spacing" rows={spacing} />
      <Table title="radius" rows={radius} />
      <Table title="type" rows={type} />
      <Table title="motion · duration" rows={motion} />
    </div>
  );
}
