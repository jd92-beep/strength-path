/** Client-side workout set log (localStorage), same snapshot pattern as progress.ts. */

const KEY = "strength-path-log-v1";
const EVENT = "strength-path-log";
// ponytail: flat array capped at 5000 sets (~years of training); paginate if that ever hurts
const MAX_ENTRIES = 5000;

export type SetRpe = "easy" | "ok" | "hard";

export type SetLogEntry = {
  /** ms epoch */
  ts: number;
  exerciseId: string;
  exerciseName: string;
  bodyPart: string;
  sessionId?: string;
  programId?: string;
  /** planned reps string from the program, e.g. "8–10" */
  reps: string;
  /** user-entered load; undefined for bodyweight */
  weightKg?: number;
  /** optional how-it-felt tag for progression */
  rpe?: SetRpe;
};

let cachedRaw: string | null | undefined = undefined;
let cachedState: SetLogEntry[] = [];

function parse(raw: string | null): SetLogEntry[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (e): e is SetLogEntry =>
        e &&
        typeof e.ts === "number" &&
        typeof e.exerciseId === "string" &&
        typeof e.exerciseName === "string",
    );
  } catch {
    return [];
  }
}

/** Referentially stable snapshot for useSyncExternalStore. */
export function getLogSnapshot(): SetLogEntry[] {
  if (typeof window === "undefined") return cachedState;
  const raw = localStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedState;
  cachedRaw = raw;
  cachedState = parse(raw);
  return cachedState;
}

function save(entries: SetLogEntry[]) {
  const next = entries.slice(-MAX_ENTRIES);
  const raw = JSON.stringify(next);
  localStorage.setItem(KEY, raw);
  cachedRaw = raw;
  cachedState = next;
  window.dispatchEvent(new Event(EVENT));
}

export function subscribeLog(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener(EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(EVENT, handler);
  };
}

export function logSet(entry: Omit<SetLogEntry, "ts">) {
  if (typeof window === "undefined") return;
  save([...getLogSnapshot(), { ...entry, ts: Date.now() }]);
}

export function clearLog() {
  if (typeof window === "undefined") return;
  save([]);
}

/** Remember the last weight used per exercise so the stepper starts sensibly. */
export function lastWeightFor(exerciseId: string): number | undefined {
  for (let i = getLogSnapshot().length - 1; i >= 0; i--) {
    const e = getLogSnapshot()[i];
    if (e.exerciseId === exerciseId && typeof e.weightKg === "number") return e.weightKg;
  }
  return undefined;
}

/** First rep count in a planned string like "8–10" or "12", for volume estimates. */
function firstReps(reps: string): number {
  const m = reps.match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

export type LogStats = {
  totalSets: number;
  totalVolumeKg: number;
  daysActive: number;
};

export function computeStats(entries: SetLogEntry[]): LogStats {
  const days = new Set<string>();
  let vol = 0;
  for (const e of entries) {
    days.add(new Date(e.ts).toDateString());
    if (typeof e.weightKg === "number") vol += e.weightKg * firstReps(e.reps);
  }
  return { totalSets: entries.length, totalVolumeKg: Math.round(vol), daysActive: days.size };
}

/** Newest day first, sets within a day in chronological order. */
export function groupByDay(entries: SetLogEntry[]): { day: string; ts: number; sets: SetLogEntry[] }[] {
  const map = new Map<string, { day: string; ts: number; sets: SetLogEntry[] }>();
  for (const e of entries) {
    const day = new Date(e.ts).toDateString();
    let g = map.get(day);
    if (!g) {
      g = { day, ts: e.ts, sets: [] };
      map.set(day, g);
    }
    g.sets.push(e);
  }
  return [...map.values()].sort((a, b) => b.ts - a.ts);
}

export function toCsv(entries: SetLogEntry[]): string {
  const esc = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  const rows = entries.map((e) =>
    [
      new Date(e.ts).toISOString(),
      e.exerciseId,
      esc(e.exerciseName),
      esc(e.bodyPart),
      e.programId ?? "",
      e.sessionId ?? "",
      esc(e.reps),
      e.weightKg ?? "",
      e.rpe ?? "",
    ].join(","),
  );
  return [
    "timestamp,exercise_id,exercise,body_part,program,session,reps,weight_kg,rpe",
    ...rows,
  ].join("\n");
}

export type PersonalRecord = {
  exerciseId: string;
  exerciseName: string;
  /** Best single-set load */
  bestWeightKg: number;
  repsAtBest: string;
  /** Best estimated set volume (weight × first rep number) */
  bestSetVolume: number;
  ts: number;
};

/** Best loaded set per exercise (skips bodyweight-only history). */
export function computePersonalRecords(entries: SetLogEntry[], limit = 12): PersonalRecord[] {
  const best = new Map<string, PersonalRecord>();
  for (const e of entries) {
    if (typeof e.weightKg !== "number" || e.weightKg <= 0) continue;
    const vol = e.weightKg * firstReps(e.reps);
    const prev = best.get(e.exerciseId);
    if (
      !prev ||
      e.weightKg > prev.bestWeightKg ||
      (e.weightKg === prev.bestWeightKg && vol > prev.bestSetVolume)
    ) {
      best.set(e.exerciseId, {
        exerciseId: e.exerciseId,
        exerciseName: e.exerciseName,
        bestWeightKg: e.weightKg,
        repsAtBest: e.reps,
        bestSetVolume: vol,
        ts: e.ts,
      });
    }
  }
  return [...best.values()]
    .sort((a, b) => b.bestWeightKg - a.bestWeightKg || b.bestSetVolume - a.bestSetVolume)
    .slice(0, limit);
}

export type WeekBucket = {
  /** ISO week key YYYY-Www */
  week: string;
  label: string;
  volumeKg: number;
  sets: number;
  startTs: number;
};

/** Last N calendar weeks of volume (oldest → newest). */
export function weeklyVolume(entries: SetLogEntry[], weeks = 8): WeekBucket[] {
  const map = new Map<string, WeekBucket>();
  for (const e of entries) {
    const d = new Date(e.ts);
    const { key, label, startTs } = isoWeek(d);
    let b = map.get(key);
    if (!b) {
      b = { week: key, label, volumeKg: 0, sets: 0, startTs };
      map.set(key, b);
    }
    b.sets += 1;
    if (typeof e.weightKg === "number") b.volumeKg += e.weightKg * firstReps(e.reps);
  }
  const sorted = [...map.values()].sort((a, b) => a.startTs - b.startTs);
  const slice = sorted.slice(-weeks);
  for (const b of slice) b.volumeKg = Math.round(b.volumeKg);
  return slice;
}

function isoWeek(d: Date): { key: string; label: string; startTs: number } {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  const key = `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  const mon = new Date(d);
  const dow = mon.getDay() || 7;
  mon.setDate(mon.getDate() - dow + 1);
  mon.setHours(0, 0, 0, 0);
  const label = mon.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return { key, label, startTs: mon.getTime() };
}

export function downloadFile(name: string, mime: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
