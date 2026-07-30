import { cn } from "@usva-ui/react/cn";

/**
 * The usva wordmark, one source. The letters plus the load-bearing period, which
 * is always accent-alt, the paired second voice. Size and weight come from the
 * context; pass a className to place it.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-extrabold leading-[0.86] tracking-tighter",
        className,
      )}
    >
      usva<span className="text-accent-alt">.</span>
    </span>
  );
}
