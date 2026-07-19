"use client";

import { useSyncExternalStore } from "react";
import { ActivityRings } from "./ActivityRings";
import {
  getProgressSnapshot,
  subscribeProgress,
  type ProgressState,
} from "@/lib/progress";

/** Total guided sessions in the app (Foundation + Dumbbell + Barbell). */
const TOTAL_SESSIONS = 9;

const SERVER_SNAPSHOT: ProgressState = {
  completedSessions: [],
  completedExercises: [],
};

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
 * Live rings driven by localStorage progress.
 * Uses a stable getSnapshot (required by useSyncExternalStore).
 */
export function SummaryRings({ size = 118 }: { size?: number }) {
  const progress = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    () => SERVER_SNAPSHOT,
  );
  const rings = toRings(progress);
  return (
    <ActivityRings move={rings.move} exercise={rings.exercise} stand={rings.stand} size={size} />
  );
}
