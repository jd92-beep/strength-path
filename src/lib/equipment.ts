import { getAllExercises } from "./exercises";
import type { AppLangMode } from "./ui-strings";

/** Curated equipment / machine types for browsing demos. */
export type EquipmentCategory = {
  /** Exact `exercise.equipment` value from the dataset */
  id: string;
  /** Filename under /equipment-icons/ (without extension) */
  slug: string;
  labelEn: string;
  labelYue: string;
  /** Short hint shown under the title */
  hintEn: string;
  hintYue: string;
  /** Accent color for tiles */
  color: string;
};

/**
 * Featured machine / equipment types for Summary + equipment index.
 * Order = display priority (most useful first).
 * Product photos live in /public/equipment-icons/{slug}.jpg
 */
export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  {
    id: "body weight",
    slug: "body-weight",
    labelEn: "Bodyweight",
    labelYue: "徒手",
    hintEn: "No gear needed",
    hintYue: "唔使器材",
    color: "#30d158",
  },
  {
    id: "dumbbell",
    slug: "dumbbell",
    labelEn: "Dumbbell",
    labelYue: "啞鈴",
    hintEn: "Free weights",
    hintYue: "自由重量",
    color: "#ff9f0a",
  },
  {
    id: "barbell",
    slug: "barbell",
    labelEn: "Barbell",
    labelYue: "槓鈴",
    hintEn: "Big compounds",
    hintYue: "複合大項",
    color: "#ff2d55",
  },
  {
    id: "cable",
    slug: "cable",
    labelEn: "Cable",
    labelYue: "鋼纜",
    hintEn: "Constant tension",
    hintYue: "持續張力",
    color: "#64d2ff",
  },
  {
    id: "leverage machine",
    slug: "leverage-machine",
    labelEn: "Leverage machine",
    labelYue: "槓式器械",
    hintEn: "Guided path",
    hintYue: "固定軌跡",
    color: "#bf5af2",
  },
  {
    id: "smith machine",
    slug: "smith-machine",
    labelEn: "Smith machine",
    labelYue: "史密斯機",
    hintEn: "Bar on rails",
    hintYue: "軌道槓",
    color: "#5e5ce6",
  },
  {
    id: "kettlebell",
    slug: "kettlebell",
    labelEn: "Kettlebell",
    labelYue: "壺鈴",
    hintEn: "Swing & press",
    hintYue: "擺動推舉",
    color: "#ff375f",
  },
  {
    id: "band",
    slug: "band",
    labelEn: "Band",
    labelYue: "彈力帶",
    hintEn: "Light resistance",
    hintYue: "輕阻力",
    color: "#ffd60a",
  },
  {
    id: "ez barbell",
    slug: "ez-barbell",
    labelEn: "EZ barbell",
    labelYue: "彎槓",
    hintEn: "Arm work",
    hintYue: "手臂訓練",
    color: "#af52de",
  },
  {
    id: "sled machine",
    slug: "sled-machine",
    labelEn: "Sled machine",
    labelYue: "雪橇機",
    hintEn: "Push & drive",
    hintYue: "推動爆發",
    color: "#32ade6",
  },
  {
    id: "stability ball",
    slug: "stability-ball",
    labelEn: "Stability ball",
    labelYue: "健身球",
    hintEn: "Core balance",
    hintYue: "核心平衡",
    color: "#30d158",
  },
  {
    id: "medicine ball",
    slug: "medicine-ball",
    labelEn: "Medicine ball",
    labelYue: "藥球",
    hintEn: "Throw & slam",
    hintYue: "拋擲爆發",
    color: "#ff9f0a",
  },
];

export function equipmentHref(id: string): string {
  return `/library?equipment=${encodeURIComponent(id)}`;
}

/** Public URL for the product photo of a machine type.
 *  ?v= bumps when assets are corrected so browsers/CDN drop stale wrong photos.
 */
export function equipmentImageSrc(slug: string): string {
  return `/equipment-icons/${slug}.jpg?v=3`;
}

export function labelEquipment(cat: EquipmentCategory, mode: AppLangMode): string {
  if (mode === "yue") return cat.labelYue;
  if (mode === "both") return `${cat.labelEn} · ${cat.labelYue}`;
  return cat.labelEn;
}

export function hintEquipment(cat: EquipmentCategory, mode: AppLangMode): string {
  if (mode === "yue") return cat.hintYue;
  if (mode === "both") return `${cat.hintEn} · ${cat.hintYue}`;
  return cat.hintEn;
}

export function countByEquipment(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const e of getAllExercises()) {
    counts[e.equipment] = (counts[e.equipment] || 0) + 1;
  }
  return counts;
}

/** Featured categories with live demo counts (skip empty). */
export function equipmentCatalog(limit?: number) {
  const counts = countByEquipment();
  const list = EQUIPMENT_CATEGORIES.map((c) => ({
    ...c,
    count: counts[c.id] || 0,
  })).filter((c) => c.count > 0);
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export type TargetCount = { target: string; count: number };

/** Which muscles does this machine train, ranked by number of demos. */
export function topTargetsByEquipment(equipmentId: string, limit = 6): TargetCount[] {
  const counts = new Map<string, number>();
  for (const e of getAllExercises()) {
    if (e.equipment !== equipmentId) continue;
    counts.set(e.target, (counts.get(e.target) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([target, count]) => ({ target, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function targetHref(equipmentId: string, target: string): string {
  return `/library?equipment=${encodeURIComponent(equipmentId)}&target=${encodeURIComponent(target)}`;
}
