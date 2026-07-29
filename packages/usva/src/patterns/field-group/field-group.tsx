"use client";
import * as React from "react";
import { cn } from "../../cn.js";
import { Label, type LabelProps } from "../../primitives/label/label.js";

interface FieldCountValue {
  length: number;
  max?: number;
}

interface FieldContextValue {
  controlId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  hasDescription: boolean;
  hasCount: boolean;
  count: FieldCountValue | null;
  setHasError: (present: boolean) => void;
  setHasDescription: (present: boolean) => void;
  setHasCount: (present: boolean) => void;
  setCount: (count: FieldCountValue | null) => void;
}

const FieldContext = React.createContext<FieldContextValue | null>(null);

function useFieldContext(part: string): FieldContextValue {
  const ctx = React.useContext(FieldContext);
  if (!ctx) {
    throw new Error(`${part} must be used within a <FieldGroup>`);
  }
  return ctx;
}

export interface FieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
}

export const FieldGroup = React.forwardRef<HTMLDivElement, FieldGroupProps>(
  ({ className, id, children, ...props }, ref) => {
    const generatedId = React.useId();
    const base = id ?? generatedId;
    const [hasError, setHasError] = React.useState(false);
    const [hasDescription, setHasDescription] = React.useState(false);
    const [hasCount, setHasCount] = React.useState(false);
    const [count, setCount] = React.useState<FieldCountValue | null>(null);

    const value = React.useMemo<FieldContextValue>(
      () => ({
        controlId: base,
        descriptionId: `${base}-description`,
        errorId: `${base}-error`,
        invalid: hasError,
        hasDescription,
        hasCount,
        count,
        setHasError,
        setHasDescription,
        setHasCount,
        setCount,
      }),
      [base, hasError, hasDescription, hasCount, count],
    );

    return (
      <FieldContext.Provider value={value}>
        <div
          ref={ref}
          data-invalid={hasError ? "" : undefined}
          className={cn("flex flex-col gap-2", className)}
          {...props}
        >
          {children}
        </div>
      </FieldContext.Provider>
    );
  },
);
FieldGroup.displayName = "FieldGroup";

export type FieldLabelProps = LabelProps;

export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ htmlFor, ...props }, ref) => {
    const { controlId } = useFieldContext("FieldLabel");
    return <Label ref={ref} htmlFor={htmlFor ?? controlId} {...props} />;
  },
);
FieldLabel.displayName = "FieldLabel";

export interface FieldControlProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement;
}

export const FieldControl = React.forwardRef<HTMLDivElement, FieldControlProps>(
  ({ className, children, ...props }, ref) => {
    const {
      controlId,
      descriptionId,
      errorId,
      invalid,
      hasDescription,
      hasCount,
      setCount,
    } = useFieldContext("FieldControl");

    type ControlProps = {
      id?: string;
      "aria-describedby"?: string;
      "aria-invalid"?: React.AriaAttributes["aria-invalid"];
      value?: string | number | readonly string[];
      defaultValue?: string | number | readonly string[];
      maxLength?: number;
      onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    };
    const child = React.Children.only(
      children,
    ) as React.ReactElement<ControlProps>;
    const childProps: ControlProps = child.props;

    const describedBy = [
      childProps["aria-describedby"],
      hasDescription ? descriptionId : null,
      invalid ? errorId : null,
    ]
      .filter(Boolean)
      .join(" ");

    const controlled = childProps.value !== undefined;
    const [typedLength, setTypedLength] = React.useState<number | null>(null);
    const length = controlled
      ? String(childProps.value).length
      : (typedLength ?? String(childProps.defaultValue ?? "").length);
    const max = childProps.maxLength;

    React.useEffect(() => {
      if (!hasCount) return;
      setCount({ length, max });
      return () => setCount(null);
    }, [hasCount, length, max, setCount]);

    const countProps =
      hasCount && !controlled
        ? {
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              childProps.onChange?.(event);
              setTypedLength(event.target.value.length);
            },
          }
        : {};

    return (
      <div ref={ref} className={cn(className)} {...props}>
        {React.cloneElement(child, {
          id: childProps.id ?? controlId,
          "aria-describedby": describedBy || undefined,
          "aria-invalid": childProps["aria-invalid"] ?? (invalid || undefined),
          ...countProps,
        })}
      </div>
    );
  },
);
FieldControl.displayName = "FieldControl";

export type FieldDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  FieldDescriptionProps
>(({ className, ...props }, ref) => {
  const { descriptionId, setHasDescription, invalid } =
    useFieldContext("FieldDescription");

  React.useEffect(() => {
    if (invalid) return;
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription, invalid]);

  if (invalid) return null;

  return (
    <p
      ref={ref}
      id={descriptionId}
      className={cn(
        "font-mono text-[11px] leading-relaxed text-muted text-pretty",
        className,
      )}
      {...props}
    />
  );
});
FieldDescription.displayName = "FieldDescription";

export type FieldCountProps = React.HTMLAttributes<HTMLParagraphElement>;

export const FieldCount = React.forwardRef<
  HTMLParagraphElement,
  FieldCountProps
>(({ className, children, ...props }, ref) => {
  const { count, setHasCount } = useFieldContext("FieldCount");

  React.useEffect(() => {
    setHasCount(true);
    return () => setHasCount(false);
  }, [setHasCount]);

  const length = count?.length ?? 0;
  const max = count?.max;
  const over = max !== undefined && length > max;

  return (
    <p
      ref={ref}
      className={cn(
        "self-end font-mono text-[11px] leading-relaxed tabular-nums",
        over ? "text-danger" : "text-muted",
        className,
      )}
      {...props}
    >
      {children ?? (max === undefined ? `${length}` : `${length} / ${max}`)}
    </p>
  );
});
FieldCount.displayName = "FieldCount";

export type FieldErrorProps = React.HTMLAttributes<HTMLParagraphElement>;

export const FieldError = React.forwardRef<
  HTMLParagraphElement,
  FieldErrorProps
>(({ className, children, ...props }, ref) => {
  const { errorId, setHasError } = useFieldContext("FieldError");

  React.useEffect(() => {
    setHasError(true);
    return () => setHasError(false);
  }, [setHasError]);

  return (
    <p
      ref={ref}
      id={errorId}
      role="alert"
      className={cn(
        "font-mono text-[11px] leading-relaxed text-danger text-pretty",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
});

FieldError.displayName = "FieldError";
