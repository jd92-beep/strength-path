import { HomeClient } from "./HomeClient";
import { getAllExercises, getExercise } from "@/lib/exercises";
import { PROGRAMS } from "@/lib/programs";
import { patternCatalog } from "@/lib/teaching";
import { LANGS } from "@/lib/langs";
import type { Exercise } from "@/lib/types";

export default function HomePage() {
  const total = getAllExercises().length;
  const spotlight = ["0662", "0043", "0652", "0025"]
    .map((id) => getExercise(id))
    .filter((e): e is Exercise => Boolean(e));

  return (
    <HomeClient
      total={total}
      langCount={LANGS.length}
      programs={PROGRAMS}
      patterns={patternCatalog().slice(0, 4)}
      spotlight={spotlight}
    />
  );
}
