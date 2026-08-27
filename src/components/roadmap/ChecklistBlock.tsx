import { ListChecks } from "lucide-react";
import type { Checklist } from "@/data/roadmap-extras";

type Props = { checklist: Checklist };

export function ChecklistBlock({ checklist }: Props) {
  return (
    <div>
      <p className="flex items-center gap-1.5 font-mono text-[0.7rem] tracking-wide text-muted-foreground">
        <ListChecks className="size-3.5" /> {checklist.title.toUpperCase()}
      </p>
      <ul className="mt-2.5 space-y-1.5 rounded-lg bg-secondary/40 px-4 py-4">
        {checklist.items.map((item) => (
          <li key={item} className="flex gap-2 text-[0.85rem] leading-relaxed text-foreground">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
            {item}
          </li>
        ))}
      </ul>
      {checklist.note && (
        <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
          {checklist.note}
        </p>
      )}
    </div>
  );
}
