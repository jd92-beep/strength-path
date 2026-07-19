"use client";

import { useEffect, useMemo, useState } from "react";
import type { Exercise, ExerciseI18n } from "@/lib/types";
import { useLocale } from "@/lib/locale";

const cache = new Map<string, Record<string, ExerciseI18n>>();

/** Chinese pack from dataset (zh) used as written guide for Cantonese mode. */
async function loadZhPack() {
  const hit = cache.get("zh");
  if (hit) return hit;
  const res = await fetch("/data/i18n/zh.json");
  if (!res.ok) throw new Error("Failed to load zh");
  const data = (await res.json()) as Record<string, ExerciseI18n>;
  cache.set("zh", data);
  return data;
}

/**
 * English always from exercise record.
 * Cantonese mode loads dataset Chinese (zh) instructions as written 粵/中 guide.
 * Mode "both" exposes both.
 */
export function useExerciseI18n(exercise: Exercise) {
  const { showEn, showYue, mode } = useLocale();
  const english = useMemo<ExerciseI18n>(
    () => ({
      instructions: exercise.instructions,
      steps: exercise.steps,
    }),
    [exercise.instructions, exercise.steps],
  );

  const [version, setVersion] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!showYue) return;
    let cancelled = false;
    void loadZhPack()
      .then(() => {
        if (!cancelled) {
          setFailed(false);
          setVersion((v) => v + 1);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [showYue, exercise.id]);

  void version;
  const zh = cache.get("zh")?.[exercise.id];
  const yuePack: ExerciseI18n = {
    instructions: zh?.instructions || english.instructions,
    steps: zh?.steps?.length ? zh.steps : english.steps,
  };

  return {
    mode,
    showEn,
    showYue,
    en: english,
    yue: yuePack,
    /** Primary steps for single-language modes */
    steps: showYue && !showEn ? yuePack.steps : english.steps,
    instructions:
      showYue && !showEn ? yuePack.instructions : english.instructions,
    loading: showYue && !zh && !failed,
    error: failed && showYue && !zh,
  };
}
