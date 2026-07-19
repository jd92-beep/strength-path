import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { TeachStudio } from "@/components/TeachStudio";
import { slugifyPart } from "@/lib/body-parts";
import { filterExercises, getAllExercises, getExercise } from "@/lib/exercises";
import { buildLesson } from "@/lib/teaching";

export function generateStaticParams() {
  return getAllExercises()
    .slice(0, 200)
    .map((e) => ({ id: e.id }));
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
  const related = filterExercises({ bodyPart: exercise.body_part, limit: 6 }).filter(
    (e) => e.id !== exercise.id,
  );

  return (
    <AppShell title="Form studio" backHref="/library">
      <div className="stack-md">
        <header>
          <h1 className="display" style={{ margin: "0 0 0.55rem", fontSize: "1.5rem" }}>
            {exercise.name}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            <Link href={`/learn/${lesson.pattern}`} className="chip chip-accent">
              {lesson.patternLabel}
            </Link>
            <Link href={`/body/${slugifyPart(exercise.body_part)}`} className="chip">
              {exercise.body_part}
            </Link>
            <span className="chip">{exercise.equipment}</span>
          </div>
        </header>

        <TeachStudio exercise={exercise} autoPlay />

        <p className="faint" style={{ fontSize: "0.75rem", margin: 0, textAlign: "center" }}>
          Media © Gym visual — gymvisual.com · Dataset: exercises-dataset
        </p>

        {related.length ? (
          <section>
            <h2 className="display" style={{ fontSize: "1.05rem", margin: "0 0 0.65rem" }}>
              Keep practicing · {exercise.body_part}
            </h2>
            <div className="stack">
              {related.map((ex) => (
                <Link
                  key={ex.id}
                  href={`/exercise/${ex.id}`}
                  className="surface surface-interactive"
                  style={{ padding: "0.85rem 1rem", fontWeight: 650 }}
                >
                  {ex.name}
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
