import { Check, RotateCcw } from "lucide-react";
import { stepPaths } from "@/data/roadmap-paths";
import { usePathAnswers } from "@/hooks/use-path-answers";
import { resolvePath } from "@/lib/path-resolver";
import { cn } from "@/lib/utils";

type Props = { stepId: string };

export function PathFinder({ stepId }: Props) {
  const root = stepPaths[stepId];
  const { answers, hydrated, setChoices } = usePathAnswers();

  if (!root || !hydrated) return null;

  const choices = answers[stepId] ?? [];
  const { trail, current, result } = resolvePath(root, choices);

  return (
    <div>
      {trail.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          {trail.map((t, i) => (
            <button
              key={i}
              type="button"
              title={t.question}
              onClick={() => setChoices(stepId, choices.slice(0, i))}
              className="cursor-pointer rounded-full border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[0.65rem] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setChoices(stepId, [])}
            className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[0.65rem] text-muted-foreground transition-colors hover:text-destructive"
          >
            <RotateCcw className="size-3" /> Baştan başla
          </button>
        </div>
      )}

      {result ? (
        <div className="boarding-card rounded-md p-4">
          <p className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
            <span className="landed-badge grid size-5 shrink-0 place-items-center rounded-full">
              <Check className="size-3" strokeWidth={3} />
            </span>
            {result.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{result.text}</p>
        </div>
      ) : current ? (
        <div>
          <p className="text-sm font-semibold text-foreground">{current.question}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {current.options.map((opt, i) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setChoices(stepId, [...choices, i])}
                className={cn(
                  "cursor-pointer rounded-md border border-border px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-accent",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-[0.72rem] leading-relaxed text-muted-foreground">
        Sonuçlar tahminîdir; kesin denklik ve şartlar için üniversite ve Ausländerbehörde
        duyurularını esas al.
      </p>
    </div>
  );
}
