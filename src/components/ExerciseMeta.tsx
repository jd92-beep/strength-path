import type { ReactNode } from "react";
import type { Exercise } from "@/lib/types";
import { slugifyPart } from "@/lib/body-parts";
import Link from "next/link";

/** Surfaces every dataset field the browser can show. */
export function ExerciseMeta({ exercise }: { exercise: Exercise }) {
  const rows: { label: string; value: ReactNode }[] = [
    { label: "ID", value: exercise.id },
    {
      label: "Category",
      value: (
        <Link href={`/body/${slugifyPart(exercise.category || exercise.body_part)}`}>
          {exercise.category || exercise.body_part}
        </Link>
      ),
    },
    {
      label: "Body part",
      value: (
        <Link href={`/body/${slugifyPart(exercise.body_part)}`}>{exercise.body_part}</Link>
      ),
    },
    { label: "Target", value: exercise.target || "—" },
    { label: "Muscle group", value: exercise.muscle_group || "—" },
    {
      label: "Secondary",
      value: exercise.secondary_muscles?.length
        ? exercise.secondary_muscles.join(", ")
        : "—",
    },
    { label: "Equipment", value: exercise.equipment || "—" },
    { label: "Media ID", value: exercise.media_id || "—" },
    {
      label: "Thumbnail",
      value: <code className="meta-code">{exercise.image}</code>,
    },
    {
      label: "Animation GIF",
      value: <code className="meta-code">{exercise.gif_url}</code>,
    },
    {
      label: "Attribution",
      value: (
        <a
          href="https://gymvisual.com/"
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--primary)", fontWeight: 600 }}
        >
          {exercise.attribution || "© Gym visual — gymvisual.com"}
        </a>
      ),
    },
  ];

  return (
    <section className="meta-sheet" aria-label="Exercise dataset fields">
      <div className="meta-sheet__head">
        <h3 className="meta-sheet__title">Dataset fields</h3>
        <p className="meta-sheet__sub">
          Full record from{" "}
          <a
            href="https://github.com/hasaneyldrm/exercises-dataset"
            target="_blank"
            rel="noreferrer"
          >
            exercises-dataset
          </a>
        </p>
      </div>
      <dl className="meta-sheet__grid">
        {rows.map((row) => (
          <div key={row.label} className="meta-sheet__row">
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      {exercise.secondary_muscles?.length ? (
        <div className="muscle-row">
          <span className="muscle-row__label">Muscles</span>
          <div className="muscle-row__tags">
            <span className="muscle-tag muscle-tag--primary">{exercise.target}</span>
            {exercise.muscle_group ? (
              <span className="muscle-tag">{exercise.muscle_group}</span>
            ) : null}
            {exercise.secondary_muscles.map((m) => (
              <span key={m} className="muscle-tag muscle-tag--sec">
                {m}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
