"use client";

import { useSearchParams } from "next/navigation";
import { LibraryPageClient } from "@/components/LocalizedPages";
import { filterExercises, uniqueValues } from "@/lib/exercises";
import { PROGRAMS } from "@/lib/programs";
import { patternCatalog } from "@/lib/teaching";

export function LibraryClient() {
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";
  const body = sp.get("body") ?? "";
  const equipment = sp.get("equipment") ?? "";
  const target = sp.get("target") ?? "";
  const pattern = sp.get("pattern") ?? "";
  const programId = sp.get("program") ?? "";

  const results = filterExercises({
    q: q || undefined,
    bodyPart: body || undefined,
    equipment: equipment || undefined,
    target: target || undefined,
    pattern: pattern || undefined,
    programId: programId || undefined,
    limit: 80,
  });

  return (
    <LibraryPageClient
      results={results}
      q={q}
      body={body}
      equipment={equipment}
      target={target}
      pattern={pattern}
      programId={programId}
      equipmentOptions={uniqueValues("equipment")}
      targetOptions={uniqueValues("target")}
      programOptions={PROGRAMS.map((p) => ({ id: p.id, title: p.title }))}
      patternOptions={patternCatalog().map((p) => ({ id: p.id, label: p.label }))}
    />
  );
}
