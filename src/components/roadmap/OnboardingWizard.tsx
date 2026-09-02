import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Lightbulb,
  PartyPopper,
  RotateCcw,
  TrendingDown,
} from "lucide-react";
import { allSteps } from "@/data/roadmap";
import { stepPaths } from "@/data/roadmap-paths";
import {
  costLabelFor,
  costSavingTips,
  eur,
  formatRange,
  personalizedStepCosts,
  personalizedTotal,
  totalEstimatedCost,
} from "@/data/roadmap-extras";
import { usePathAnswers } from "@/hooks/use-path-answers";
import { useProfile } from "@/hooks/use-profile";
import { useAnimatedRange } from "@/hooks/use-animated-range";
import { resolvePath } from "@/lib/path-resolver";
import { PathResultCard } from "@/components/roadmap/PathResultCard";
import { ProfileStep } from "@/components/roadmap/ProfileStep";
import { cn } from "@/lib/utils";

/** Roadmap steps that have a "yol testi", in roadmap order. */
const quizStepIds = allSteps.map((s) => s.id).filter((id) => stepPaths[id]);

/** Steps whose "yol testi" answer actually narrows the cost estimate. */
const costedStepIds = new Set(["s2", "s7", "s11", "s15"]);

type Props = { onFinished?: () => void; onProfileDone?: () => void };

