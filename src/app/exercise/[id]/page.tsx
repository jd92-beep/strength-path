import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { StepGuide } from "@/components/StepGuide";
import { slugifyPart } from "@/lib/body-parts";
import { filterExercises, getAllExercises, getExercise } from "@/lib/exercises";
import { gifUrl } from "@/lib/media";

export function generateStaticParams() {
  // Prebuild a useful subset for speed; remaining pages still work on demand on Vercel.
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

  const related = filterExercises({ bodyPart: exercise.body_part, limit: 6 }).filter(
    (e) => e.id !== exercise.id,
  );

  return (
    <AppShell title="Exercise" backHref="/library">
      <h1 className="display" style={{ margin: "0 0 0.65rem", fontSize: "1.45rem" }}>
        {exercise.name}
      </h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
        <Link href={`/body/${slugifyPart(exercise.body_part)}`} className="chip">
          {exercise.body_part}
        </Link>
        <span className="chip">{exercise.target}</span>
        <span className="chip">{exercise.equipment}</span>
        {exercise.muscle_group ? <span className="chip">{exercise.muscle_group}</span> : null}
      </div>

      <div className="exercise-media" style={{ marginBottom: "1rem" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gifUrl(exercise.gif_url)} alt={`${exercise.name} animation`} />
      </div>

      <section className="surface" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2 className="display" style={{ margin: "0 0 0.75rem", fontSize: "1.05rem" }}>
          How to do it
        </h2>
        <StepGuide steps={exercise.steps} />
      </section>

      {exercise.instructions ? (
        <section className="surface-soft" style={{ padding: "1rem", marginBottom: "1rem" }}>
          <h2 className="display" style={{ margin: "0 0 0.5rem", fontSize: "1.05rem" }}>
            Full coaching note
          </h2>
          <p className="muted" style={{ margin: 0, fontSize: "0.95rem" }}>
            {exercise.instructions}
          </p>
        </section>
      ) : null}

      {exercise.secondary_muscles?.length ? (
        <p className="muted" style={{ fontSize: "0.88rem" }}>
          Also works: {exercise.secondary_muscles.join(", ")}
        </p>
      ) : null}

      <p className="faint" style={{ fontSize: "0.75rem" }}>
        Media © Gym visual — gymvisual.com · Dataset: exercises-dataset
      </p>

      {related.length ? (
        <section style={{ marginTop: "1.25rem" }}>
          <h2 className="display" style={{ fontSize: "1.05rem", margin: "0 0 0.65rem" }}>
            More {exercise.body_part}
          </h2>
          <div style={{ display: "grid", gap: "0.45rem" }}>
            {related.map((ex) => (
              <Link
                key={ex.id}
                href={`/exercise/${ex.id}`}
                className="surface"
                style={{ padding: "0.75rem 0.9rem", fontWeight: 600 }}
              >
                {ex.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
