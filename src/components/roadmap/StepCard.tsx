import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Calculator,
  Check,
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
  Info,
  Route,
  Wallet,
} from "lucide-react";
import type { Step } from "@/data/roadmap";
import {
  costLabelFor,
  personalizedStepCosts,
  stepChecklists,
  stepComparisons,
  stepDocs,
} from "@/data/roadmap-extras";
import { blogPostByTaskId, isPublished } from "@/data/blog-posts";
import { stepPaths, pathTaskId, gradeConverterTaskId } from "@/data/roadmap-paths";
import { stepImages } from "@/data/step-images";
import { PathFinder } from "@/components/roadmap/PathFinder";
import { GradeConverter } from "@/components/roadmap/GradeConverter";
import { ChecklistBlock } from "@/components/roadmap/ChecklistBlock";
import { ComparisonList } from "@/components/roadmap/ComparisonList";
import { usePathAnswers } from "@/hooks/use-path-answers";
import { resolvePath } from "@/lib/path-resolver";
import { cn } from "@/lib/utils";

type Props = {
  step: Step;
  done: Record<string, boolean>;
  onToggle: (id: string) => void;
  onSetMany: (ids: string[], value: boolean) => void;
};

export function StepCard({ step, done, onToggle, onSetMany }: Props) {
  const total = step.tasks.length;
  const completed = step.tasks.filter((t) => done[t.id]).length;
  const isDone = completed === total;
  const [open, setOpen] = useState(false);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  const docs = stepDocs[step.id] ?? [];
  const photo = stepImages[step.id];

  const { answers } = usePathAnswers();
  const pathRoot = stepPaths[step.id];
  const pathResult = pathRoot ? resolvePath(pathRoot, answers[step.id] ?? []).result : undefined;
  const notApplicable = new Set(pathResult?.notApplicable ?? []);
  const costs = personalizedStepCosts(answers)[step.id] ?? [];
  const costLabel = costLabelFor(costs);
  const checklists = stepChecklists[step.id] ?? [];
  const comparison = stepComparisons[step.id];

  function toolFor(taskId: string): { type: "path" | "grade"; label: string } | null {
    if (pathTaskId[step.id] === taskId && stepPaths[step.id])
      return { type: "path", label: "Yol testi" };
    if (taskId === gradeConverterTaskId) return { type: "grade", label: "Not çevirici" };
    return null;
  }

  return (
    <article
      className={cn(
        "boarding-card overflow-hidden rounded-lg transition-colors",
        isDone && "border-success/45",
      )}
    >
      {photo && (
        <div className="relative h-36 w-full overflow-hidden border-b border-border md:h-44">
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            width={768}
            height={512}
            className={cn(
              "size-full object-cover transition-[filter,opacity] duration-500",
              isDone ? "opacity-70 saturate-50" : "opacity-100",
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/25 to-transparent" />
          <span className="absolute bottom-3 left-3 rounded-md bg-background/85 px-2.5 py-1 font-mono text-[0.7rem] tracking-[0.15em] text-foreground backdrop-blur">
            ADIM {String(step.no).padStart(2, "0")}
          </span>
        </div>
      )}

      <header className="flex items-start gap-4 p-5 sm:p-6">
        <button
          type="button"
          onClick={() =>
            onSetMany(
              step.tasks.map((t) => t.id),
              !isDone,
            )
          }
          aria-label={isDone ? `${step.title} adımını geri al` : `${step.title} adımını tamamla`}
          className={cn(
            "grid size-10 shrink-0 cursor-pointer place-items-center rounded-md font-mono text-sm font-semibold transition-colors",
            isDone
              ? "landed-badge"
              : "border border-border bg-secondary text-secondary-foreground hover:border-primary/50",
          )}
        >
          {isDone ? <Check className="size-5" strokeWidth={3} /> : String(step.no).padStart(2, "0")}
        </button>

        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "font-heading text-base font-semibold md:text-lg",
              isDone ? "text-muted-foreground" : "text-foreground",
            )}
          >
            {step.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.subtitle}</p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
              <Clock className="size-3" />
              {step.duration}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-money/10 px-2.5 py-1 text-xs font-semibold text-money">
              <Wallet className="size-3" />
              {costLabel}
            </span>
            {pathResult && (
              <span className="gold-badge inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold">
                <Route className="size-3" /> {pathResult.title}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="flex items-center gap-3 border-t border-border px-5 py-3 sm:px-6">
        <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full transition-[width] duration-500",
              isDone ? "landed-badge" : "gate-badge",
            )}
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {completed}/{total}
        </span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium tracking-wide text-foreground transition-colors hover:bg-accent"
        >
          DETAY
          <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
        </button>
      </div>

      {open && (
        <div className="space-y-6 border-t border-border px-5 pt-5 pb-6 sm:px-6">
          <div>
            <p className="font-mono text-[0.7rem] tracking-wide text-muted-foreground">
              ARA ADIMLAR ({total})
            </p>
            <ol className="mt-2.5 space-y-1">
              {step.tasks.map((task, i) => {
                const checked = !!done[task.id];
                const tool = toolFor(task.id);
                const toolOpen = expandedTool === task.id;
                const skippable = notApplicable.has(task.id);
                return (
                  <li key={task.id}>
                    <div className="flex items-start gap-2">
                      <label
                        className={cn(
                          "flex flex-1 cursor-pointer items-start gap-3 rounded-md px-2.5 py-2.5 transition-colors hover:bg-secondary/70",
                          skippable && !checked && "opacity-60",
                        )}
                      >
                        <span className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                          {step.no}.{i + 1}
                        </span>
                        <span
                          className={cn(
                            "mt-0.5 grid size-4.5 shrink-0 place-items-center rounded border transition-colors",
                            checked ? "landed-badge border-success" : "border-border bg-background",
                          )}
                        >
                          {checked && <Check className="size-3" strokeWidth={3} />}
                        </span>
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={checked}
                          onChange={() => onToggle(task.id)}
                        />
                        <span className="min-w-0">
                          <span
                            className={cn(
                              "block text-sm leading-snug",
                              checked ? "text-muted-foreground line-through" : "text-foreground",
                            )}
                          >
                            {task.label}
                            {skippable && !checked && (
                              <span className="ml-1.5 text-xs text-muted-foreground italic">
                                (senin için gerekmeyebilir)
                              </span>
                            )}
                          </span>
                          {task.hint && (
                            <span className="mt-0.5 block text-[0.8rem] leading-relaxed text-muted-foreground">
                              {task.hint}
                            </span>
                          )}
                          {(() => {
                            const post = blogPostByTaskId[task.id];
                            if (!post || !isPublished(post)) return null;
                            return (
                              <Link
                                to="/blog/$slug"
                                params={{ slug: post.slug }}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-primary/8 px-2 py-1 text-xs font-medium whitespace-nowrap text-primary transition-colors hover:bg-primary/15"
                              >
                                <BookOpen className="size-3 shrink-0" /> Rehber yazısını oku
                              </Link>
                            );
                          })()}
                        </span>
                      </label>

                      {tool && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setExpandedTool((v) => (v === task.id ? null : task.id));
                          }}
                          className={cn(
                            "gold-badge mt-2 inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap transition-transform",
                            toolOpen && "scale-95",
                          )}
                        >
                          {tool.type === "path" ? (
                            <Route className="size-3" />
                          ) : (
                            <Calculator className="size-3" />
                          )}
                          {tool.label}
                        </button>
                      )}
                    </div>

                    {tool && toolOpen && (
                      <div className="ml-2 mt-1 rounded-md border border-border bg-secondary/40 p-3.5">
                        {tool.type === "path" ? (
                          <PathFinder stepId={step.id} />
                        ) : (
                          <GradeConverter />
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-secondary/40 p-4">
              <p className="font-mono text-[0.7rem] tracking-wide text-muted-foreground">
                EVRAKLAR ({docs.length})
              </p>
              <ul className="mt-3 space-y-3.5">
                {docs.length === 0 && (
                  <li className="text-sm text-muted-foreground">
                    Bu adım için ayrı evrak gerekmiyor.
                  </li>
                )}
                {docs.map((d) => (
                  <li key={d.name} className="flex gap-3">
                    <FileText className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-foreground">{d.name}</p>
                      <p className="mt-0.5 break-words text-[0.85rem] leading-relaxed text-muted-foreground">
                        {d.how}
                      </p>
                      {d.links && d.links.length > 0 && (
                        <p className="mt-1.5 flex flex-wrap gap-2">
                          {d.links.map((link) => (
                            <a
                              key={link.url}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-xs text-primary transition-colors hover:bg-accent"
                            >
                              <ExternalLink className="size-2.5" /> {link.label}
                            </a>
                          ))}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {costs.length > 0 && (
              <div className="rounded-lg bg-money/6 p-4">
                <p className="font-mono text-[0.7rem] tracking-wide text-money">TAHMİNİ ÜCRET</p>
                <ul className="mt-3 space-y-3">
                  {costs.map((c) => (
                    <li key={c.label} className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block text-sm text-foreground">{c.label}</span>
                        {c.note && (
                          <span className="mt-0.5 block text-[0.78rem] leading-relaxed text-muted-foreground">
                            {c.note}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 text-sm font-semibold tabular-nums text-money">
                        {c.amount}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 flex items-start gap-2 border-t border-money/15 pt-3 text-[0.78rem] text-muted-foreground">
                  <Wallet className="mt-0.5 size-3.5 shrink-0 text-money" />
                  Tutarlar tahminîdir; kur ve kurum politikalarına göre değişir.
                </p>
              </div>
            )}
          </div>

          {checklists.map((checklist) => (
            <ChecklistBlock key={checklist.title} checklist={checklist} />
          ))}

          {comparison && <ComparisonList title={comparison.title} rows={comparison.rows} />}

          {step.warning && (
            <p className="flex gap-2 rounded-md border-l-2 border-destructive bg-destructive/6 px-3.5 py-3 text-[0.85rem] leading-relaxed text-foreground">
              <Info className="mt-0.5 size-4 shrink-0 text-destructive" />
              <span>{step.warning}</span>
            </p>
          )}
        </div>
      )}
    </article>
  );
}
