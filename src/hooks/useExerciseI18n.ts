"use client";

import { useEffect, useMemo, useState } from "react";
import type { Exercise, ExerciseI18n } from "@/lib/types";
import { useLocale } from "@/lib/locale";

const cache = new Map<string, Record<string, ExerciseI18n>>();

/**
 * Chinese pack from the dataset (zh) — simplified-Chinese standard Mandarin,
 * NOT Cantonese. UI labels it 中文（簡體） so users aren't misled.
 */
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
 * Cantonese mode loads the dataset's simplified-Chinese (zh) instructions as
 * a written Chinese guide (labeled 中文（簡體）, not 粵語).
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
  const [retryCount, setRetryCount] = useState(0);

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
  }, [showYue, exercise.id, retryCount]);

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
    /** Re-attempt the zh pack fetch after a failure. */
    retry: () => {
      setFailed(false);
      setRetryCount((c) => c + 1);
    },
  };
}
