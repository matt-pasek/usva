"use client";
import { Checkbox } from "@matt-pasek/usva";
import { useState } from "react";

export function CheckboxDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Checkbox
        label="Accept terms"
        description="You agree to our terms of service and privacy policy."
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked by default" defaultChecked />
      <Checkbox label="Indeterminate" indeterminate />
      <Checkbox label="Disabled" disabled />
    </div>
  );
}
