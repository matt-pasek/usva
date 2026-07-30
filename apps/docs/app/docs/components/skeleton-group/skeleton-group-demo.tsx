"use client";
import { Skeleton, SkeletonGroup } from "@usva-ui/react/primitives/skeleton";
import { Playground } from "@/components/docs/playground";

type Config = { grouped: boolean };

const templates: Record<string, Config> = {
  "one sweep": { grouped: true },
  "each its own": { grouped: false },
};

const snippetFor = (c: Config): string =>
  c.grouped
    ? `import { Skeleton, SkeletonGroup } from "@usva-ui/react/primitives/skeleton";

<SkeletonGroup>
  <Skeleton className="h-10 w-10 rounded-full" />
  <Skeleton className="h-4 w-40" />
  <Skeleton className="h-4 w-24" />
</SkeletonGroup>`
    : `import { Skeleton } from "@usva-ui/react/primitives/skeleton";

<Skeleton className="h-10 w-10 rounded-full" />
<Skeleton className="h-4 w-40" />
<Skeleton className="h-4 w-24" />`;

function Bones() {
  return (
    <>
      <Skeleton className="size-12 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </>
  );
}

export function SkeletonGroupDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="w-full"
      fields={[
        {
          kind: "switch",
          key: "grouped",
          label: "grouped",
          sub: "one sweep across all of them",
        },
      ]}
      snippet={snippetFor}
      render={(c) =>
        c.grouped ? (
          <SkeletonGroup className="flex w-full items-start gap-4">
            <Bones />
          </SkeletonGroup>
        ) : (
          <div className="flex w-full items-start gap-4">
            <Bones />
          </div>
        )
      }
    />
  );
}
