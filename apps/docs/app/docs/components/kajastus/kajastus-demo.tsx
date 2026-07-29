"use client";
import { Playground } from "@/components/docs/playground";
import { kajastusStudio } from "@/lib/atmospheres/kajastus.studio";

export function KajastusPlayground() {
  return (
    <Playground
      templates={kajastusStudio.templates}
      fields={kajastusStudio.fields}
      render={kajastusStudio.render}
      snippet={kajastusStudio.snippet}
      stageClassName={kajastusStudio.stageClassName}
    />
  );
}
