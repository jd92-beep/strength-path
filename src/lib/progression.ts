import { getLogSnapshot, type SetLogEntry, type SetRpe } from "./log";

export type RepRange = { min: number; max: number; isTimed: boolean };

// ponytail: 1-line Epley 1RM estimate
export function estimate1RM(weightKg: number, reps: number): number {
  if (weightKg <= 0 || reps <= 0) return 0;
  return reps <= 1 ? weightKg : Math.round(weightKg * (1 + reps / 30) * 10) / 10;
}

/** Parse planned strings like "8–10", "12", "8/leg", "AMRAP −2", "20–30s". */
export function parseRepRange(reps: string): RepRange {
  const s = reps.trim().toLowerCase();
  if (s.includes("amrap") || s.includes("max")) {
    return { min: 1, max: 99, isTimed: false };
  }
  if (s.includes("s") && !s.includes("/")) {
    const nums = [...s.matchAll(/\d+/g)].map((m) => parseInt(m[0], 10));
    if (nums.length >= 2) return { min: nums[0], max: nums[1], isTimed: true };
    if (nums.length === 1) return { min: nums[0], max: nums[0], isTimed: true };
  }
  const nums = [...s.matchAll(/\d+/g)].map((m) => parseInt(m[0], 10));
  if (nums.length >= 2) return { min: nums[0], max: nums[1], isTimed: false };
  if (nums.length === 1) return { min: nums[0], max: nums[0], isTimed: false };
  return { min: 0, max: 0, isTimed: false };
}

/** Last N logged sets for one exercise (newest last). */
export function recentSetsFor(exerciseId: string, n = 12): SetLogEntry[] {
  const all = getLogSnapshot().filter((e) => e.exerciseId === exerciseId);
  return all.slice(-n);
}

/**
 * Suggest load for the next set from history + simple double-progression.
 * Logged `reps` are planned targets (not counted reps), so progression keys off RPE:
 * - Mostly easy → +2.5 kg
 * - Any hard → keep last (or −2.5 if mostly hard)
 * - Otherwise keep last load
 */
export function suggestWeightKg(
  exerciseId: string,
  _plannedReps: string,
): { kg: number; reason: "last" | "progress" | "deload" } | undefined {
  const recent = recentSetsFor(exerciseId, 20).filter((e) => typeof e.weightKg === "number");
  if (!recent.length) return undefined;

  const last = recent[recent.length - 1];
  const lastKg = last.weightKg as number;

  // Group consecutive sets from the most recent session day
  const lastDay = new Date(last.ts).toDateString();
  const sessionSets = recent.filter((e) => new Date(e.ts).toDateString() === lastDay);
  if (!sessionSets.length) return { kg: lastKg, reason: "last" };

  const tagged = sessionSets.filter((e) => e.rpe);
  const anyHard = sessionSets.some((e) => e.rpe === "hard");
  const easyCount = sessionSets.filter((e) => e.rpe === "easy").length;
  const hardCount = sessionSets.filter((e) => e.rpe === "hard").length;

  // Need RPE tags to auto-progress; otherwise just recall last weight
  if (tagged.length === 0) {
    return { kg: lastKg, reason: "last" };
  }

  if (easyCount >= Math.ceil(sessionSets.length / 2) && !anyHard) {
    return { kg: roundStep(lastKg + 2.5), reason: "progress" };
  }
  if (hardCount >= Math.ceil(sessionSets.length / 2) && lastKg >= 5) {
    return { kg: roundStep(Math.max(0, lastKg - 2.5)), reason: "deload" };
  }
  return { kg: lastKg, reason: "last" };
}

function roundStep(n: number): number {
  return Math.round(n * 2) / 2;
}

/** Scale rest from RPE (seconds). */
export function restForRpe(baseSec: number, rpe: SetRpe | null): number {
  if (!rpe || rpe === "ok") return baseSec;
  if (rpe === "easy") return Math.max(20, Math.round(baseSec * 0.85));
  return Math.round(baseSec * 1.2);
}

export type ProgressionNote = {
  exerciseId: string;
  exerciseName: string;
  messageEn: string;
  messageYue: string;
};

/** After a session, short notes for next time (progress / hold). */
export function sessionProgressionNotes(
  programId: string | undefined,
  sessionId: string | undefined,
  exerciseIds: { id: string; name: string; plannedTop: string }[],
): ProgressionNote[] {
  if (!sessionId) return [];
  const log = getLogSnapshot().filter(
    (e) => e.sessionId === sessionId && (!programId || e.programId === programId),
  );
  if (!log.length) return [];

  const notes: ProgressionNote[] = [];
  for (const ex of exerciseIds) {
    const sets = log.filter((e) => e.exerciseId === ex.id);
    if (!sets.length) continue;
    const lastKg = [...sets].reverse().find((s) => typeof s.weightKg === "number")?.weightKg;
    const tagged = sets.filter((s) => s.rpe);
    const easyCount = sets.filter((s) => s.rpe === "easy").length;
    const anyHard = sets.some((s) => s.rpe === "hard");
    if (
      typeof lastKg === "number" &&
      tagged.length > 0 &&
      easyCount >= Math.ceil(sets.length / 2) &&
      !anyHard
    ) {
      notes.push({
        exerciseId: ex.id,
        exerciseName: ex.name,
        messageEn: `Next time try ${roundStep(lastKg + 2.5)} kg on ${ex.name}.`,
        messageYue: `下次 ${ex.name} 試下 ${roundStep(lastKg + 2.5)} kg。`,
      });
    }
  }
  return notes.slice(0, 4);
}