export function OnboardingWizard({ onFinished, onProfileDone }: Props) {
  const { answers, hydrated, setChoices, resetAll } = usePathAnswers();
  const { hasProfile } = useProfile();
  const [profileDone, setProfileDone] = useState(hasProfile);
  const [cursor, setCursor] = useState(0);

  const activeStepId = quizStepIds[Math.min(cursor, quizStepIds.length - 1)];
  const step = allSteps.find((s) => s.id === activeStepId);
  const root = activeStepId ? stepPaths[activeStepId] : undefined;

  const resolved = useMemo(() => {
    if (!root) return undefined;
    return resolvePath(root, answers[activeStepId!] ?? []);
  }, [root, answers, activeStepId]);

  if (!profileDone) {
    return (
      <ProfileStep
        onDone={() => {
          setProfileDone(true);
          onProfileDone?.();
        }}
      />
    );
  }

  if (!hydrated || !root || !step) return null;

  const doneCount = quizStepIds.filter(
    (id) => resolvePath(stepPaths[id]!, answers[id] ?? []).result,
  ).length;
  const allAnswered = doneCount === quizStepIds.length;
  const isLastQuestion = cursor === quizStepIds.length - 1;
  const choices = answers[activeStepId!] ?? [];
  const isCostedStep = costedStepIds.has(activeStepId!);

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

  const currentStepCostLabel =
    isCostedStep && resolved?.result
      ? costLabelFor(personalizedStepCosts(answers)[activeStepId!] ?? [])
      : null;

  const showCompletion = allAnswered && isLastQuestion;

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
          <Compass className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[0.68rem] tracking-wide text-muted-foreground">
            ROTA TESTİ · {Math.min(cursor + 1, quizStepIds.length)}/{quizStepIds.length}
          </p>
          <p className="truncate text-sm font-semibold text-foreground">
            {showCompletion ? "Tamamlandı" : `Adım ${step.no} · ${step.title}`}
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

      {showCompletion ? (
        <CompletionScreen answers={answers} onFinished={onFinished} onResetAll={resetAll} />
      ) : (
        <>
          <div className="mt-6">
            {resolved?.result ? (
              <PathResultCard result={resolved.result} costLabel={currentStepCostLabel} />
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
            </div>
          </div>

          {!allAnswered && doneCount > 0 && (
            <p className="mt-4 text-[0.72rem] leading-relaxed text-muted-foreground">
              {doneCount}/{quizStepIds.length} soru yanıtlandı. Cevapların ilgili adımlarda otomatik
              işaretlenir; sonuçlar tahminîdir.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function CompletionScreen({
  answers,
  onFinished,
  onResetAll,
}: {
  answers: Record<string, number[]>;
  onFinished?: (() => void) | undefined;
  onResetAll: () => void;
}) {
  const tips = useMemo(() => costSavingTips.slice(0, 3), []);

  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/8 px-4 py-3.5">
        <span className="landed-badge grid size-9 shrink-0 place-items-center rounded-full">
          <PartyPopper className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="font-heading text-sm font-semibold text-foreground">
            Tüm sorular tamamlandı!
          </p>
          <p className="mt-0.5 text-[0.8rem] leading-relaxed text-muted-foreground">
            Cevapların rotana işlendi; sana özel tahmini ücret aşağıda.
          </p>
        </div>
      </div>

      <AnimatedCostCompare answers={answers} />

      <div className="mt-5 rounded-lg border border-border bg-secondary/40 p-4">
        <p className="flex items-center gap-1.5 font-mono text-[0.68rem] tracking-wide text-muted-foreground">
          <Lightbulb className="size-3.5 text-primary" /> ÜCRETİ AZALTMAK İÇİN ÖNERİLER
        </p>
        <ul className="mt-3 space-y-3">
          {tips.map((tip) => (
            <li key={tip.title}>
              <p className="text-sm font-semibold text-foreground">{tip.title}</p>
              <p className="mt-0.5 text-[0.8rem] leading-relaxed text-muted-foreground">
                {tip.text}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
        <button
          type="button"
          onClick={onResetAll}
          className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-[0.7rem] text-muted-foreground transition-colors hover:text-destructive"
        >
          <RotateCcw className="size-3.5" /> Tümünü sıfırla
        </button>
        <button
          type="button"
          onClick={onFinished}
          className="gate-badge cursor-pointer rounded-md px-3.5 py-2 font-mono text-[0.7rem] font-semibold"
        >
          Rotamı Takip Etmeye Başla <ArrowRight className="ml-1 inline size-3.5" />
        </button>
      </div>
      <p className="mt-3 text-center text-[0.72rem] leading-relaxed text-muted-foreground">
        Aşağıda rotanı takip etmeye şimdi başlayabilirsin.
      </p>
    </div>
  );
}

function AnimatedCostCompare({ answers }: { answers: Record<string, number[]> }) {
  const target = personalizedTotal(answers);
  const display = useAnimatedRange({ min: target.min, max: target.max });
  const saved = Math.max(0, totalEstimatedCost.max - target.max);
  const savedPct =
    totalEstimatedCost.max > 0
      ? Math.min(100, Math.round((saved / totalEstimatedCost.max) * 100))
      : 0;

  return (
    <div className="mt-5 rounded-lg border border-money/30 bg-money/5 p-4">
      <p className="flex items-center gap-1.5 font-mono text-[0.68rem] tracking-wide text-muted-foreground">
        <TrendingDown className="size-3.5 text-money" /> SANA ÖZEL TAHMİNİ ÜCRET
      </p>
      <p className="mt-1 font-mono text-[0.72rem] text-muted-foreground line-through decoration-muted-foreground/50">
        Genel tahmin: {formatRange(totalEstimatedCost)}
      </p>
      <p className="mt-1 font-heading text-2xl font-bold tabular-nums text-money">
        {formatRange({ min: Math.round(display.min), max: Math.round(display.max) })}
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-money transition-[width] duration-700 ease-out"
          style={{ width: `${100 - savedPct}%` }}
        />
      </div>
      {saved > 0 && (
        <p className="mt-2 text-[0.78rem] leading-relaxed text-muted-foreground">
          Cevapların sayesinde genel tahminden yaklaşık{" "}
          <span className="font-semibold text-money">{eur.format(saved)} €</span> daha ucuz bir rota
          çıktı.
        </p>
      )}
    </div>
  );
}
