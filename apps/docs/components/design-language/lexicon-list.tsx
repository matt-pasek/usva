import { LEXICON, type LexemeGroup } from "@/lib/lexicon";

const GROUPS: { group: LexemeGroup; label: string }[] = [
  { group: "system", label: "the system" },
  { group: "theme", label: "the three registers" },
  { group: "atmosphere", label: "the atmospheres" },
  { group: "material", label: "the fluid material" },
  { group: "motion", label: "the motion" },
];

export function LexiconList() {
  return (
    <div className="flex flex-col gap-8">
      {GROUPS.map(({ group, label }) => {
        const entries = LEXICON.filter((entry) => entry.group === group);
        if (entries.length === 0) return null;
        return (
          <section key={group} className="flex flex-col gap-3">
            <h3 className="font-mono text-[0.7rem] text-muted uppercase tracking-[0.2em]">
              {label}
            </h3>
            <dl className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
              {entries.map((entry) => (
                <div
                  key={entry.word}
                  className="grid gap-1.5 p-5 sm:grid-cols-[9rem_1fr] sm:gap-6"
                >
                  <dt className="flex flex-col gap-0.5">
                    <span className="flex items-baseline gap-2">
                      <span className="font-semibold text-ink text-lg tracking-tight">
                        {entry.word}
                        <span className="text-accent-alt">.</span>
                      </span>
                      <span className="text-muted text-xs">{entry.ipa}</span>
                    </span>
                    <span className="font-mono text-[0.6rem] text-muted uppercase tracking-widest">
                      {entry.labels}
                    </span>
                  </dt>
                  <dd className="flex flex-col gap-2 text-muted text-sm leading-relaxed">
                    <p>
                      <span className="text-ink">{entry.sense}.</span>{" "}
                      {entry.reading}
                    </p>
                    <p className="border-border border-l-2 pl-3 text-muted">
                      {entry.psychology}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        );
      })}
    </div>
  );
}
