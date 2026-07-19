/** Client-side progress helpers (localStorage). */

const KEY = "strength-path-progress-v1";

export type ProgressState = {
  completedSessions: string[];
  completedExercises: string[];
  lastProgramId?: string;
  lastSessionId?: string;
};

function empty(): ProgressState {
  return { completedSessions: [], completedExercises: [] };
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch {
    return empty();
  }
}

export function saveProgress(state: ProgressState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
  // Notify same-tab subscribers (storage event only fires cross-tab).
  window.dispatchEvent(new Event("strength-path-progress"));
}

export function markSessionComplete(sessionId: string, programId?: string) {
  const p = loadProgress();
  if (!p.completedSessions.includes(sessionId)) {
    p.completedSessions.push(sessionId);
  }
  p.lastSessionId = sessionId;
  if (programId) p.lastProgramId = programId;
  saveProgress(p);
  return p;
}

export function markExerciseLearned(exerciseId: string) {
  const p = loadProgress();
  if (!p.completedExercises.includes(exerciseId)) {
    p.completedExercises.push(exerciseId);
  }
  saveProgress(p);
  return p;
}
