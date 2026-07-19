"use client";
import * as React from "react";
import { cn } from "../../cn.js";
import { Label, type LabelProps } from "../../primitives/label/label.js";

interface FieldContextValue {
  controlId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  hasDescription: boolean;
  setHasError: (present: boolean) => void;
  setHasDescription: (present: boolean) => void;
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

    const value = React.useMemo<FieldContextValue>(
      () => ({
        controlId: base,
        descriptionId: `${base}-description`,
        errorId: `${base}-error`,
        invalid: hasError,
        hasDescription,
        setHasError,
        setHasDescription,
      }),
      [base, hasError, hasDescription],
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
    const { controlId, descriptionId, errorId, invalid, hasDescription } =
      useFieldContext("FieldControl");

    type ControlProps = {
      id?: string;
      "aria-describedby"?: string;
      "aria-invalid"?: React.AriaAttributes["aria-invalid"];
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

    return (
      <div ref={ref} className={cn(className)} {...props}>
        {React.cloneElement(child, {
          id: childProps.id ?? controlId,
          "aria-describedby": describedBy || undefined,
          "aria-invalid": childProps["aria-invalid"] ?? (invalid || undefined),
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
