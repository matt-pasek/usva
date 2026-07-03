"use client";
import {
  Button,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from "@matt-pasek/usva";
import { useState } from "react";

export function FieldGroupDemo() {
  const [value, setValue] = useState("");
  const invalid = value.trim().length > 0 && !value.includes("@");

  return (
    <div className="flex flex-col gap-6">
      <FieldGroup>
        <FieldLabel>Email address</FieldLabel>
        <FieldControl>
          <Input
            type="email"
            placeholder="you@studio.fi"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </FieldControl>
        <FieldDescription>
          Type without an @ to trip the error state.
        </FieldDescription>
        {invalid ? <FieldError>Enter a valid email address.</FieldError> : null}
      </FieldGroup>

      <FieldGroup>
        <FieldLabel>Workspace name</FieldLabel>
        <FieldControl>
          <Input defaultValue="usva-labs" />
        </FieldControl>
        <FieldDescription>
          A healthy field: description wired to <code>aria-describedby</code>,
          no error.
        </FieldDescription>
      </FieldGroup>

      <div className="flex items-center gap-3">
        <Button
          variant="soft"
          size="sm"
          onClick={() =>
            setValue((v) => (v.includes("@") || v === "" ? "broken" : v))
          }
        >
          Force error
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setValue("")}>
          Reset
        </Button>
      </div>
    </div>
  );
}
