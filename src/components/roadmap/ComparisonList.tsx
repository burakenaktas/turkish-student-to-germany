import { Scale } from "lucide-react";
import type { ComparisonRow } from "@/data/roadmap-extras";

type Props = { title: string; rows: ComparisonRow[] };

export function ComparisonList({ title, rows }: Props) {
  return (
    <div>
      <p className="flex items-center gap-1.5 font-mono text-[0.7rem] tracking-wide text-muted-foreground">
        <Scale className="size-3.5" /> {title.toUpperCase()}
      </p>
      <ul className="mt-2.5 overflow-hidden rounded-lg border border-border">
        {rows.map((row) => (
          <li key={row.name} className="border-b border-border bg-card px-4 py-3.5 last:border-0">
            <span className="block text-sm font-semibold text-foreground">{row.name}</span>
            <span className="mt-0.5 block text-[0.85rem] leading-relaxed text-muted-foreground">
              {row.detail}
            </span>
            {row.note && (
              <span className="mt-1 block text-xs font-medium text-money">{row.note}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
