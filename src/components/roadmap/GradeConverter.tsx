import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";

function label(grade: number) {
  if (grade <= 1.5) return "sehr gut (çok iyi)";
  if (grade <= 2.5) return "gut (iyi)";
  if (grade <= 3.5) return "befriedigend (orta)";
  if (grade <= 4.0) return "ausreichend (yeterli)";
  return "nicht ausreichend (yetersiz)";
}

export function GradeConverter() {
  const [avg, setAvg] = useState("75");
  const [nmax, setNmax] = useState("100");
  const [nmin, setNmin] = useState("45");

  const result = useMemo(() => {
    const nd = parseFloat(avg.replace(",", "."));
    const max = parseFloat(nmax.replace(",", "."));
    const min = parseFloat(nmin.replace(",", "."));
    if (![nd, max, min].every((n) => Number.isFinite(n)) || max <= min) return null;
    const raw = 1 + (3 * (max - nd)) / (max - min);
    return Math.min(Math.max(raw, 1), 5);
  }, [avg, nmax, nmin]);

  return (
    <div>
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Calculator className="size-4 text-primary" /> Bavyera formülüyle not çevirici
      </p>
      <p className="mt-1 text-[0.8rem] leading-relaxed text-muted-foreground">
        Türk lise ortalamanı (100'lük sistem) Alman notlandırma sistemine (1,0–5,0) çevirir. Çoğu
        üniversite ve uni-assist bu formülü kullanır.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <label className="block">
          <span className="block font-mono text-[0.65rem] tracking-wide text-muted-foreground">
            SENİN ORTALAMAN
          </span>
          <input
            type="number"
            inputMode="decimal"
            value={avg}
            onChange={(e) => setAvg(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-background px-2.5 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </label>
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
            Geçerli değerler gir (en yüksek not, geçme notundan büyük olmalı).
          </p>
        )}
      </div>

      <p className="mt-3 text-[0.72rem] leading-relaxed text-muted-foreground">
        Sonuç tahminîdir; bazı üniversiteler farklı geçme notu (Nmin) kullanabilir — kabul öncesi
        hedef üniversitenin veya uni-assist'in güncel değerini doğrula.
      </p>
    </div>
  );
}
