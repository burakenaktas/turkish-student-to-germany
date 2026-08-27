import { useCallback, useEffect, useState } from "react";

const KEY = "almanya-roadmap-notebook-v1";

export type TodoItem = { id: string; text: string; done: boolean };
type NotebookData = { todos: TodoItem[]; note: string };

const empty: NotebookData = { todos: [], note: "" };

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Kullanıcının kendi checklist'i ve serbest notu — sadece bu cihazda saklanır. */
export function useNotebook() {
  const [data, setData] = useState<NotebookData>(empty);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setData(JSON.parse(raw) as NotebookData);
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* ignore quota errors */
    }
  }, [data, hydrated]);

  const addTodo = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setData((prev) => ({
      ...prev,
      todos: [...prev.todos, { id: makeId(), text: trimmed, done: false }],
    }));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      todos: prev.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  }, []);

  const removeTodo = useCallback((id: string) => {
    setData((prev) => ({ ...prev, todos: prev.todos.filter((t) => t.id !== id) }));
  }, []);

  const setNote = useCallback((note: string) => {
    setData((prev) => ({ ...prev, note }));
  }, []);

  return {
    todos: data.todos,
    note: data.note,
    hydrated,
    addTodo,
    toggleTodo,
    removeTodo,
    setNote,
  };
}
