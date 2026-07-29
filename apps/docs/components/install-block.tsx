import { PACKAGE_NAME, registryUrl } from "@/lib/site";
import { TrackedTerminal } from "./tracked-terminal";

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
        <TrackedTerminal
          command={`bun add ${packageName}`}
          kind="install"
          name={registryName}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-sm text-muted">or copy the source in, via shadcn:</p>
        <TrackedTerminal
          command={`npx shadcn add ${registryUrl(registryName)}`}
          kind="registry"
          name={registryName}
        />
      </div>
    </div>
  );
}
