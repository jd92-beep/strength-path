import type { BodyPartMeta } from "./types";

export const BODY_PARTS: BodyPartMeta[] = [
  {
    id: "chest",
    label: "Chest",
    blurb: "Push strength — presses, flyes, and push-ups.",
    accent: "oklch(0.72 0.16 35)",
    emoji: "🛡️",
  },
  {
    id: "back",
    label: "Back",
    blurb: "Pull strength — rows, pull-ups, and posture.",
    accent: "oklch(0.68 0.14 230)",
    emoji: "🏹",
  },
  {
    id: "upper legs",
    label: "Legs",
    blurb: "Squats, hinges, lunges — your strength engine.",
    accent: "oklch(0.7 0.16 145)",
    emoji: "🦵",
  },
  {
    id: "shoulders",
    label: "Shoulders",
    blurb: "Overhead power and stable joints.",
    accent: "oklch(0.72 0.15 300)",
    emoji: "🏔️",
  },
  {
    id: "upper arms",
    label: "Arms",
    blurb: "Biceps, triceps — curl, press, dip.",
    accent: "oklch(0.7 0.17 20)",
    emoji: "💪",
  },
  {
    id: "waist",
    label: "Core",
    blurb: "Abs and trunk control for every lift.",
    accent: "oklch(0.74 0.15 95)",
    emoji: "🎯",
  },
  {
    id: "lower legs",
    label: "Calves",
    blurb: "Ankle drive, balance, and spring.",
    accent: "oklch(0.68 0.12 195)",
    emoji: "🦶",
  },
  {
    id: "lower arms",
    label: "Forearms",
    blurb: "Grip that holds heavy loads.",
    accent: "oklch(0.66 0.1 50)",
    emoji: "✊",
  },
  {
    id: "cardio",
    label: "Cardio",
    blurb: "Work capacity and conditioning finishers.",
    accent: "oklch(0.7 0.18 15)",
    emoji: "❤️",
  },
  {
    id: "neck",
    label: "Neck",
    blurb: "Supportive work — light and controlled.",
    accent: "oklch(0.65 0.08 260)",
    emoji: "🧠",
  },
];

export function getBodyPart(id: string): BodyPartMeta | undefined {
  return BODY_PARTS.find(
    (b) => b.id === id.toLowerCase() || b.label.toLowerCase() === id.toLowerCase(),
  );
}

export function slugifyPart(part: string): string {
  return part.toLowerCase().replace(/\s+/g, "-");
}

export function deslugifyPart(slug: string): string {
  return slug.replace(/-/g, " ");
}
