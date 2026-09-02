import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, GraduationCap, Mail, UserRound } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = { onDone: () => void };

const YKS_NMAX = 560;
const YKS_NMIN = 180;

function computeGrade(score: number): number | null {
  if (!Number.isFinite(score)) return null;
  const raw = 1 + (3 * (YKS_NMAX - score)) / (YKS_NMAX - YKS_NMIN);
  return Math.min(Math.max(raw, 1), 5);
}

const totalSteps = 3;

export function ProfileStep({ onDone }: Props) {
  const { profile, setProfile } = useProfile();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState(profile.email);
  const [name, setName] = useState(profile.name);
  const [score, setScore] = useState("");

  const grade = computeGrade(parseFloat(score.replace(",", ".")));

  function save(next: Partial<{ email: string; name: string; gpa: string }>) {
    setProfile({
      email: next.email ?? email,
      name: next.name ?? name,
      gpa: next.gpa ?? profile.gpa,
    });
  }

  function next() {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
      return;
    }
    save({ gpa: grade !== null ? grade.toFixed(1).replace(".", ",") : "" });
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
              <Mail className="size-4 text-primary" /> E-postanı gir
            </p>
            <p className="mt-1 text-[0.8rem] leading-relaxed text-muted-foreground">
              Sadece bu cihazda saklanır, hiçbir yere gönderilmez.
            </p>
            <Input
              type="email"
              autoFocus
              className="mt-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && next()}
              placeholder="ornek@eposta.com"
            />
          </div>
        )}

        {step === 1 && (
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

        {step === 2 && (
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
                NC karşılığın:{" "}
                <span className="font-semibold">{grade.toFixed(1).replace(".", ",")}</span>
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
