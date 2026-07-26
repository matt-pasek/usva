import { Terminal } from "@matt-pasek/usva/primitives/terminal";
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
          as a package dependency, and the one to reach for first:
        </p>
        <Terminal command={`bun add ${packageName}`} />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-sm text-muted">or copy the source in, via shadcn:</p>
        <Terminal command={`npx shadcn add ${registryUrl(registryName)}`} />
      </div>
    </div>
  );
}
