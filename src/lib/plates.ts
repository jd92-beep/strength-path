/**
 * Barbell plate maths. Pure + dependency-free so it can be unit-checked with
 * `npm run check:plates` (see scripts/check-plates.mjs).
 */

export const DEFAULT_BAR_KG = 20;

/** Bars you actually meet in a commercial gym. */
export const BAR_OPTIONS_KG = [20, 15, 10] as const;

/** Standard metric plate denominations, heaviest first. */
export const GYM_PLATES_KG = [25, 20, 15, 10, 5, 2.5, 1.25] as const;

export type PlateStack = { plateKg: number; count: number };

export type PlateLoad = {
  barKg: number;
  /** Plates for ONE side of the bar, heaviest first. */
  perSide: PlateStack[];
  /** What the bar actually weighs once loaded. */
  loadedKg: number;
  /** Target minus loadedKg — non-zero when the target isn't reachable. */
  leftoverKg: number;
};

// Work in integer hundredths of a kg: 1.25 + 1.25 + 2.5 in floats drifts, and a
// drifting remainder makes the last plate silently disappear.
const toCenti = (kg: number) => Math.round(kg * 100);
const fromCenti = (c: number) => c / 100;

/**
 * Greedy per-side breakdown of `targetKg`.
 * Returns null when the target is lighter than the bar — nothing to load.
 *
 * ponytail: greedy, which is optimal for the canonical doubling-ish plate set
 * above. A gym with an odd custom set could need DP; swap it in only if that
 * ever shows up.
 */
export function computePlates(
  targetKg: number,
  barKg: number = DEFAULT_BAR_KG,
  plates: readonly number[] = GYM_PLATES_KG,
): PlateLoad | null {
  if (!Number.isFinite(targetKg) || !Number.isFinite(barKg)) return null;
  if (targetKg < barKg) return null;

  // Odd totals can't split evenly across two sides; floor to the side pair and
  // report the difference as leftover rather than lying about the load.
  let remaining = Math.floor((toCenti(targetKg) - toCenti(barKg)) / 2);
  const perSide: PlateStack[] = [];

  for (const plate of [...plates].sort((a, b) => b - a)) {
    const p = toCenti(plate);
    if (p <= 0) continue;
    const count = Math.floor(remaining / p);
    if (count > 0) {
      perSide.push({ plateKg: plate, count });
      remaining -= count * p;
    }
  }

  const loadedCenti = toCenti(barKg) + 2 * perSide.reduce((s, x) => s + toCenti(x.plateKg) * x.count, 0);
  return {
    barKg,
    perSide,
    loadedKg: fromCenti(loadedCenti),
    leftoverKg: fromCenti(toCenti(targetKg) - loadedCenti),
  };
}

/** Dataset equipment values that load plates onto a bar. */
const BARBELL_EQUIPMENT = new Set([
  "barbell",
  "ez barbell",
  "olympic barbell",
  "smith machine",
  "trap bar",
]);

export function isBarbellEquipment(equipment: string): boolean {
  return BARBELL_EQUIPMENT.has(equipment.toLowerCase());
}

/**
 * Sensible starting bar weight for an equipment type. Trap bars and smith
 * machines vary far too much between gyms to guess well — the UI keeps the bar
 * selectable so the user can correct it.
 */
export function defaultBarKg(equipment: string): number {
  return equipment.toLowerCase() === "ez barbell" ? 10 : DEFAULT_BAR_KG;
}

/** "25 + 10 + 2.5" — one side of the bar, for a compact readout. */
export function formatPerSide(load: PlateLoad): string {
  if (!load.perSide.length) return "";
  return load.perSide
    .flatMap((s) => Array<number>(s.count).fill(s.plateKg))
    .join(" + ");
}
