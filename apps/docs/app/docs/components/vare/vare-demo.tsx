"use client";
import { Playground } from "@/components/docs/playground";
import { vareStudio } from "@/lib/atmospheres/vare.studio";

export function VarePlayground() {
  return (
    <Playground
      templates={vareStudio.templates}
      fields={vareStudio.fields}
      render={vareStudio.render}
      snippet={vareStudio.snippet}
      stageClassName={vareStudio.stageClassName}
    />
  );
}
