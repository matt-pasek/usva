"use client";
import { Badge, Button, HintPopover } from "@matt-pasek/usva";

export function WarningHintDemo() {
  return (
    <HintPopover
      tone="warning"
      title="Prerequisite not met"
      trigger={
        <button type="button" className="min-h-11">
          <Badge tone="warning" mono>
            2 warnings
          </Badge>
        </button>
      }
      action={
        <Button size="sm" variant="ghost">
          Dismiss
        </Button>
      }
    >
      MATH-201 must be completed before MATH-305.
    </HintPopover>
  );
}

export function PlainHintDemo() {
  return (
    <HintPopover
      tone="neutral"
      trigger={<Button variant="ghost">What counts as active?</Button>}
    >
      A student who has logged in during the last 30 days.
    </HintPopover>
  );
}
