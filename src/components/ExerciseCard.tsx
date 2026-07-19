import Link from "next/link";
import type { Exercise } from "@/lib/types";
import { ExercisePhoto } from "./ExercisePhoto";
import { BodyPartIcon } from "./BodyPartIcon";

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
        <ExercisePhoto
          imagePath={exercise.image}
          bodyPart={exercise.body_part}
          alt=""
          width={featured ? 720 : 112}
          height={featured ? 480 : 112}
        />
        <span className="ex-card__icon-badge" aria-hidden>
          <BodyPartIcon bodyPart={exercise.body_part} size={28} />
        </span>
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
          <span className="chip chip-with-icon">
            <BodyPartIcon bodyPart={exercise.body_part} size={16} />
            {exercise.body_part}
          </span>
          {exercise.secondary_muscles?.[0] ? (
            <span className="chip">+{exercise.secondary_muscles.length}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
