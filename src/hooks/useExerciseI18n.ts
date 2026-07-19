"use client";

import { useEffect, useState } from "react";
import type { Exercise, ExerciseI18n, LangCode } from "@/lib/types";

const cache = new Map<string, Record<string, ExerciseI18n>>();

async function loadLang(lang: LangCode) {
  if (cache.has(lang)) return cache.get(lang)!;
  const res = await fetch(`/data/i18n/${lang}.json`);
  if (!res.ok) throw new Error(`Failed to load ${lang}`);
  const data = (await res.json()) as Record<string, ExerciseI18n>;
  cache.set(lang, data);
  return data;
}

export function useExerciseI18n(exercise: Exercise, lang: LangCode) {
  const [pack, setPack] = useState<ExerciseI18n>({
    instructions: exercise.instructions,
    steps: exercise.steps,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (lang === "en") {
      setPack({ instructions: exercise.instructions, steps: exercise.steps });
      setLoading(false);
      return;
    }
    setLoading(true);
    loadLang(lang)
      .then((map) => {
        if (cancelled) return;
        const hit = map[exercise.id];
        setPack(
          hit || {
            instructions: exercise.instructions,
            steps: exercise.steps,
          },
        );
      })
      .catch(() => {
        if (!cancelled) {
          setPack({
            instructions: exercise.instructions,
            steps: exercise.steps,
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [exercise.id, exercise.instructions, exercise.steps, lang]);

  return { ...pack, loading };
}
