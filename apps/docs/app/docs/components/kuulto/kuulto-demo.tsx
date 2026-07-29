"use client";
import { Playground } from "@/components/docs/playground";
import { kuultoStudio } from "@/lib/atmospheres/kuulto.studio";

export function KuultoPlayground() {
  return (
    <Playground
      templates={kuultoStudio.templates}
      fields={kuultoStudio.fields}
      render={kuultoStudio.render}
      snippet={kuultoStudio.snippet}
      stageClassName={kuultoStudio.stageClassName}
    />
  );
}
