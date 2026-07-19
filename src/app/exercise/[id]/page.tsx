import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { MediaDemo } from "@/components/MediaDemo";
import { StepGuide } from "@/components/StepGuide";
import { slugifyPart } from "@/lib/body-parts";
import { filterExercises, getAllExercises, getExercise } from "@/lib/exercises";

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

  const related = filterExercises({ bodyPart: exercise.body_part, limit: 6 }).filter(
    (e) => e.id !== exercise.id,
  );

  return (
    <AppShell title="Form lab" backHref="/library">
      <div className="stack-md">
        <div>
          <h1 className="display" style={{ margin: "0 0 0.7rem", fontSize: "1.5rem" }}>
            {exercise.name}
          </h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            <Link href={`/body/${slugifyPart(exercise.body_part)}`} className="chip">
              {exercise.body_part}
            </Link>
            <span className="chip chip-accent">{exercise.target}</span>
            <span className="chip">{exercise.equipment}</span>
            {exercise.muscle_group ? <span className="chip">{exercise.muscle_group}</span> : null}
          </div>
        </div>

        <MediaDemo
          gifPath={exercise.gif_url}
          imagePath={exercise.image}
          alt={`${exercise.name} form demonstration`}
          autoPlay
          size="hero"
          caption="Play · pause · expand. Match the tempo you see."
        />

        <section className="surface" style={{ padding: "1.1rem" }}>
          <h2 className="display" style={{ margin: "0 0 0.85rem", fontSize: "1.08rem" }}>
            How to do it
          </h2>
          <StepGuide steps={exercise.steps} />
        </section>

        {exercise.instructions ? (
          <section className="surface-soft" style={{ padding: "1.1rem" }}>
            <h2 className="display" style={{ margin: "0 0 0.5rem", fontSize: "1.05rem" }}>
              Coach note
            </h2>
            <p className="muted" style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.55 }}>
              {exercise.instructions}
            </p>
          </section>
        ) : null}

        {exercise.secondary_muscles?.length ? (
          <p className="muted" style={{ fontSize: "0.88rem", margin: 0 }}>
            Also works: {exercise.secondary_muscles.join(", ")}
          </p>
        ) : null}

        <p className="faint" style={{ fontSize: "0.75rem", margin: 0 }}>
          Media © Gym visual — gymvisual.com · Dataset: exercises-dataset
        </p>

        {related.length ? (
          <section>
            <h2 className="display" style={{ fontSize: "1.05rem", margin: "0 0 0.65rem" }}>
              More {exercise.body_part}
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
