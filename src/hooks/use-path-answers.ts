import { useCallback, useSyncExternalStore } from "react";

const KEY = "almanya-roadmap-pathfinder-v1";

type Answers = Record<string, number[]>;

function readStore(): Answers {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Answers) : {};
  } catch {
    return {};
  }
}

let snapshot: Answers | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): Answers {
  if (snapshot === null) snapshot = readStore();
  return snapshot;
}

function getServerSnapshot(): Answers {
  return {};
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function commit(next: Answers) {
  snapshot = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota errors */
  }
  for (const listener of listeners) listener();
}

/** Shared, cross-component localStorage-backed store for "yol testi" answers. */
export function usePathAnswers() {
  const answers = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setChoices = useCallback((stepId: string, choices: number[]) => {
    const next = { ...getSnapshot() };
    if (choices.length === 0) delete next[stepId];
    else next[stepId] = choices;
    commit(next);
  }, []);

  const resetStep = useCallback((stepId: string) => setChoices(stepId, []), [setChoices]);

  const resetAll = useCallback(() => {
    snapshot = {};
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    for (const listener of listeners) listener();
  }, []);

  return { answers, hydrated: true, setChoices, resetStep, resetAll };
}
