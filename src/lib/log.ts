/** Client-side workout set log (localStorage), same snapshot pattern as progress.ts. */

const KEY = "strength-path-log-v1";
const EVENT = "strength-path-log";
// ponytail: flat array capped at 5000 sets (~years of training); paginate if that ever hurts
const MAX_ENTRIES = 5000;

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
    ].join(","),
  );
  return ["timestamp,exercise_id,exercise,body_part,program,session,reps,weight_kg", ...rows].join(
    "\n",
  );
}

export function downloadFile(name: string, mime: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
