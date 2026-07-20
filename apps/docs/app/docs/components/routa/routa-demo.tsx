"use client";
import { Playground } from "@/components/docs/playground";
import { routaStudio } from "@/lib/atmospheres/routa.studio";

export function RoutaPlayground() {
  return (
    <Playground
      templates={routaStudio.templates}
      fields={routaStudio.fields}
      render={routaStudio.render}
      snippet={routaStudio.snippet}
      stageClassName={routaStudio.stageClassName}
    />
  );
}
