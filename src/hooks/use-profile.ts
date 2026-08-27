import { useCallback, useSyncExternalStore } from "react";

const KEY = "almanya-roadmap-profile-v1";

export type Profile = { name: string; email: string; gpa: string };

const empty: Profile = { name: "", email: "", gpa: "" };

function readStore(): Profile {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...(JSON.parse(raw) as Partial<Profile>) } : empty;
  } catch {
    return empty;
  }
}

let snapshot: Profile | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): Profile {
  if (snapshot === null) snapshot = readStore();
  return snapshot;
}

function getServerSnapshot(): Profile {
  return empty;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Shared, cross-component localStorage-backed store for the visitor's own profile. */
export function useProfile() {
  const profile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setProfile = useCallback((next: Profile) => {
    snapshot = next;
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore quota errors */
    }
    for (const listener of listeners) listener();
  }, []);

  const clearProfile = useCallback(() => {
    snapshot = empty;
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    for (const listener of listeners) listener();
  }, []);

  return { profile, setProfile, clearProfile, hasProfile: profile.name.trim().length > 0 };
}
