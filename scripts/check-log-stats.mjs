/**
 * Warm-up sets must stay in history but never reach the stats.
 * Run: npm run check:stats
 */
import assert from "node:assert/strict";
import {
  computePersonalRecords,
  computeStats,
  toCsv,
  weeklyVolume,
  workingSets,
} from "../src/lib/log.ts";

const day = new Date("2026-08-05T10:00:00Z").getTime();

const entries = [
  // A deliberately HEAVY warm-up: if warm-ups leaked into stats it would win
  // every comparison below, so each assertion genuinely tests the exclusion.
  { ts: day, exerciseId: "e1", exerciseName: "bench", bodyPart: "chest", reps: "10", weightKg: 200, warmup: true },
  { ts: day + 1000, exerciseId: "e1", exerciseName: "bench", bodyPart: "chest", reps: "10", weightKg: 80 },
];

// Volume + set count ignore the warm-up
const stats = computeStats(entries);
assert.equal(stats.totalSets, 1, "warm-up must not count as a logged set");
assert.equal(stats.totalVolumeKg, 800, "volume must be 80x10, not 200x10 + 80x10");
assert.equal(stats.daysActive, 1, "a warm-up-only day still counts as trained");

// PRs ignore the warm-up even though it is much heavier
const prs = computePersonalRecords(entries);
assert.equal(prs.length, 1);
assert.equal(prs[0].bestWeightKg, 80, "a heavy warm-up must never become a PR");

// Weekly chart ignores the warm-up
const weeks = weeklyVolume(entries, 8, "en-GB");
assert.equal(weeks.at(-1).volumeKg, 800, "weekly volume must exclude warm-ups");
assert.equal(weeks.at(-1).sets, 1, "weekly set count must exclude warm-ups");

// History and export keep it
assert.equal(workingSets(entries).length, 1);
const csv = toCsv(entries);
assert.match(csv, /set_type/, "CSV header carries the set type");
assert.equal(csv.split("\n").length, 3, "both sets are exported, warm-up included");
assert.match(csv, /,warmup$/m, "warm-up row is labelled");
assert.match(csv, /,working$/m, "working row is labelled");

// A log with no warm-up flags at all behaves exactly as before
const legacy = [{ ts: day, exerciseId: "e2", exerciseName: "row", bodyPart: "back", reps: "8", weightKg: 50 }];
assert.equal(computeStats(legacy).totalSets, 1, "existing logs are unaffected");
assert.equal(computeStats(legacy).totalVolumeKg, 400);

console.log("log stats: all checks passed");
