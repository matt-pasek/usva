"use client";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@matt-pasek/usva";

export function TooltipDemo() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-4">
        <Tooltip>
          <TooltipTrigger
            render={<Button variant="outline">Hover me</Button>}
          />
          <TooltipContent>Deploys the current branch</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<Button variant="soft">Focus me</Button>} />
          <TooltipContent sideOffset={10}>
            Offset further from the trigger
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
