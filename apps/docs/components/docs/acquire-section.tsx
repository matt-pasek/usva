import { readFileSync } from "node:fs";
import path from "node:path";
import { Acquire } from "./acquire";

const REPO_ROOT = path.resolve(
  /* turbopackIgnore: true */ process.cwd(),
  "../..",
);

interface RegistryFile {
  path: string;
  target?: string;
  content: string;
}

export interface AcquireSectionProps {
  registryName: string;
  /** The import-and-use example shown in install mode. */
  usage: string;
}

/**
 * Copy mode shows the registry-emitted source, never the raw package file:
 * the emit step already rewrote the ESM ".js" specifiers to "@/lib/utils"
 * and flat "./sibling" imports, so what renders is what pastes.
 */
export function AcquireSection({ registryName, usage }: AcquireSectionProps) {
  const item = JSON.parse(
    readFileSync(
      path.join(
        /* turbopackIgnore: true */ REPO_ROOT,
        "registry/r",
        `${registryName}.json`,
      ),
      "utf8",
    ),
  ) as { files: RegistryFile[] };

  return (
    <Acquire
      registryName={registryName}
      usage={usage}
      files={item.files.map((file) => ({
        label: file.target ?? file.path,
        content: file.content,
      }))}
    />
  );
}
