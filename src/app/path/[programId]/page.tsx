import { notFound } from "next/navigation";
import { ProgramPageClient } from "@/components/LocalizedPages";
import { getExercisesByIds } from "@/lib/exercises";
import { getProgram, PROGRAMS } from "@/lib/programs";

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ programId: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const { programId } = await params;
  const program = getProgram(programId);
  return { title: program?.title ?? "Program" };
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const { programId } = await params;
  const program = getProgram(programId);
  if (!program) notFound();

  const sessionsWithMoves = program.sessions.map((session) => ({
    session,
    moves: getExercisesByIds(session.exercises.map((e) => e.exerciseId)),
  }));

  return <ProgramPageClient program={program} sessionsWithMoves={sessionsWithMoves} />;
}
