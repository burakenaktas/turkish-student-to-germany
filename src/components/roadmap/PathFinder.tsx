import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { stepPaths, type PathOption, type PathQuestion } from "@/data/roadmap-paths";
import { cn } from "@/lib/utils";

const KEY = "almanya-roadmap-pathfinder-v1";

function readStore(): Record<string, number[]> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, number[]>) : {};
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, number[]>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* ignore quota errors */
  }
}

type Props = { stepId: string };

export function PathFinder({ stepId }: Props) {
  const root = stepPaths[stepId];
  const [choices, setChoices] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setChoices(readStore()[stepId] ?? []);
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId]);

  if (!root) return null;

  function commit(next: number[]) {
    setChoices(next);
    const store = readStore();
    if (next.length === 0) delete store[stepId];
    else store[stepId] = next;
    writeStore(store);
  }

  // walk the tree with the current choices, collecting the answered
  // question + chosen option label at each level for the breadcrumb
  const trail: { question: string; label: string }[] = [];
  let node: PathQuestion | undefined = root;
  let result: PathOption["result"];

  for (const idx of choices) {
    if (!node) break;
    const opt: PathOption | undefined = node.options[idx];
    if (!opt) break;
    trail.push({ question: node.question, label: opt.label });
    if (opt.result) {
      result = opt.result;
      node = undefined;
      break;
    }
    node = opt.next;
  }

  const current = result ? undefined : node;

  if (!hydrated) return null;

  return (
    <div>
      {trail.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          {trail.map((t, i) => (
            <button
              key={i}
              type="button"
              title={t.question}
              onClick={() => commit(choices.slice(0, i))}
              className="cursor-pointer rounded-full border border-border bg-secondary/60 px-2.5 py-1 font-mono text-[0.65rem] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {t.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => commit([])}
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
                onClick={() => commit([...choices, i])}
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
