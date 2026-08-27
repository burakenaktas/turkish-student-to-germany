import { useCallback, useEffect, useState } from "react";

const KEY = "almanya-roadmap-progress-v1";

export function useProgress() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setDone(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(done));
    } catch {
      /* ignore quota errors */
    }
  }, [done, hydrated]);

  const toggle = useCallback((id: string) => {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const setMany = useCallback((ids: string[], value: boolean) => {
    setDone((prev) => {
      const next = { ...prev };
      for (const id of ids) next[id] = value;
      return next;
    });
  }, []);

  const reset = useCallback(() => setDone({}), []);

  return { done, hydrated, toggle, setMany, reset };
}
