/**
 * User-built routines (localStorage), same snapshot pattern as progress.ts/log.ts.
 *
 * Routines are created at runtime, so they can never own a pre-rendered route
 * in the static export. /routines is a single static page that builds a Session
 * client-side and hands it to WorkoutClient — the same trick /quick uses.
 */

import type { Session, WorkoutExercise } from "./types";

const KEY = "strength-path-routines-v1";
const EVENT = "strength-path-routines";
// ponytail: a personal routine list is tens of items, not thousands
const MAX_ROUTINES = 100;

export const ROUTINE_PROGRAM_ID = "routine";

export type RoutineExercise = {
  exerciseId: string;
  sets: number;
  reps: string;
  restSec: number;
};

export type Routine = {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  updatedAt: number;
};

export const DEFAULT_SETS = 3;
export const DEFAULT_REPS = "8–12";
export const DEFAULT_REST_SEC = 90;

let cachedRaw: string | null | undefined = undefined;
let cachedState: Routine[] = [];

function parse(raw: string | null): Routine[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (r): r is Routine =>
        r &&
        typeof r.id === "string" &&
        typeof r.name === "string" &&
        Array.isArray(r.exercises),
    );
  } catch {
    return [];
  }
}

/** Referentially stable snapshot for useSyncExternalStore. */
export function getRoutinesSnapshot(): Routine[] {
  if (typeof window === "undefined") return cachedState;
  const raw = localStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedState;
  cachedRaw = raw;
  cachedState = parse(raw);
  return cachedState;
}

function save(routines: Routine[]) {
  const next = routines.slice(0, MAX_ROUTINES);
  const raw = JSON.stringify(next);
  localStorage.setItem(KEY, raw);
  cachedRaw = raw;
  cachedState = next;
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeRoutines(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(EVENT, handler);
  };
}

export function newRoutineId(): string {
  // crypto.randomUUID needs a secure context; file:// in a Capacitor shell is not
  // guaranteed to be one, so keep a plain fallback.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `r${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
}

/** Insert or replace by id; newest first. */
export function saveRoutine(routine: Routine) {
  if (typeof window === "undefined") return;
  const stamped = { ...routine, updatedAt: Date.now() };
  const rest = getRoutinesSnapshot().filter((r) => r.id !== routine.id);
  save([stamped, ...rest]);
}

export function deleteRoutine(id: string) {
  if (typeof window === "undefined") return;
  save(getRoutinesSnapshot().filter((r) => r.id !== id));
}

export function getRoutine(id: string): Routine | undefined {
  return getRoutinesSnapshot().find((r) => r.id === id);
}

/** Rough duration: work time plus rest, rounded to whole minutes. */
export function estimateMinutes(routine: Routine): number {
  const secs = routine.exercises.reduce(
    (total, e) => total + e.sets * (35 + Math.max(0, e.restSec)),
    0,
  );
  return Math.max(1, Math.round(secs / 60));
}

/** Shape a routine into the Session that WorkoutClient consumes. */
export function routineToSession(routine: Routine): Session {
  const exercises: WorkoutExercise[] = routine.exercises.map((e) => ({
    exerciseId: e.exerciseId,
    sets: Array.from({ length: Math.max(1, e.sets) }, () => ({ reps: e.reps })),
    restSec: e.restSec,
    coaching: "",
  }));

  return {
    id: routine.id,
    title: routine.name,
    focus: routine.name,
    durationMin: estimateMinutes(routine),
    level: "beginner",
    exercises,
  };
}
