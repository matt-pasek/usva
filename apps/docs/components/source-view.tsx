import { readFileSync } from "node:fs";
import path from "node:path";

const REPO_ROOT = path.resolve(
  /* turbopackIgnore: true */ process.cwd(),
  "../..",
);

export interface SourceViewProps {
  /** Path to the source file, relative to the monorepo root. */
  filePath: string;
}

export function SourceView({ filePath }: SourceViewProps) {
  const source = readFileSync(
    path.join(/* turbopackIgnore: true */ REPO_ROOT, filePath),
    "utf8",
  );

  return (
    <pre className="max-h-[32rem] overflow-auto rounded-md border border-border bg-surface-2 p-3 text-xs text-ink">
      <code>{source}</code>
    </pre>
  );
}
