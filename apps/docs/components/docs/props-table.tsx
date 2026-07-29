import type { ReactNode } from "react";

export interface PropRow {
  name: string;
  type: string;
  defaultValue?: string;
  desc: ReactNode;
}

export function PropsTable({
  title,
  rows,
}: {
  title?: string;
  rows: PropRow[];
}) {
  return (
    <div className="mt-9">
      <h2 className="sr-only">{title ?? "props"}</h2>
      {title && (
        <p
          aria-hidden="true"
          className="mb-2.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted"
        >
          {title}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="bg-sunken/70">
              <Th>prop</Th>
              <Th>type</Th>
              <Th>default</Th>
              <Th>notes</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-t border-border">
                <td className="whitespace-nowrap px-4 py-2.5 align-top font-mono text-xs text-ink">
                  {row.name}
                </td>
                <td className="px-4 py-2.5 align-top font-mono text-xs text-accent">
                  {row.type}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 align-top font-mono text-xs text-ink">
                  {row.defaultValue ?? <span className="text-muted">—</span>}
                </td>
                <td className="px-4 py-2.5 align-top text-sm text-muted [&_b]:font-semibold [&_b]:text-ink">
                  {row.desc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="px-4 py-2.5 font-mono text-[0.62rem] font-medium uppercase tracking-[0.14em] text-muted">
      {children}
    </th>
  );
}
