export interface InstallBlockProps {
  /** Registry slug used to build the shadcn add URL, e.g. "checkbox". */
  registryName: string;
  packageName?: string;
}

export function InstallBlock({
  registryName,
  packageName = "@matt-pasek/usva",
}: InstallBlockProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted">
          As a package dependency (recommended):
        </p>
        <pre className="overflow-x-auto rounded-md border border-border bg-surface-2 p-3 text-xs text-ink">
          <code>bun add {packageName}</code>
        </pre>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted">
          Or copy the source into your project via shadcn:
        </p>
        <pre className="overflow-x-auto rounded-md border border-border bg-surface-2 p-3 text-xs text-ink">
          <code>npx shadcn add https://usva.dev/r/{registryName}.json</code>
        </pre>
      </div>
    </div>
  );
}
