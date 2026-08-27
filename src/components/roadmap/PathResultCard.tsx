import { Check, Minus, Plus, Wallet } from "lucide-react";
import type { PathResult } from "@/data/roadmap-paths";

type Props = { result: PathResult; costLabel?: string | null };

export function PathResultCard({ result, costLabel }: Props) {
  return (
    <div className="boarding-card rounded-md p-4">
      <p className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
        <span className="landed-badge grid size-5 shrink-0 place-items-center rounded-full">
          <Check className="size-3" strokeWidth={3} />
        </span>
        {result.title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Bu cevabın anlamı: {result.text}
      </p>

      {(result.pros?.length || result.cons?.length) && (
        <div className="mt-3 grid gap-3 border-t border-border pt-3 sm:grid-cols-2">
          {!!result.pros?.length && (
            <div>
              <p className="flex items-center gap-1.5 font-mono text-[0.68rem] font-semibold tracking-wide text-success">
                <Plus className="size-3.5" /> KÂR
              </p>
              <ul className="mt-1.5 space-y-1">
                {result.pros.map((p) => (
                  <li key={p} className="text-[0.8rem] leading-snug text-muted-foreground">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!!result.cons?.length && (
            <div>
              <p className="flex items-center gap-1.5 font-mono text-[0.68rem] font-semibold tracking-wide text-destructive">
                <Minus className="size-3.5" /> ZARAR
              </p>
              <ul className="mt-1.5 space-y-1">
                {result.cons.map((c) => (
                  <li key={c} className="text-[0.8rem] leading-snug text-muted-foreground">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {costLabel && (
        <p className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 font-mono text-[0.75rem] font-semibold text-money">
          <Wallet className="size-3.5 shrink-0" /> Bu seçime göre ücret: {costLabel}
        </p>
      )}
    </div>
  );
}
