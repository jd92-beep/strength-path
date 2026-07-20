import { getAllExercises } from "./exercises";
import type { AppLangMode } from "./ui-strings";

/** Curated equipment / machine types for browsing demos. */
export type EquipmentCategory = {
  /** Exact `exercise.equipment` value from the dataset */
  id: string;
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
 */
export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  {
    id: "body weight",
    labelEn: "Bodyweight",
    labelYue: "徒手",
    hintEn: "No gear needed",
    hintYue: "唔使器材",
    color: "#30d158",
  },
  {
    id: "dumbbell",
    labelEn: "Dumbbell",
    labelYue: "啞鈴",
    hintEn: "Free weights",
    hintYue: "自由重量",
    color: "#ff9f0a",
  },
  {
    id: "barbell",
    labelEn: "Barbell",
    labelYue: "槓鈴",
    hintEn: "Big compounds",
    hintYue: "複合大項",
    color: "#ff2d55",
  },
  {
    id: "cable",
    labelEn: "Cable",
    labelYue: "鋼纜",
    hintEn: "Constant tension",
    hintYue: "持續張力",
    color: "#64d2ff",
  },
  {
    id: "leverage machine",
    labelEn: "Leverage machine",
    labelYue: "槓式器械",
    hintEn: "Guided path",
    hintYue: "固定軌跡",
    color: "#bf5af2",
  },
  {
    id: "smith machine",
    labelEn: "Smith machine",
    labelYue: "史密斯機",
    hintEn: "Bar on rails",
    hintYue: "軌道槓",
    color: "#5e5ce6",
  },
  {
    id: "kettlebell",
    labelEn: "Kettlebell",
    labelYue: "壺鈴",
    hintEn: "Swing & press",
    hintYue: "擺動推舉",
    color: "#ff375f",
  },
  {
    id: "band",
    labelEn: "Band",
    labelYue: "彈力帶",
    hintEn: "Light resistance",
    hintYue: "輕阻力",
    color: "#ffd60a",
  },
  {
    id: "ez barbell",
    labelEn: "EZ barbell",
    labelYue: "彎槓",
    hintEn: "Arm work",
    hintYue: "手臂訓練",
    color: "#af52de",
  },
  {
    id: "sled machine",
    labelEn: "Sled machine",
    labelYue: "雪橇機",
    hintEn: "Push & drive",
    hintYue: "推動爆發",
    color: "#32ade6",
  },
  {
    id: "stability ball",
    labelEn: "Stability ball",
    labelYue: "健身球",
    hintEn: "Core balance",
    hintYue: "核心平衡",
    color: "#30d158",
  },
  {
    id: "medicine ball",
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
