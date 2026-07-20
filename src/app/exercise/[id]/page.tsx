import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { TeachStudio } from "@/components/TeachStudio";
import { ExercisePageChrome } from "@/components/ExercisePageChrome";
import { slugifyPart } from "@/lib/body-parts";
import { filterExercises, getAllExercises, getExercise } from "@/lib/exercises";
import { buildLesson } from "@/lib/teaching";

/** Pre-render every exercise page — required for static export (Capacitor). */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllExercises().map((e) => ({ id: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ex = getExercise(id);
  return {
    title: ex?.name ?? "Exercise",
    description: ex?.instructions?.slice(0, 140),
  };
}

export default async function ExercisePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exercise = getExercise(id);
  if (!exercise) notFound();

  const lesson = buildLesson(exercise);
  const related = filterExercises({ bodyPart: exercise.body_part, limit: 8 }).filter(
    (e) => e.id !== exercise.id,
  );

  return (
    <AppShell title={exercise.name} backHref="/library">
      <ExercisePageChrome
        exerciseId={exercise.id}
        name={exercise.name}
        pattern={lesson.pattern}
        patternLabel={lesson.patternLabel}
        bodyPart={exercise.body_part}
        bodyHref={`/body/${slugifyPart(exercise.body_part)}`}
        equipment={exercise.equipment}
        target={exercise.target}
        related={related.map((e) => ({ id: e.id, name: e.name }))}
      >
        <TeachStudio exercise={exercise} autoPlay={false} />
      </ExercisePageChrome>
    </AppShell>
  );
}
