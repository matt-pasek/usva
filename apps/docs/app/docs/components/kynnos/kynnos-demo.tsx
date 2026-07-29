"use client";
import { Playground } from "@/components/docs/playground";
import { kynnosStudio } from "@/lib/atmospheres/kynnos.studio";

export function KynnosDemo() {
  return (
    <Playground
      templates={kynnosStudio.templates}
      fields={kynnosStudio.fields}
      render={kynnosStudio.render}
      snippet={kynnosStudio.snippet}
      stageClassName={kynnosStudio.stageClassName}
    />
  );
}
