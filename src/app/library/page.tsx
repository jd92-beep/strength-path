import { Suspense } from "react";
import { LibraryClient } from "@/components/LibraryClient";
import { getAllExercises } from "@/lib/exercises";

export const metadata = { title: "Search" };

/* Filtering happens client-side (from the bundled dataset) so this page can be
   statically exported — a requirement for Capacitor iOS/Android packaging. */
export default function LibraryPage() {
  return (
    <Suspense>
      <LibraryClient totalExercises={getAllExercises().length} />
    </Suspense>
  );
}
