import type { Program, Session } from "./types";
import type { ProgressState } from "./progress";

export type NextSessionPick = {
  program: Program;
  session: Session;
  sessionIndex: number;
  /** Why this session is recommended */
  kind: "start" | "continue" | "repeat";
};

/**
 * Pick the next guided session from local progress.
 * - No history → first Foundation (or first program) session
 * - Incomplete sessions in last program → first incomplete
 * - All complete in last program → first session of next program, else first of last
 */
export function resolveNextSession(
  progress: ProgressState,
  programs: Program[],
): NextSessionPick | null {
  if (!programs.length) return null;
  const done = new Set(progress.completedSessions);

  const lastProg =
    (progress.lastProgramId
      ? programs.find((p) => p.id === progress.lastProgramId)
      : undefined) ?? programs[0];

  const incompleteIn = (p: Program) =>
    p.sessions
      .map((session, sessionIndex) => ({ session, sessionIndex }))
      .find(({ session }) => !done.has(session.id));

  const hit = incompleteIn(lastProg);
  if (hit) {
    const kind: NextSessionPick["kind"] =
      progress.completedSessions.length === 0 && lastProg === programs[0]
        ? "start"
        : "continue";
    return { program: lastProg, session: hit.session, sessionIndex: hit.sessionIndex, kind };
  }

  const progIdx = programs.findIndex((p) => p.id === lastProg.id);
  for (let i = progIdx + 1; i < programs.length; i++) {
    const p = programs[i];
    const next = incompleteIn(p);
    if (next) {
      return { program: p, session: next.session, sessionIndex: next.sessionIndex, kind: "continue" };
    }
  }

  // Everything complete — suggest first session of last program again
  const session = lastProg.sessions[0];
  if (!session) return null;
  return { program: lastProg, session, sessionIndex: 0, kind: "repeat" };
}
