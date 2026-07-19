import { LearnPageClient } from "@/components/LocalizedPages";
import { getAllExercises } from "@/lib/exercises";
import { detectPattern, patternCatalog } from "@/lib/teaching";

export const metadata = { title: "Library" };

export default function LearnPage() {
  const all = getAllExercises();
  const items = patternCatalog().map((p) => ({
    ...p,
    count: all.filter((e) => detectPattern(e) === p.id).length,
  }));
  return <LearnPageClient items={items} />;
}
