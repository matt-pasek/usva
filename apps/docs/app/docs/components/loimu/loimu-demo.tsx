"use client";
import { Playground } from "@/components/docs/playground";
import { loimuStudio } from "@/lib/atmospheres/loimu.studio";

export function LoimuPlayground() {
  return (
    <Playground
      templates={loimuStudio.templates}
      fields={loimuStudio.fields}
      render={loimuStudio.render}
      snippet={loimuStudio.snippet}
      stageClassName={loimuStudio.stageClassName}
    />
  );
}
