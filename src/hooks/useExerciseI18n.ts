"use client";

import { useEffect, useMemo, useState } from "react";
import type { Exercise, ExerciseI18n, LangCode } from "@/lib/types";

const cache = new Map<LangCode, Record<string, ExerciseI18n>>();

async function loadLang(lang: LangCode) {
  const hit = cache.get(lang);
  if (hit) return hit;
  const res = await fetch(`/data/i18n/${lang}.json`);
  if (!res.ok) throw new Error(`Failed to load ${lang}`);
  const data = (await res.json()) as Record<string, ExerciseI18n>;
  cache.set(lang, data);
  return data;
}

/**
 * English comes from the exercise record (no fetch).
 * Other languages load on demand from /public/data/i18n/{lang}.json.
 */
export function useExerciseI18n(exercise: Exercise, lang: LangCode) {
  const english = useMemo<ExerciseI18n>(
    () => ({
      instructions: exercise.instructions,
      steps: exercise.steps,
    }),
    [exercise.instructions, exercise.steps],
  );

  // Bump when a language pack arrives so components re-render.
  const [version, setVersion] = useState(0);
  const [failedLang, setFailedLang] = useState<LangCode | null>(null);

  useEffect(() => {
    if (lang === "en") return;

    let cancelled = false;

    void loadLang(lang)
      .then(() => {
        if (cancelled) return;
        setFailedLang((prev) => (prev === lang ? null : prev));
        setVersion((v) => v + 1);
      })
      .catch(() => {
        if (!cancelled) setFailedLang(lang);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  if (lang === "en") {
    return { ...english, loading: false, error: false };
  }

  // version is read so successful fetches re-render with cache data
  void version;

  const pack = cache.get(lang)?.[exercise.id];
  const loading = !pack && failedLang !== lang;
  const error = failedLang === lang && !pack;

  return {
    instructions: pack?.instructions || english.instructions,
    steps: pack?.steps?.length ? pack.steps : english.steps,
    loading,
    error,
  };
}
