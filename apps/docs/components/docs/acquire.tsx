"use client";
import { SegmentedControl } from "@matt-pasek/usva/patterns/segmented-control";
import { CodeSnippet } from "@matt-pasek/usva/primitives/code-snippet";
import { Terminal } from "@matt-pasek/usva/primitives/terminal";
import { trackCopy } from "@/lib/analytics/track-copy";
import { PACKAGE_NAME, registryUrl } from "@/lib/site";
import { useInstallMode } from "./install-mode";
import { Lab } from "./lab";

export interface AcquireFile {
  label: string;
  content: string;
}

export interface AcquireProps {
  registryName: string;
  /** The import-and-use example shown in install mode. */
  usage: string;
  /** The registry-emitted sources shown in copy mode. */
  files: AcquireFile[];
}

const MODES = [
  { value: "install", label: "install" },
  { value: "copy", label: "copy in" },
];

export function Acquire({ registryName, usage, files }: AcquireProps) {
  const { mode, setMode } = useInstallMode();

  return (
    <section className="mt-9">
      <h2 className="sr-only">get it</h2>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <span aria-hidden="true">
          <Lab>get it</Lab>
        </span>
        <SegmentedControl
          size="sm"
          items={MODES}
          value={mode}
          onValueChange={(value) =>
            setMode(value === "copy" ? "copy" : "install")
          }
          aria-label="how to get this component"
        />
      </div>

      {mode === "install" ? (
        <>
          <Terminal
            className="mt-4"
            command={`bun add ${PACKAGE_NAME}`}
            onCopied={() => trackCopy("install", registryName)}
          />
          <CodeSnippet
            className="mt-3"
            label="usage"
            code={usage}
            onCopied={() => trackCopy("snippet", registryName)}
          />
        </>
      ) : (
        <>
          <Terminal
            className="mt-4"
            command={`npx shadcn add ${registryUrl(registryName)}`}
            onCopied={() => trackCopy("registry", registryName)}
          />
          {files.map((file) => (
            <CodeSnippet
              key={file.label}
              className="mt-3"
              label={`source · ${file.label}`}
              note="exactly what this command copies"
              code={file.content}
              preClassName="max-h-[32rem] overflow-auto"
              onCopied={() => trackCopy("snippet", registryName)}
            />
          ))}
        </>
      )}
    </section>
  );
}
