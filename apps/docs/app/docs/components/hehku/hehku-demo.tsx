"use client";
import { Playground } from "@/components/docs/playground";
import { hehkuStudio } from "@/lib/atmospheres/hehku.studio";

export function HehkuPlayground() {
  return (
    <Playground
      templates={hehkuStudio.templates}
      fields={hehkuStudio.fields}
      render={hehkuStudio.render}
      snippet={hehkuStudio.snippet}
      stageClassName={hehkuStudio.stageClassName}
    />
  );
}
