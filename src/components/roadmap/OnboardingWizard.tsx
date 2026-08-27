import { useMemo, useState } from "react";
import { ArrowLeft, Check, Compass, RotateCcw } from "lucide-react";
import { allSteps } from "@/data/roadmap";
import { stepPaths } from "@/data/roadmap-paths";
import { usePathAnswers } from "@/hooks/use-path-answers";
import { resolvePath } from "@/lib/path-resolver";
import { cn } from "@/lib/utils";

/** Roadmap steps that have a "yol testi", in roadmap order. */
const quizStepIds = allSteps.map((s) => s.id).filter((id) => stepPaths[id]);

type Props = { onFinished?: () => void };

export function OnboardingWizard({ onFinished }: Props) {
  const { answers, hydrated, setChoices, resetAll } = usePathAnswers();
  const [cursor, setCursor] = useState(0);

  const activeStepId = quizStepIds[Math.min(cursor, quizStepIds.length - 1)];
  const step = allSteps.find((s) => s.id === activeStepId);
  const root = activeStepId ? stepPaths[activeStepId] : undefined;

  const resolved = useMemo(() => {
    if (!root) return undefined;
    return resolvePath(root, answers[activeStepId!] ?? []);
  }, [root, answers, activeStepId]);

  if (!hydrated || !root || !step) return null;

  const doneCount = quizStepIds.filter(
    (id) => resolvePath(stepPaths[id]!, answers[id] ?? []).result,
  ).length;
  const isLastQuestion = cursor === quizStepIds.length - 1;
  const choices = answers[activeStepId!] ?? [];

  function choose(optionIndex: number) {
    const next = [...choices, optionIndex];
    setChoices(activeStepId!, next);
    const stillOpen = !resolvePath(root!, next).result;
    if (!stillOpen && !isLastQuestion) {
      setCursor((c) => c + 1);
    }
  }

  function goBack() {
    if (choices.length > 0) {
      setChoices(activeStepId!, choices.slice(0, -1));
    } else if (cursor > 0) {
      setCursor((c) => c - 1);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
          <Compass className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[0.68rem] tracking-wide text-muted-foreground">
            HIZLI TEST · {Math.min(cursor + 1, quizStepIds.length)}/{quizStepIds.length}
          </p>
          <p className="truncate text-sm font-semibold text-foreground">
            Adım {step.no} · {step.title}
          </p>
        </div>
      </div>

      <div className="mt-3 flex gap-1.5">
        {quizStepIds.map((id, i) => {
          const answered = resolvePath(stepPaths[id]!, answers[id] ?? []).result != null;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setCursor(i)}
              title={allSteps.find((s) => s.id === id)?.title}
              className={cn(
                "h-1.5 flex-1 cursor-pointer rounded-full transition-colors",
                answered ? "gate-badge" : i === cursor ? "bg-primary/40" : "bg-secondary",
              )}
            />
          );
        })}
      </div>

      <div className="mt-6">
        {resolved?.result ? (
          <div className="boarding-card rounded-md p-4">
            <p className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
              <span className="landed-badge grid size-5 shrink-0 place-items-center rounded-full">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {resolved.result.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {resolved.result.text}
            </p>
          </div>
        ) : resolved?.current ? (
          <div>
            <p className="text-sm font-semibold text-foreground">{resolved.current.question}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {resolved.current.options.map((opt, i) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => choose(i)}
                  className="cursor-pointer rounded-md border border-border px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-accent"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
        <button
          type="button"
          onClick={goBack}
          disabled={cursor === 0 && choices.length === 0}
          className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-[0.7rem] text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="size-3.5" /> Geri
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-[0.7rem] text-muted-foreground transition-colors hover:text-destructive"
          >
            <RotateCcw className="size-3.5" /> Tümünü sıfırla
          </button>
          {!isLastQuestion && resolved?.result && (
            <button
              type="button"
              onClick={() => setCursor((c) => c + 1)}
              className="gate-badge cursor-pointer rounded-md px-3.5 py-2 font-mono text-[0.7rem] font-semibold"
            >
              Sıradaki soru
            </button>
          )}
          {isLastQuestion && resolved?.result && (
            <button
              type="button"
              onClick={onFinished}
              className="gate-badge cursor-pointer rounded-md px-3.5 py-2 font-mono text-[0.7rem] font-semibold"
            >
              Rotamı göster
            </button>
          )}
        </div>
      </div>

      {doneCount > 0 && (
        <p className="mt-4 text-[0.72rem] leading-relaxed text-muted-foreground">
          {doneCount}/{quizStepIds.length} soru yanıtlandı. Cevapların ilgili adımlarda otomatik
          işaretlenir; sonuçlar tahminîdir.
        </p>
      )}
    </div>
  );
}
