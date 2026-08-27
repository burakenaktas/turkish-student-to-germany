import { useEffect, useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { cn } from "@/lib/utils";

function label(grade: number) {
  if (grade <= 1.5) return "sehr gut (çok iyi)";
  if (grade <= 2.5) return "gut (iyi)";
  if (grade <= 3.5) return "befriedigend (orta)";
  if (grade <= 4.0) return "ausreichend (yeterli)";
  return "nicht ausreichend (yetersiz)";
}

/** Locks Nmax/Nmin to a known scale so the visitor only enters their own score. */
export type GradePreset = {
  nmax: number;
  nmin: number;
  scoreLabel: string;
  title: string;
  description: string;
};

type Props = { onResult?: (grade: number | null) => void; preset?: GradePreset };

export function GradeConverter({ onResult, preset }: Props) {
  const [avg, setAvg] = useState(preset ? "" : "75");
  const [nmax, setNmax] = useState(preset ? String(preset.nmax) : "100");
  const [nmin, setNmin] = useState(preset ? String(preset.nmin) : "45");

  const result = useMemo(() => {
    const nd = parseFloat(avg.replace(",", "."));
    const max = parseFloat(nmax.replace(",", "."));
    const min = parseFloat(nmin.replace(",", "."));
    if (![nd, max, min].every((n) => Number.isFinite(n)) || max <= min) return null;
    const raw = 1 + (3 * (max - nd)) / (max - min);
    return Math.min(Math.max(raw, 1), 5);
  }, [avg, nmax, nmin]);

  useEffect(() => {
    onResult?.(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  return (
    <div>
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Calculator className="size-4 text-primary" />
        {preset ? preset.title : "Bavyera formülüyle not çevirici"}
      </p>
      <p className="mt-1 text-[0.8rem] leading-relaxed text-muted-foreground">
        {preset
          ? preset.description
          : "Türk lise ortalamanı (100'lük sistem) Alman notlandırma sistemine (1,0–5,0) çevirir. Çoğu üniversite ve uni-assist bu formülü kullanır."}
      </p>

      <div className={cn("mt-4 grid gap-3", preset ? "grid-cols-1" : "grid-cols-3")}>
        <label className="block">
          <span className="block font-mono text-[0.65rem] tracking-wide text-muted-foreground">
            {preset ? preset.scoreLabel : "SENİN ORTALAMAN"}
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={avg}
            onChange={(e) => setAvg(e.target.value)}
            placeholder={preset ? "Örn. 420" : undefined}
            className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </label>
        {!preset && (
          <>
            <label className="block">
              <span className="block font-mono text-[0.65rem] tracking-wide text-muted-foreground">
                EN YÜKSEK NOT
              </span>
              <input
                type="number"
                inputMode="decimal"
                value={nmax}
                onChange={(e) => setNmax(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </label>
            <label className="block">
              <span className="block font-mono text-[0.65rem] tracking-wide text-muted-foreground">
                GEÇME NOTU
              </span>
              <input
                type="number"
                inputMode="decimal"
                value={nmin}
                onChange={(e) => setNmin(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </label>
          </>
        )}
      </div>

      <div className="boarding-card mt-4 rounded-md p-4">
        {result !== null ? (
          <>
            <p className="font-heading text-2xl font-bold tabular-nums text-foreground">
              {result.toFixed(1).replace(".", ",")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{label(result)}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            {preset
              ? "Yerleştirme puanını gir."
              : "Geçerli değerler gir (en yüksek not, geçme notundan büyük olmalı)."}
          </p>
        )}
      </div>

      <p className="mt-3 text-[0.72rem] leading-relaxed text-muted-foreground">
        {preset ? (
          <>
            Nmax {preset.nmax} / Nmin {preset.nmin} standart YKS puan skalasıdır. Sonuç tahminîdir;
            hedef üniversitenin veya uni-assist'in güncel değerini doğrula.
          </>
        ) : (
          <>
            Sonuç tahminîdir; bazı üniversiteler farklı geçme notu (Nmin) kullanabilir — kabul
            öncesi hedef üniversitenin veya uni-assist'in güncel değerini doğrula.
          </>
        )}
      </p>
    </div>
  );
}
