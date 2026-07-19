"use client";

import { useSyncExternalStore } from "react";
import { ActivityRings } from "./ActivityRings";
import { loadProgress, type ProgressState } from "@/lib/progress";

/** Total guided sessions in the app (Foundation + Dumbbell + Barbell). */
const TOTAL_SESSIONS = 9;

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener("storage", handler);
  window.addEventListener("strength-path-progress", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("strength-path-progress", handler);
  };
}

function getSnapshot(): ProgressState {
  return loadProgress();
}

function getServerSnapshot(): ProgressState {
  return { completedSessions: [], completedExercises: [] };
}

function toRings(p: ProgressState) {
  const sessionsDone = p.completedSessions.length;
  const movesLearned = p.completedExercises.length;
  return {
    move: Math.min(1, Math.max(0.08, sessionsDone / TOTAL_SESSIONS || 0.08)),
    exercise: Math.min(1, Math.max(0.08, movesLearned / 12 || 0.08)),
    stand: p.lastSessionId ? Math.min(1, 0.35 + sessionsDone * 0.12) : 0.12,
  };
}

/**
 * Live rings driven by localStorage progress (not static decoration).
 */
export function SummaryRings({ size = 118 }: { size?: number }) {
  const progress = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const rings = toRings(progress);
  return <ActivityRings move={rings.move} exercise={rings.exercise} stand={rings.stand} size={size} />;
}
