import { getAllExercises, getExercise } from "./exercises";
import { detectPattern } from "./teaching";
import type { Exercise } from "./types";

/**
 * Curated swaps for moves that often need equipment alternatives
 * (e.g. no pull-up bar). IDs must exist in exercises.json.
 */
const PREFERRED: Record<string, string[]> = {
  // pull-up → inverted row, assisted / band / lat pulldown, db row
  "0651": ["0499", "0017", "0970", "2330", "0293"],
  // inverted row → dumbbell / incline row / assisted pull
  "0499": ["0293", "0327", "0017"],
  // push-up → incline, db press, dip
  "0662": ["0493", "0289", "0251"],
  // incline push-up → floor push-up / dip / db press
  "0493": ["0662", "0251", "0289"],
  // jump squat → bodyweight / goblet / barbell squat
  "0514": ["1685", "1760", "0043"],
  // burpee → mountain climber / jump squat / astride jumps
  "1160": ["0630", "0514", "3220"],
  // hanging leg raise → floor crunch / dead bug
  "0472": ["0274", "0276", "3013"],
  // barbell bench → db bench / push-up
  "0025": ["0289", "0662", "0493"],
  // barbell squat → goblet / bodyweight
  "0043": ["1760", "1685", "0514"],
  // conventional deadlift → RDL variants
  "0032": ["0085", "1459", "3013"],
  // barbell row → db row
  "0027": ["0293", "0327", "0499"],
  // OHP barbell → db press
  "0091": ["0405", "0662"],
  // walking lunge → barbell lunge / goblet / squat reach
  "1460": ["0054", "1760", "1685"],
};

function equipmentRank(a: string, b: string): number {
  // Prefer same equipment, then body weight as always-available fallback
  if (a === b) return 0;
  if (a === "body weight") return 1;
  if (b === "body weight") return -1;
  return a.localeCompare(b);
}

/**
 * Suggest substitute exercises (same movement pattern, different gear when possible).
 */
export function findSubstitutes(exerciseId: string, limit = 4): Exercise[] {
  const base = getExercise(exerciseId);
  if (!base) return [];
  const pattern = detectPattern(base);
  const preferred = (PREFERRED[exerciseId] ?? [])
    .map((id) => getExercise(id))
    .filter((e): e is Exercise => e != null && e.id !== exerciseId);

  const pool = getAllExercises()
    .filter((e) => e.id !== exerciseId && detectPattern(e) === pattern)
    .sort((a, b) => {
      const eq = equipmentRank(a.equipment, base.equipment) - equipmentRank(b.equipment, base.equipment);
      if (eq !== 0) return eq;
      // Prefer different equipment for true "no gear" swaps
      const aDiff = a.equipment === base.equipment ? 1 : 0;
      const bDiff = b.equipment === base.equipment ? 1 : 0;
      if (aDiff !== bDiff) return aDiff - bDiff;
      return a.name.localeCompare(b.name);
    });

  const seen = new Set<string>();
  const out: Exercise[] = [];
  for (const e of [...preferred, ...pool]) {
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    out.push(e);
    if (out.length >= limit) break;
  }
  return out;
}
