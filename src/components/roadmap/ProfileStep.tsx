import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, GraduationCap, UserRound } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { computeGermanGrade, formatGrade, YKS_NMAX, YKS_NMIN } from "@/lib/grade";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = { onDone: () => void };

const totalSteps = 2;

export function ProfileStep({ onDone }: Props) {
  const { profile, setProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(profile.name);
  const [score, setScore] = useState(profile.yksScore);

  const grade = computeGermanGrade(parseFloat(score.replace(",", ".")), YKS_NMAX, YKS_NMIN);

  function save(next: Partial<{ name: string; gpa: string; yksScore: string }>) {
    setProfile({
      name: next.name ?? name,
      gpa: next.gpa ?? profile.gpa,
      yksScore: next.yksScore ?? profile.yksScore,
    });
  }

  function next() {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
      return;
    }
    save({ gpa: grade !== null ? formatGrade(grade) : "", yksScore: score });
    onDone();
  }

  function back() {
    if (step === 0) return;
    setStep((s) => s - 1);
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
          <UserRound className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[0.68rem] tracking-wide text-muted-foreground">
            ROTA TESTİ · {step + 1}/{totalSteps}
          </p>
          <p className="truncate text-sm font-semibold text-foreground">Önce seni tanıyalım</p>
        </div>
      </div>

      <div className="mt-3 flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < step ? "gate-badge" : i === step ? "bg-primary/40" : "bg-secondary",
            )}
          />
        ))}
      </div>

      <div key={step} className="step-in mt-6">
        {step === 0 && (
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <UserRound className="size-4 text-primary" /> Adın ne?
            </p>
            <p className="mt-1 text-[0.8rem] leading-relaxed text-muted-foreground">
              Sana nasıl hitap edelim?
            </p>
            <Input
              autoFocus
              className="mt-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && next()}
              placeholder="Örn. Ayşe Yılmaz"
            />
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <GraduationCap className="size-4 text-primary" /> Üniversite yerleştirme puanını yaz
            </p>
            <p className="mt-1 text-[0.8rem] leading-relaxed text-muted-foreground">
              NC'ni (Numerus Clausus karşılığını) biz hesaplayalım.
            </p>
            <Input
              type="number"
              inputMode="decimal"
              autoFocus
              className="mt-3"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && next()}
              placeholder="Örn. 420"
            />
            {grade !== null && score.trim() !== "" && (
              <p className="mt-3 flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2.5 text-sm text-foreground">
                <span className="landed-badge grid size-5 shrink-0 place-items-center rounded-full">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                NC karşılığın: <span className="font-semibold">{formatGrade(grade)}</span>
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
        {step === 0 ? (
          <button
            type="button"
            onClick={onDone}
            className="cursor-pointer font-mono text-[0.7rem] text-muted-foreground transition-colors hover:text-foreground"
          >
            Atla
          </button>
        ) : (
          <button
            type="button"
            onClick={back}
            className="inline-flex cursor-pointer items-center gap-1.5 font-mono text-[0.7rem] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Geri
          </button>
        )}
        <button
          type="button"
          onClick={next}
          className="gate-badge inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3.5 py-2 font-mono text-[0.7rem] font-semibold"
        >
          {step === totalSteps - 1 ? "Bitir" : "Devam et"} <ArrowRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
