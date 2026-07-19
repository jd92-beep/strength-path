import Link from "next/link";
import type { Exercise } from "@/lib/types";
import { thumbUrl } from "@/lib/media";

export function ExerciseCard({
  exercise,
  featured = false,
}: {
  exercise: Exercise;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/exercise/${exercise.id}`}
      className={`surface surface-interactive ex-card ${featured ? "ex-card--featured" : ""}`.trim()}
    >
      <div className="ex-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbUrl(exercise.image)}
          alt=""
          width={featured ? 640 : 104}
          height={featured ? 440 : 104}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            background: "var(--media-canvas)",
            mixBlendMode: "multiply",
          }}
        />
        <span
          className="media-badge"
          style={{
            position: "absolute",
            left: "0.4rem",
            bottom: "0.4rem",
          }}
        >
          Demo
        </span>
      </div>
      <div className="ex-card__body">
        <div className="ex-card__title">{exercise.name}</div>
        <div className="ex-card__meta">
          {exercise.target} · {exercise.equipment}
        </div>
        <div className="ex-card__tags">
          <span className="chip" style={{ fontSize: "0.72rem" }}>
            {exercise.body_part}
          </span>
          {featured ? (
            <span className="chip chip-accent" style={{ fontSize: "0.72rem" }}>
              Tap to learn form
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
