/**
 * Self-check for the plate maths. Run: npm run check:plates
 * No framework — asserts only, so it works with plain `node`.
 */
import assert from "node:assert/strict";
import { computePlates, formatPerSide, DEFAULT_BAR_KG } from "../src/lib/plates.ts";

// Bar alone
assert.equal(computePlates(19, 20), null, "below bar weight is unloadable");
const bar = computePlates(20, 20);
assert.deepEqual(bar.perSide, [], "target == bar needs no plates");
assert.equal(bar.loadedKg, 20);

// Canonical 100 kg: 20 bar + 2x40. Greedy takes the fewest plates: 25 + 15.
const hundred = computePlates(100, 20);
assert.equal(hundred.loadedKg, 100);
assert.equal(hundred.leftoverKg, 0);
assert.equal(formatPerSide(hundred), "25 + 15");

// The float-drift case: 1.25 plates must survive integer rounding
const drift = computePlates(22.5, 20);
assert.equal(drift.loadedKg, 22.5, "2x1.25 must load exactly");
assert.equal(formatPerSide(drift), "1.25");
assert.equal(drift.leftoverKg, 0, "no phantom remainder from float error");

// Unreachable target reports leftover instead of lying
const odd = computePlates(21, 20);
assert.equal(odd.loadedKg, 20, "1 kg cannot be split across two sides");
assert.equal(odd.leftoverKg, 1, "shortfall is surfaced, not hidden");

// Every result is internally consistent across a wide sweep
for (let t = 20; t <= 300; t += 0.25) {
  const r = computePlates(t, DEFAULT_BAR_KG);
  const sum = r.perSide.reduce((s, p) => s + p.plateKg * p.count, 0);
  assert.equal(r.loadedKg, DEFAULT_BAR_KG + 2 * sum, `loadedKg mismatch at ${t}`);
  assert.ok(r.leftoverKg >= 0 && r.leftoverKg < 2.5, `bad leftover ${r.leftoverKg} at ${t}`);
}

// Lighter bars still work
assert.equal(computePlates(60, 15).loadedKg, 60);

console.log("plates: all checks passed");
