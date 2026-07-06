"use client";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";
import { cn } from "../../cn.js";

export interface FeatureCard {
  title: string;
  body?: React.ReactNode;
  id?: string;
}

export interface FeatureCarouselProps
  extends React.HTMLAttributes<HTMLDivElement> {
  cards: FeatureCard[];
  /** Auto-advance interval in ms. Defaults to 4600. */
  autoAdvanceMs?: number;
}

export const FeatureCarousel = React.forwardRef<
  HTMLDivElement,
  FeatureCarouselProps
>(({ cards, autoAdvanceMs = 4600, className, ...props }, ref) => {
  const reduce = useReducedMotion() ?? false;
  const [index, setIndex] = React.useState(0);
  const active = cards[index];

  const advance = React.useCallback(() => {
    if (cards.length < 2) return;
    setIndex((i) => (i + 1) % cards.length);
  }, [cards.length]);

  if (!active) return null;

  return (
    <div ref={ref} className={cn("group grid gap-4", className)} {...props}>
      <motion.article
        key={active.id ?? active.title}
        initial={{ opacity: reduce ? 1 : 0.7, y: reduce ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0.01 : 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="wash-accent rim-light relative flex h-[clamp(18rem,28vw,22rem)] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-surface p-[clamp(1.5rem,3vw,2.25rem)] shadow-floating"
      >
        <span className="absolute top-[clamp(1.5rem,3vw,2.25rem)] left-[clamp(1.5rem,3vw,2.25rem)] font-mono text-sm font-bold tracking-[0.12em] text-accent-alt">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="relative max-w-[24rem] text-balance text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.05] text-ink">
          {active.title}
        </h3>
        {active.body != null && (
          <p className="relative mt-4 max-w-prose text-pretty leading-relaxed text-muted">
            {active.body}
          </p>
        )}
      </motion.article>

      <div className="grid grid-cols-2 gap-2">
        {cards.map((card, i) => {
          const isActive = i === index;
          return (
            <motion.button
              key={card.id ?? card.title}
              type="button"
              aria-label={`Show ${card.title}`}
              aria-current={isActive}
              onClick={() => setIndex(i)}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              className={cn(
                "relative grid min-h-[3.1rem] grid-cols-[auto_minmax(0,1fr)] items-center gap-2.5 overflow-hidden rounded-lg border px-3.5 py-3 text-left outline-none",
                "transition-tint duration-fast ease-soft focus-visible:ring-focus",
                isActive
                  ? "border-accent-alt/30 bg-accent-alt/8 text-ink"
                  : "border-border bg-surface text-muted hover:border-border-strong hover:text-ink",
              )}
            >
              {isActive && cards.length > 1 && !reduce && (
                <span
                  key={index}
                  aria-hidden="true"
                  onAnimationEnd={advance}
                  style={
                    {
                      "--usva-progress-duration": `${autoAdvanceMs}ms`,
                    } as React.CSSProperties
                  }
                  className="absolute inset-x-0 bottom-0 h-px bg-accent-alt glow-accent animate-progress-fill group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
                />
              )}
              <span className="font-mono text-xs font-bold tracking-[0.08em] text-accent-alt/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <strong className="truncate text-sm font-semibold">
                {card.title}
              </strong>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});
FeatureCarousel.displayName = "FeatureCarousel";
