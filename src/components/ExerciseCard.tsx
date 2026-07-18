import Link from "next/link";
import type { Exercise } from "@/lib/types";
import { thumbUrl } from "@/lib/media";

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  return (
    <Link
      href={`/exercise/${exercise.id}`}
      className="surface"
      style={{
        display: "grid",
        gridTemplateColumns: "5.25rem 1fr",
        gap: "0.75rem",
        padding: "0.65rem",
        alignItems: "center",
        transition: "transform 150ms var(--ease-out)",
      }}
    >
      <div
        style={{
          width: "5.25rem",
          height: "5.25rem",
          borderRadius: "var(--radius-sm)",
          overflow: "hidden",
          background: "oklch(1 0 0)",
          border: "1px solid var(--border)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbUrl(exercise.image)}
          alt=""
          width={84}
          height={84}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          className="display"
          style={{
            fontSize: "0.98rem",
            marginBottom: "0.25rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {exercise.name}
        </div>
        <div className="muted" style={{ fontSize: "0.8rem" }}>
          {exercise.target} · {exercise.equipment}
        </div>
        <div style={{ marginTop: "0.4rem", display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          <span className="chip" style={{ fontSize: "0.72rem" }}>
            {exercise.body_part}
          </span>
        </div>
      </div>
    </Link>
  );
}
