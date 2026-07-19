import { notFound } from "next/navigation";
import { PatternPageClient } from "@/components/PatternPageClient";
import { getAllExercises } from "@/lib/exercises";
import {
  exercisesForPattern,
  patternCatalog,
  type MovementPattern,
  buildLesson,
} from "@/lib/teaching";

export function generateStaticParams() {
  return patternCatalog().map((p) => ({ pattern: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pattern: string }>;
}) {
  const { pattern } = await params;
  const meta = patternCatalog().find((p) => p.id === pattern);
  return { title: meta ? `Learn ${meta.label}` : "Pattern" };
}

export default async function PatternPage({
  params,
}: {
  params: Promise<{ pattern: string }>;
}) {
  const { pattern } = await params;
  const meta = patternCatalog().find((p) => p.id === pattern);
  if (!meta) notFound();

  const all = getAllExercises();
  const list = exercisesForPattern(all, pattern as MovementPattern, 30);
  const sample = list[0];
  const lesson = sample ? buildLesson(sample) : null;

  return (
    <PatternPageClient
      patternId={meta.id}
      label={meta.label}
      skillFocus={meta.skillFocus}
      color={meta.color}
      exercises={list}
      lesson={lesson}
    />
  );
}
