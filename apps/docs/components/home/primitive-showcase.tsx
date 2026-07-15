import {
  Badge,
  Button,
  Checkbox,
  Chip,
  Input,
  Label,
  Progress,
  StatChip,
  Switch,
} from "@matt-pasek/usva";

/* The furniture is only convincing in a room. This is a screen out of the app
 * the system was extracted from, not a swatch page: a student enrolling on a
 * course, which is the single densest thing sisu-plus does. */
function Cell({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col rounded-xl border border-border bg-surface/35 p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function PrimitiveShowcase() {
  return (
    <div
      data-primitive-grid=""
      className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-6"
    >
      <Cell className="gap-5 md:col-span-2 lg:col-span-4 lg:row-span-2">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-ink">
            enrol on a course
          </span>
          <Badge tone="accent" mono>
            4 seats left
          </Badge>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="course-code">course code</Label>
          <Input
            id="course-code"
            defaultValue="TIES324"
            placeholder="TIEA341"
          />
        </div>

        <Checkbox defaultChecked label="add it to my timeline" />
        <Switch defaultChecked label="tell me if a seat opens" />

        <div className="mt-auto flex flex-wrap items-center gap-3">
          <Button size="sm">enrol</Button>
          <Button size="sm" variant="ghost">
            cancel
          </Button>
        </div>
      </Cell>

      <Cell className="min-h-40 gap-4 lg:col-span-2">
        <span className="text-sm font-medium text-ink">find a course</span>
        <Input placeholder="code, name, teacher" aria-label="find a course" />
        <div className="flex flex-wrap gap-2">
          <Chip>autumn</Chip>
          <Chip>open</Chip>
          <Chip>5 op</Chip>
        </div>
      </Cell>

      <Cell className="min-h-40 gap-4 lg:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-ink">this degree</span>
          <Badge mono>bsc</Badge>
        </div>
        <Progress value={142} max={180} />
        <div className="flex flex-wrap gap-2">
          <StatChip label="credits" value="142" unit="op" />
          <StatChip label="left" value="38" unit="op" tone="accent" />
        </div>
      </Cell>

      <Cell className="min-h-36 justify-between gap-5 lg:col-span-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-ink">tell me about</span>
          <Badge tone="success" mono>
            2 rules
          </Badge>
        </div>
        <div className="flex flex-col gap-3">
          <Checkbox defaultChecked label="a deadline inside 48 hours" />
          <Checkbox label="a grade I have not read" />
        </div>
      </Cell>

      <Cell className="min-h-36 justify-between gap-5 lg:col-span-3">
        <span className="text-sm font-medium text-ink">this term</span>
        <div className="flex flex-wrap items-center gap-2">
          <Chip>period 1</Chip>
          <Chip>period 2</Chip>
          <Chip>period 3</Chip>
          <Chip>period 4</Chip>
        </div>
      </Cell>
    </div>
  );
}
