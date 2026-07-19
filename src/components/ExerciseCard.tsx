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
      className={`ex-card ${featured ? "ex-card--featured" : ""}`.trim()}
    >
      <div className="ex-card__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbUrl(exercise.image)}
          alt=""
          width={featured ? 720 : 112}
          height={featured ? 480 : 112}
          loading="lazy"
        />
        <span className="ex-card__play" aria-hidden>
          ▶
        </span>
      </div>
      <div className="ex-card__body">
        <div className="ex-card__kicker">
          <span>{exercise.target}</span>
          <span aria-hidden>·</span>
          <span>{exercise.equipment}</span>
        </div>
        <div className="ex-card__title">{exercise.name}</div>
        <div className="ex-card__tags">
          <span className="chip">{exercise.body_part}</span>
          {exercise.secondary_muscles?.[0] ? (
            <span className="chip">+{exercise.secondary_muscles.length} synergists</span>
          ) : null}
          {featured ? <span className="chip chip-accent">Open form studio</span> : null}
        </div>
      </div>
    </Link>
  );
}
