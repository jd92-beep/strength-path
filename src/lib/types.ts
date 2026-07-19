export type Exercise = {
  id: string;
  name: string;
  category: string;
  body_part: string;
  equipment: string;
  target: string;
  muscle_group: string;
  secondary_muscles: string[];
  instructions: string;
  steps: string[];
  image: string;
  gif_url: string;
  media_id: string;
  attribution: string;
};

export type LangCode =
  | "en"
  | "es"
  | "it"
  | "tr"
  | "ru"
  | "zh"
  | "hi"
  | "pl"
  | "ko"
  | "fr";

export type ExerciseI18n = {
  instructions: string;
  steps: string[];
};

export type WorkoutSet = {
  reps: string;
  note?: string;
};

export type WorkoutExercise = {
  exerciseId: string;
  sets: WorkoutSet[];
  restSec: number;
  coaching: string;
};

export type Session = {
  id: string;
  title: string;
  focus: string;
  durationMin: number;
  level: "beginner" | "intermediate" | "advanced";
  exercises: WorkoutExercise[];
};

export type Program = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  weeks: number;
  level: "beginner" | "intermediate" | "advanced";
  equipment: string;
  color: string;
  sessions: Session[];
};

export type BodyPartMeta = {
  id: string;
  label: string;
  blurb: string;
  accent: string;
  emoji: string;
};
