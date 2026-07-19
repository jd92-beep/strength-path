import { LibraryPageClient } from "@/components/LocalizedPages";
import { filterExercises, uniqueValues } from "@/lib/exercises";

export const metadata = { title: "Search" };

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; body?: string; equipment?: string; target?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const body = sp.body ?? "";
  const equipment = sp.equipment ?? "";
  const target = sp.target ?? "";

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
