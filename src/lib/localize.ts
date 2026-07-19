import type { AppLangMode } from "./ui-strings";
import type { Program, Session, WorkoutExercise } from "./types";
import { LEVEL_YUE, PROGRAMS_YUE } from "./programs-yue";
import { YUE_PATTERN } from "./teaching-yue";
import type { MovementPattern } from "./teaching";
import { t, type UiKey } from "./ui-strings";

export function showEn(mode: AppLangMode) {
  return mode === "en" || mode === "both";
}

export function showYue(mode: AppLangMode) {
  return mode === "yue" || mode === "both";
}

export function pickLang(mode: AppLangMode, en: string, yue: string): string {
  if (mode === "yue") return yue || en;
  if (mode === "both") return yue ? `${en} · ${yue}` : en;
  return en;
}

export function levelLabel(level: string, mode: AppLangMode): string {
  const y = LEVEL_YUE[level] || level;
  return pickLang(mode, level, y);
}

export function localizedProgram(program: Program, mode: AppLangMode) {
  const y = PROGRAMS_YUE[program.id];
  if (!y || mode === "en") {
    return {
      title: program.title,
      tagline: program.tagline,
      description: program.description,
      equipment: program.equipment,
      level: program.level,
    };
  }
  if (mode === "yue") {
    return {
      title: y.title,
      tagline: y.tagline,
      description: y.description,
      equipment: y.equipment,
      level: y.level,
    };
  }
  return {
    title: `${program.title} · ${y.title}`,
    tagline: `${program.tagline} · ${y.tagline}`,
    description: `${program.description}\n\n${y.description}`,
    equipment: `${program.equipment} · ${y.equipment}`,
    level: `${program.level} · ${y.level}`,
  };
}

export function localizedSession(programId: string, session: Session, mode: AppLangMode) {
  const y = PROGRAMS_YUE[programId]?.sessions[session.id];
  if (!y || mode === "en") {
    return { title: session.title, focus: session.focus };
  }
  if (mode === "yue") {
    return { title: y.title, focus: y.focus };
  }
  return {
    title: `${session.title} · ${y.title}`,
    focus: `${session.focus} · ${y.focus}`,
  };
}

export function localizedCoaching(
  programId: string,
  sessionId: string,
  we: WorkoutExercise,
  mode: AppLangMode,
): string {
  const yCoach = PROGRAMS_YUE[programId]?.sessions[sessionId]?.coaching[we.exerciseId];
  if (!yCoach || mode === "en") return we.coaching;
  if (mode === "yue") return yCoach;
  return `${we.coaching}\n${yCoach}`;
}

export function localizedSetNote(
  programId: string,
  sessionId: string,
  exerciseId: string,
  setIndex: number,
  note: string | undefined,
  mode: AppLangMode,
): string | undefined {
  if (!note) return undefined;
  const key = `${exerciseId}:${setIndex}`;
  const yNote = PROGRAMS_YUE[programId]?.sessions[sessionId]?.notes[key];
  if (!yNote || mode === "en") return note;
  if (mode === "yue") return yNote;
  return `${note} · ${yNote}`;
}

export function localizedPattern(
  id: MovementPattern,
  label: string,
  skillFocus: string,
  mode: AppLangMode,
) {
  const y = YUE_PATTERN[id];
  if (!y || mode === "en") return { label, skillFocus };
  if (mode === "yue") return { label: y.patternLabel, skillFocus: y.skillFocus };
  return {
    label: `${label} · ${y.patternLabel}`,
    skillFocus: `${skillFocus} · ${y.skillFocus}`,
  };
}

export function stageBadge(i: number, level: string, mode: AppLangMode) {
  const lv = levelLabel(level, mode === "both" ? "en" : mode);
  if (mode === "yue") return `階段 ${i + 1} · ${LEVEL_YUE[level] || level}`;
  if (mode === "both") return `Stage ${i + 1} · 階段 ${i + 1} · ${level}/${LEVEL_YUE[level] || ""}`;
  return `Stage ${i + 1} · ${lv}`;
}

export function ui(mode: AppLangMode, key: UiKey) {
  return t(key, mode === "both" ? "en" : mode);
}
