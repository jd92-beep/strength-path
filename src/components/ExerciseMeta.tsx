"use client";

import type { ReactNode } from "react";
import type { Exercise } from "@/lib/types";
import { slugifyPart } from "@/lib/body-parts";
import Link from "next/link";
import { Reveal } from "./Reveal";
import { useLocale } from "@/lib/locale";

/** Surfaces every dataset field the browser can show. */
export function ExerciseMeta({ exercise }: { exercise: Exercise }) {
  const { tr } = useLocale();
  const rows: { label: string; value: ReactNode }[] = [
    { label: "ID", value: exercise.id },
    {
      label: tr("metaCategory"),
      value: (
        <Link
          className="meta-sheet__tap"
          href={`/body/${slugifyPart(exercise.category || exercise.body_part)}`}
        >
          {exercise.category || exercise.body_part}
        </Link>
      ),
    },
    {
      label: tr("bodyPart"),
      value: (
        <Link className="meta-sheet__tap" href={`/body/${slugifyPart(exercise.body_part)}`}>
          {exercise.body_part}
        </Link>
      ),
    },
    { label: tr("targetMuscle"), value: exercise.target || "—" },
    { label: tr("metaMuscleGroup"), value: exercise.muscle_group || "—" },
    {
      label: tr("alsoHits"),
      value: exercise.secondary_muscles?.length
        ? exercise.secondary_muscles.join(", ")
        : "—",
    },
    { label: tr("equipment"), value: exercise.equipment || "—" },
    { label: tr("metaMediaId"), value: exercise.media_id || "—" },
    {
      label: tr("metaThumbnail"),
      value: <code className="meta-code">{exercise.image}</code>,
    },
    {
      label: tr("metaGif"),
      value: <code className="meta-code">{exercise.gif_url}</code>,
    },
    {
      label: tr("metaAttribution"),
      value: (
        <a
          className="meta-sheet__tap"
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
    <Reveal>
      <section className="meta-sheet" aria-label={tr("datasetFields")}>
        <div className="meta-sheet__head">
          <h3 className="meta-sheet__title">{tr("datasetFields")}</h3>
          <p className="meta-sheet__sub">
            {tr("fullRecordFrom")}{" "}
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
              <dt className="hud-label">{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        {exercise.secondary_muscles?.length ? (
          <div className="muscle-row">
            <span className="muscle-row__label hud-label">{tr("musclesTrained")}</span>
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
    </Reveal>
  );
}
