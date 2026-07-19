/** Client-side progress helpers (localStorage). */

const KEY = "strength-path-progress-v1";
const EVENT = "strength-path-progress";

export type ProgressState = {
  completedSessions: string[];
  completedExercises: string[];
  lastProgramId?: string;
  lastSessionId?: string;
};

function empty(): ProgressState {
  return { completedSessions: [], completedExercises: [] };
}

/** Cached snapshot for useSyncExternalStore — must be referentially stable. */
let cachedRaw: string | null | undefined = undefined;
let cachedState: ProgressState = empty();

function parseProgress(raw: string | null): ProgressState {
  if (!raw) return empty();
  try {
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      completedSessions: Array.isArray(parsed.completedSessions)
        ? parsed.completedSessions.filter((x): x is string => typeof x === "string")
        : [],
      completedExercises: Array.isArray(parsed.completedExercises)
        ? parsed.completedExercises.filter((x): x is string => typeof x === "string")
        : [],
      lastProgramId:
        typeof parsed.lastProgramId === "string" ? parsed.lastProgramId : undefined,
      lastSessionId:
        typeof parsed.lastSessionId === "string" ? parsed.lastSessionId : undefined,
    };
  } catch {
    return empty();
  }
}

/**
 * Returns a cached ProgressState. Safe for useSyncExternalStore getSnapshot:
 * same reference until localStorage content changes.
 */
export function getProgressSnapshot(): ProgressState {
  if (typeof window === "undefined") return empty();
  const raw = localStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedState;
  cachedRaw = raw;
  cachedState = parseProgress(raw);
  return cachedState;
}

export function loadProgress(): ProgressState {
  return getProgressSnapshot();
}

export function saveProgress(state: ProgressState) {
  if (typeof window === "undefined") return;
  const next: ProgressState = {
    completedSessions: [...state.completedSessions],
    completedExercises: [...state.completedExercises],
    lastProgramId: state.lastProgramId,
    lastSessionId: state.lastSessionId,
  };
  const raw = JSON.stringify(next);
  localStorage.setItem(KEY, raw);
  cachedRaw = raw;
  cachedState = next;
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeProgress(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(EVENT, handler);
  };
}

export function markSessionComplete(sessionId: string, programId?: string) {
  const p = loadProgress();
  const completedSessions = p.completedSessions.includes(sessionId)
    ? p.completedSessions
    : [...p.completedSessions, sessionId];
  saveProgress({
    ...p,
    completedSessions,
    lastSessionId: sessionId,
    lastProgramId: programId ?? p.lastProgramId,
  });
  return getProgressSnapshot();
}

export function markExerciseLearned(exerciseId: string) {
  const p = loadProgress();
  if (p.completedExercises.includes(exerciseId)) return p;
  saveProgress({
    ...p,
    completedExercises: [...p.completedExercises, exerciseId],
  });
  return getProgressSnapshot();
}
