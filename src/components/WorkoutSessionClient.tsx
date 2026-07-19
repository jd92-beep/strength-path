"use client";

import { AppShell } from "@/components/AppShell";
import { WorkoutClient } from "@/components/WorkoutClient";
import type { Exercise, Session } from "@/lib/types";
import { useLocale } from "@/lib/locale";
import { localizedSession } from "@/lib/localize";

export function WorkoutSessionClient({
  session,
  exercises,
  programTitle,
  programId,
}: {
  session: Session;
  exercises: Exercise[];
  programTitle: string;
  programId: string;
}) {
  const { mode } = useLocale();
  const s = localizedSession(programId, session, mode);

  return (
    <AppShell title={s.title} backHref={`/path/${programId}`}>
      <WorkoutClient
        session={session}
        exercises={exercises}
        programTitle={programTitle}
        programId={programId}
      />
    </AppShell>
  );
}
