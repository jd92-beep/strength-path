"use client";

import { useSearchParams } from "next/navigation";
import { LibraryPageClient } from "@/components/LocalizedPages";
import { filterExercises, uniqueValues } from "@/lib/exercises";

export function LibraryClient() {
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";
  const body = sp.get("body") ?? "";
  const equipment = sp.get("equipment") ?? "";
  const target = sp.get("target") ?? "";

  const results = filterExercises({
    q: q || undefined,
    bodyPart: body || undefined,
    equipment: equipment || undefined,
    target: target || undefined,
    limit: 80,
  });

  return (
    <LibraryPageClient
      results={results}
      q={q}
      body={body}
      equipment={equipment}
      target={target}
      equipmentOptions={uniqueValues("equipment")}
      targetOptions={uniqueValues("target")}
    />
  );
}
