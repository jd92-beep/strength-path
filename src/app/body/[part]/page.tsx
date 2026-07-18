import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ExerciseCard } from "@/components/ExerciseCard";
import { BODY_PARTS, deslugifyPart, getBodyPart, slugifyPart } from "@/lib/body-parts";
import { filterExercises } from "@/lib/exercises";

export function generateStaticParams() {
  return BODY_PARTS.map((p) => ({ part: slugifyPart(p.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ part: string }>;
}) {
  const { part } = await params;
  const meta = getBodyPart(deslugifyPart(part));
  return { title: meta ? `${meta.label} training` : "Body part" };
}

const TEACHING: Record<string, { goal: string; tips: string[]; starter: string }> = {
  chest: {
    goal: "Build pressing power and a stable shoulder girdle.",
    tips: [
      "Master incline or knee push-ups before heavy benches.",
      "Control the eccentric — 2–3 seconds down.",
      "Pair presses with upper-back work the same week.",
    ],
    starter: "Start with push-up variations 3×/week.",
  },
  back: {
    goal: "Own your posture and pull strength.",
    tips: [
      "Think elbows to hips on rows.",
      "Full hang + full squeeze on pull-ups.",
      "Balance every push day with a pull day.",
    ],
    starter: "Inverted rows → assisted pull-ups → strict pull-ups.",
  },
  "upper legs": {
    goal: "Drive strength through squat and hinge patterns.",
    tips: [
      "Depth only as far as form stays honest.",
      "Hinge days protect the back — brace first.",
      "Lunges fix left/right imbalances.",
    ],
    starter: "Bodyweight squat + glute bridge before loaded work.",
  },
  shoulders: {
    goal: "Overhead capacity without cranky joints.",
    tips: [
      "Warm up with light raises before presses.",
      "Stop short of pain — delts love control.",
      "Include rear-delt work for balance.",
    ],
    starter: "Lateral raises + light overhead press.",
  },
  "upper arms": {
    goal: "Direct arm work after big compounds.",
    tips: [
      "Triceps drive lockout on presses.",
      "Biceps grow with full stretch and slow lowers.",
      "Don’t let ego weight ruin elbow paths.",
    ],
    starter: "Close-grip push-ups + curls twice weekly.",
  },
  waist: {
    goal: "A brace you can trust under load.",
    tips: [
      "Anti-rotation and planks beat endless crunches.",
      "Breathe out on the hard part.",
      "Train core after strength, not before heavy lifts.",
    ],
    starter: "Plank variations + dead bugs.",
  },
  "lower legs": {
    goal: "Spring, balance, and ankle integrity.",
    tips: [
      "Train both straight-knee and bent-knee raises.",
      "Full stretch at the bottom every rep.",
      "High reps (12–20) work well here.",
    ],
    starter: "Standing calf raises 3×15 after leg days.",
  },
  "lower arms": {
    goal: "Grip that survives heavy pulls.",
    tips: [
      "Farmer carries and dead hangs build transferable grip.",
      "Train wrist extensors, not only flexors.",
      "Stop if tendons complain — volume over intensity.",
    ],
    starter: "Hang from a bar 3×20–40s.",
  },
  cardio: {
    goal: "Work capacity so strength sessions feel easier.",
    tips: [
      "Use as finishers, not replacements for strength.",
      "Keep form clean when breathing hard.",
      "2 short sessions beat one death march.",
    ],
    starter: "Mountain climbers or burpees for 4–6 short sets.",
  },
  neck: {
    goal: "Supportive, low-load control only.",
    tips: [
      "Very light resistance — never yank.",
      "Slow isometrics beat aggressive reps.",
      "Skip if you have neck injuries without clearance.",
    ],
    starter: "Gentle isometrics if pain-free.",
  },
};

export default async function BodyPartPage({
  params,
}: {
  params: Promise<{ part: string }>;
}) {
  const { part } = await params;
  const bodyPart = deslugifyPart(part);
  const meta = getBodyPart(bodyPart);
  if (!meta) notFound();

  const exercises = filterExercises({ bodyPart: meta.id });
  const teach = TEACHING[meta.id];
  const bodyweight = exercises.filter((e) => e.equipment === "body weight").slice(0, 6);
  const featured = bodyweight.length ? bodyweight : exercises.slice(0, 6);

  return (
    <AppShell title={meta.label} backHref="/body">
      <div
        className="surface"
        style={{
          padding: "1.1rem",
          marginBottom: "1rem",
          borderColor: `color-mix(in oklab, ${meta.accent} 45%, var(--border))`,
          background: `linear-gradient(160deg, color-mix(in oklab, ${meta.accent} 18%, var(--surface)), var(--surface))`,
        }}
      >
        <div style={{ fontSize: "1.5rem", marginBottom: "0.35rem" }}>{meta.emoji}</div>
        <h1 className="display" style={{ margin: "0 0 0.4rem", fontSize: "1.4rem" }}>
          {meta.label} training
        </h1>
        <p className="muted" style={{ margin: 0 }}>
          {teach?.goal ?? meta.blurb}
        </p>
      </div>

      {teach ? (
        <section style={{ marginBottom: "1.25rem" }}>
          <h2 className="display" style={{ fontSize: "1.05rem", margin: "0 0 0.55rem" }}>
            How to train this area
          </h2>
          <ul style={{ margin: "0 0 0.75rem", paddingLeft: "1.15rem" }}>
            {teach.tips.map((tip) => (
              <li key={tip} className="muted" style={{ marginBottom: "0.35rem" }}>
                {tip}
              </li>
            ))}
          </ul>
          <p
            className="surface-soft"
            style={{ margin: 0, padding: "0.85rem 1rem", fontSize: "0.92rem" }}
          >
            <strong style={{ color: "var(--primary)" }}>Starter plan: </strong>
            {teach.starter}
          </p>
        </section>
      ) : null}

      <section style={{ marginBottom: "1.25rem" }}>
        <h2 className="display" style={{ fontSize: "1.05rem", margin: "0 0 0.65rem" }}>
          Good starting moves
        </h2>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {featured.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      </section>

      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "0.65rem",
          }}
        >
          <h2 className="display" style={{ fontSize: "1.05rem", margin: 0 }}>
            All {meta.label.toLowerCase()} exercises
          </h2>
          <span className="faint" style={{ fontSize: "0.8rem" }}>
            {exercises.length}
          </span>
        </div>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {exercises.slice(0, 40).map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
        {exercises.length > 40 ? (
          <p className="muted" style={{ marginTop: "0.85rem", fontSize: "0.9rem" }}>
            Showing 40 of {exercises.length}.{" "}
            <Link href={`/library?body=${encodeURIComponent(meta.id)}`} style={{ color: "var(--primary)" }}>
              Open full library filter →
            </Link>
          </p>
        ) : null}
      </section>
    </AppShell>
  );
}
