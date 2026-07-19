import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { WorkoutClient } from "@/components/WorkoutClient";
import { getExercisesByIds } from "@/lib/exercises";
import { getAllSessions, getSession } from "@/lib/programs";

export const dynamicParams = true;

export function generateStaticParams() {
  return getAllSessions().map(({ session }) => ({ sessionId: session.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const hit = getSession(sessionId);
  return { title: hit ? hit.session.title : "Workout" };
}

export default async function WorkoutPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const hit = getSession(sessionId);
  if (!hit) notFound();

  const { program, session } = hit;
  const exercises = getExercisesByIds(session.exercises.map((e) => e.exerciseId));

  return (
    <AppShell title={session.title} backHref={`/path/${program.id}`}>
      <WorkoutClient
        session={session}
        exercises={exercises}
        programTitle={program.title}
        programId={program.id}
      />
    </AppShell>
  );
}
