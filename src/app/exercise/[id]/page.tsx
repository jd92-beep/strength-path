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
  const related = filterExercises({ bodyPart: exercise.body_part, limit: 8 }).filter(
    (e) => e.id !== exercise.id,
  );

  return (
    <AppShell title="Form studio" backHref="/library">
      <div className="stack-lg">
        <header className="studio-head">
          <p className="studio-head__id">#{exercise.id}</p>
          <h1 className="studio-head__title">{exercise.name}</h1>
          <div className="studio-head__tags">
            <Link href={`/learn/${lesson.pattern}`} className="chip chip-accent">
              {lesson.patternLabel}
            </Link>
            <Link href={`/body/${slugifyPart(exercise.body_part)}`} className="chip">
              {exercise.body_part}
            </Link>
            <span className="chip">{exercise.equipment}</span>
            <span className="chip">target · {exercise.target}</span>
          </div>
        </header>

        <TeachStudio exercise={exercise} autoPlay />

        {related.length ? (
          <section>
            <div className="section-head">
              <h2 className="display">More {exercise.body_part}</h2>
            </div>
            <div className="related-rail">
              {related.map((ex) => (
                <Link key={ex.id} href={`/exercise/${ex.id}`} className="related-rail__item">
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
