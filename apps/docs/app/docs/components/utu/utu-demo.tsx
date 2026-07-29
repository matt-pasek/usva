"use client";
import { Playground } from "@/components/docs/playground";
import { utuStudio } from "@/lib/atmospheres/utu.studio";

export function UtuPlayground() {
  return (
    <Playground
      templates={utuStudio.templates}
      fields={utuStudio.fields}
      render={utuStudio.render}
      snippet={utuStudio.snippet}
      stageClassName={utuStudio.stageClassName}
    />
  );
}
