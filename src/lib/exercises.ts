import exercisesData from "@/data/exercises.json";
import { PROGRAMS } from "./programs";
import { detectPattern, type MovementPattern } from "./teaching";
import type { Exercise } from "./types";

const exercises = exercisesData as Exercise[];
const byId = new Map(exercises.map((e) => [e.id, e]));

/** Exercise IDs used in curated programs, by program id. */
const programExerciseIds = new Map<string, Set<string>>();
for (const p of PROGRAMS) {
  const ids = new Set<string>();
  for (const s of p.sessions) {
    for (const e of s.exercises) ids.add(e.exerciseId);
  }
  programExerciseIds.set(p.id, ids);
}

export function getAllExercises(): Exercise[] {
  return exercises;
}

export function getExercise(id: string): Exercise | undefined {
  return byId.get(id);
}

export function getExercisesByIds(ids: string[]): Exercise[] {
  return ids.map((id) => byId.get(id)).filter(Boolean) as Exercise[];
}

export function programExerciseIdSet(programId: string): Set<string> | undefined {
  return programExerciseIds.get(programId);
}

export function filterExercises(opts: {
  bodyPart?: string;
  equipment?: string;
  target?: string;
  q?: string;
  /** Movement pattern id from teaching.detectPattern */
  pattern?: string;
  /** Curated program id — only moves used in that path */
  programId?: string;
  limit?: number;
}): Exercise[] {
  const q = opts.q?.trim().toLowerCase();
  let list = exercises;

  if (opts.programId) {
    const ids = programExerciseIds.get(opts.programId);
    if (ids) list = list.filter((e) => ids.has(e.id));
    else list = [];
  }
  if (opts.bodyPart) {
    const bp = opts.bodyPart.toLowerCase();
    list = list.filter((e) => e.body_part.toLowerCase() === bp);
  }
  if (opts.equipment) {
    const eq = opts.equipment.toLowerCase();
    list = list.filter((e) => e.equipment.toLowerCase() === eq);
  }
  if (opts.target) {
    const t = opts.target.toLowerCase();
    list = list.filter((e) => e.target.toLowerCase() === t);
  }
  if (opts.pattern) {
    const pat = opts.pattern as MovementPattern;
    list = list.filter((e) => detectPattern(e) === pat);
  }
  if (q) {
    list = list.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.target.toLowerCase().includes(q) ||
        e.muscle_group.toLowerCase().includes(q) ||
        e.equipment.toLowerCase().includes(q),
    );
  }

  if (opts.limit) list = list.slice(0, opts.limit);
  return list;
}

export function uniqueValues(field: keyof Exercise): string[] {
  const set = new Set<string>();
  for (const e of exercises) {
    const v = e[field];
    if (typeof v === "string" && v) set.add(v);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function countByBodyPart(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const e of exercises) {
    counts[e.body_part] = (counts[e.body_part] || 0) + 1;
  }
  return counts;
}
