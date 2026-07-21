import { getAllExercises } from "./exercises";
import { detectPattern, type MovementPattern } from "./teaching";
import type { Exercise, Session, WorkoutExercise } from "./types";

/** Default slots for a balanced freestyle session. */
export const QUICK_SLOT_PATTERNS: MovementPattern[] = [
  "push-horizontal",
  "pull-horizontal",
  "squat",
  "hinge",
  "core-brace",
  "isolation",
];

const DEFAULT_SETS: WorkoutExercise["sets"] = [
  { reps: "8–12" },
  { reps: "8–12" },
  { reps: "8–12" },
];

function pickExercise(
  pattern: MovementPattern,
  equipmentPref: "any" | "body weight" | "dumbbell",
  used: Set<string>,
): Exercise | undefined {
  const pool = getAllExercises().filter((e) => {
    if (used.has(e.id)) return false;
    if (detectPattern(e) !== pattern) return false;
    if (equipmentPref === "any") return true;
    if (equipmentPref === "body weight") return e.equipment === "body weight";
    return e.equipment === "dumbbell" || e.equipment === "body weight";
  });
  // Prefer shorter names (usually cleaner demos) and dumbbell when requested
  pool.sort((a, b) => {
    if (equipmentPref === "dumbbell") {
      const ae = a.equipment === "dumbbell" ? 0 : 1;
      const be = b.equipment === "dumbbell" ? 0 : 1;
      if (ae !== be) return ae - be;
    }
    return a.name.length - b.name.length;
  });
  return pool[0];
}

export type QuickBuildOpts = {
  patterns: MovementPattern[];
  equipment: "any" | "body weight" | "dumbbell";
};

export function buildQuickSession(opts: QuickBuildOpts): {
  session: Session;
  exercises: Exercise[];
} {
  const used = new Set<string>();
  const moves: WorkoutExercise[] = [];
  const exercises: Exercise[] = [];

  for (const pattern of opts.patterns) {
    const ex = pickExercise(pattern, opts.equipment, used);
    if (!ex) continue;
    used.add(ex.id);
    exercises.push(ex);
    moves.push({
      exerciseId: ex.id,
      sets: DEFAULT_SETS.map((s) => ({ ...s })),
      restSec: pattern.startsWith("core") || pattern === "isolation" ? 45 : 75,
      coaching: "Quality reps. Stop 1–2 short of failure. Log how it felt.",
    });
  }

  const session: Session = {
    id: "quick",
    title: "Quick session",
    focus: opts.patterns.join(" · "),
    durationMin: Math.max(20, moves.length * 7),
    level: "beginner",
    exercises: moves,
  };

  return { session, exercises };
}
