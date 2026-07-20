import { Terminal } from "@matt-pasek/usva";
import { PACKAGE_NAME, registryUrl } from "@/lib/site";

export interface InstallBlockProps {
  /** Registry slug used to build the shadcn add URL, e.g. "checkbox". */
  registryName: string;
  packageName?: string;
}

export function InstallBlock({
  registryName,
  packageName = PACKAGE_NAME,
}: InstallBlockProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm text-muted">
          As a package dependency (recommended):
        </p>
        <Terminal command={`bun add ${packageName}`} />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-sm text-muted">
          Or copy the source into your project via shadcn:
        </p>
        <Terminal command={`npx shadcn add ${registryUrl(registryName)}`} />
      </div>
    </div>
  );
}
