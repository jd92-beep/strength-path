import type { Exercise } from "./types";

/** Movement patterns drive how we teach — not just body part labels. */
export type MovementPattern =
  | "push-horizontal"
  | "push-vertical"
  | "pull-horizontal"
  | "pull-vertical"
  | "squat"
  | "hinge"
  | "lunge"
  | "core-brace"
  | "core-flex"
  | "isolation"
  | "cardio"
  | "calves"
  | "carry";

export type TeachLesson = {
  pattern: MovementPattern;
  patternLabel: string;
  skillFocus: string;
  setup: string[];
  execute: string[];
  breathe: string;
  feel: string;
  mistakes: { bad: string; fix: string }[];
  regress: string;
  progress: string;
  tempo: string;
  setsRepsHint: string;
  color: string;
};

const PATTERN_META: Record<
  MovementPattern,
  Omit<TeachLesson, "setup" | "execute" | "mistakes" | "regress" | "progress">
> = {
  "push-horizontal": {
    pattern: "push-horizontal",
    patternLabel: "Horizontal push",
    skillFocus: "Press away while ribs stay stacked and shoulders stay packed.",
    breathe: "Inhale to set the brace → exhale through the press.",
    feel: "Chest and triceps working; shoulders quiet, not shrugged.",
    tempo: "3s lower · brief pause · 1s press",
    setsRepsHint: "3–4 sets × 6–12 clean reps",
    color: "oklch(0.72 0.15 35)",
  },
  "push-vertical": {
    pattern: "push-vertical",
    patternLabel: "Vertical push",
    skillFocus: "Overhead path with a tall torso and locked-in core.",
    breathe: "Brace before the press · exhale as the load goes up.",
    feel: "Delts drive; glutes and abs keep you from leaning back.",
    tempo: "2s lower · press smooth",
    setsRepsHint: "3–4 sets × 6–10 reps",
    color: "oklch(0.72 0.14 300)",
  },
  "pull-horizontal": {
    pattern: "pull-horizontal",
    patternLabel: "Horizontal pull",
    skillFocus: "Elbows drive toward the hips; chest stays open.",
    breathe: "Exhale on the pull · inhale as arms lengthen.",
    feel: "Mid-back and lats squeeze; neck stays long.",
    tempo: "1s pull · 1s squeeze · 2s lower",
    setsRepsHint: "3–4 sets × 8–12 reps",
    color: "oklch(0.7 0.13 230)",
  },
  "pull-vertical": {
    pattern: "pull-vertical",
    patternLabel: "Vertical pull",
    skillFocus: "Pull elbows down and in — chin over the bar only after lats fire.",
    breathe: "Exhale as you pull up · controlled inhale on the way down.",
    feel: "Lats first, biceps second; no swinging.",
    tempo: "1s pull · 2–3s lower",
    setsRepsHint: "3–5 sets × 3–8 quality reps",
    color: "oklch(0.68 0.14 250)",
  },
  squat: {
    pattern: "squat",
    patternLabel: "Squat",
    skillFocus: "Hips and knees share the work; torso stays braced and tall enough.",
    breathe: "Big breath at the top · hold brace down · stand and breathe out.",
    feel: "Quads + glutes; heels planted, knees track over mid-foot.",
    tempo: "3s down · drive up",
    setsRepsHint: "3–5 sets × 5–10 reps",
    color: "oklch(0.74 0.16 145)",
  },
  hinge: {
    pattern: "hinge",
    patternLabel: "Hinge",
    skillFocus: "Push hips back, soft knees, flat back — load the posterior chain.",
    breathe: "Brace before you hinge · exhale as you stand tall.",
    feel: "Hamstrings and glutes stretch then contract — not the low back alone.",
    tempo: "3s hinge · stand with intent",
    setsRepsHint: "3–4 sets × 5–8 reps",
    color: "oklch(0.7 0.14 80)",
  },
  lunge: {
    pattern: "lunge",
    patternLabel: "Lunge / split",
    skillFocus: "Single-leg strength with a quiet torso and even steps.",
    breathe: "Brace · exhale as you drive through the front foot.",
    feel: "Front glute/quad; back knee soft; hips square.",
    tempo: "2s lower · drive up",
    setsRepsHint: "3 sets × 6–10 / leg",
    color: "oklch(0.72 0.14 160)",
  },
  "core-brace": {
    pattern: "core-brace",
    patternLabel: "Core brace",
    skillFocus: "Resist motion — keep ribs and pelvis stacked under tension.",
    breathe: "Quiet nasal breath while the trunk stays firm.",
    feel: "Abs and obliques hold shape; low back does not sag.",
    tempo: "Time under tension · quality holds",
    setsRepsHint: "3–4 sets × 20–45s or slow reps",
    color: "oklch(0.76 0.14 95)",
  },
  "core-flex": {
    pattern: "core-flex",
    patternLabel: "Core flex / rotate",
    skillFocus: "Curl or twist from the trunk — not yanking the neck or hips.",
    breathe: "Exhale on the crunch/twist · inhale to return.",
    feel: "Abs shorten under control; no momentum.",
    tempo: "2s curl · 2s lower",
    setsRepsHint: "3 sets × 10–15 controlled reps",
    color: "oklch(0.78 0.13 100)",
  },
  isolation: {
    pattern: "isolation",
    patternLabel: "Isolation",
    skillFocus: "One joint does the work — lock everything else still.",
    breathe: "Exhale on the squeeze · inhale on the stretch.",
    feel: "Target muscle only; no swinging or shrugging.",
    tempo: "2s squeeze · 2–3s lower",
    setsRepsHint: "2–4 sets × 10–15 reps",
    color: "oklch(0.72 0.16 20)",
  },
  cardio: {
    pattern: "cardio",
    patternLabel: "Conditioning",
    skillFocus: "Sustain form while breathing hard — quality over thrashing.",
    breathe: "Find a rhythm; don’t hold your breath.",
    feel: "Heart rate up, technique still recognizable.",
    tempo: "Smooth cycles · land soft",
    setsRepsHint: "4–8 short sets or timed intervals",
    color: "oklch(0.7 0.17 15)",
  },
  calves: {
    pattern: "calves",
    patternLabel: "Calves",
    skillFocus: "Full stretch at the bottom, full squeeze at the top.",
    breathe: "Exhale as you rise · inhale as you lower.",
    feel: "Burn in the calves — not bouncing off the floor.",
    tempo: "1s up · 2s stretch",
    setsRepsHint: "3–4 sets × 12–20 reps",
    color: "oklch(0.7 0.11 195)",
  },
  carry: {
    pattern: "carry",
    patternLabel: "Carry / load",
    skillFocus: "Walk tall under load — packed shoulders, braced trunk.",
    breathe: "Steady breathing while gripping hard.",
    feel: "Grip, core, and posture working together.",
    tempo: "Controlled steps",
    setsRepsHint: "3–5 carries × 20–40m",
    color: "oklch(0.68 0.1 50)",
  },
};

function nameHas(name: string, ...words: string[]) {
  const n = name.toLowerCase();
  return words.some((w) => n.includes(w));
}

export function detectPattern(ex: Exercise): MovementPattern {
  const n = ex.name.toLowerCase();
  const t = (ex.target || "").toLowerCase();
  const bp = (ex.body_part || "").toLowerCase();
  const mg = (ex.muscle_group || "").toLowerCase();

  if (bp === "cardio" || t.includes("cardiovascular") || nameHas(n, "burpee", "mountain climber", "jumping"))
    return "cardio";
  if (bp === "lower legs" || t === "calves") return "calves";
  if (nameHas(n, "deadlift", "rdl", "romanian", "good morning", "hip hinge", "kettlebell swing"))
    return "hinge";
  if (nameHas(n, "lunge", "split squat", "step-up", "step up", "bulgarian")) return "lunge";
  if (nameHas(n, "squat", "leg press", "hack squat")) return "squat";
  if (nameHas(n, "pull-up", "pull up", "chin-up", "chin up", "lat pulldown", "pulldown"))
    return "pull-vertical";
  if (nameHas(n, "row", "face pull", "rear delt")) return "pull-horizontal";
  if (nameHas(n, "overhead", "shoulder press", "military press", "push press", "jerk"))
    return "push-vertical";
  if (
    nameHas(n, "bench", "push-up", "push up", "chest press", "fly", "dip") ||
    t === "pectorals"
  )
    return "push-horizontal";
  if (
    nameHas(n, "plank", "dead bug", "pallof", "bird dog", "ab wheel") ||
    (bp === "waist" && nameHas(n, "plank", "hollow", "dead bug"))
  )
    return "core-brace";
  if (bp === "waist" || t === "abs") return "core-flex";
  if (nameHas(n, "carry", "farmer", "walk")) return "carry";
  if (bp === "back" || t.includes("lats") || t.includes("upper back")) return "pull-horizontal";
  if (bp === "shoulders" || t === "delts") return "push-vertical";
  if (bp === "upper legs" || t === "glutes" || t === "quads" || t === "hamstrings") return "squat";
  if (bp === "upper arms" || t === "biceps" || t === "triceps" || mg.includes("biceps") || mg.includes("triceps"))
    return "isolation";
  if (bp === "chest") return "push-horizontal";
  return "isolation";
}

function patternSpecific(ex: Exercise, pattern: MovementPattern): Pick<
  TeachLesson,
  "setup" | "execute" | "mistakes" | "regress" | "progress"
> {
  const equip = ex.equipment || "body weight";
  const isBw = equip === "body weight";

  switch (pattern) {
    case "push-horizontal":
      return {
        setup: [
          "Plant hands or grip slightly wider than shoulders.",
          "Stack wrists over elbows; pack shoulders down/back.",
          isBw ? "Body in one line from head to heels (or knees)." : "Feet planted, slight arch OK, glutes tight.",
        ],
        execute: [
          "Lower with control until chest is near the floor/bar.",
          "Elbows ~30–45° from the torso — not flaring to 90°.",
          "Press evenly; finish with shoulders still packed.",
        ],
        mistakes: [
          { bad: "Hips sag or pike up", fix: "Brace abs hard; squeeze glutes before each rep." },
          { bad: "Elbows flare wide", fix: "Think “screw hands into the floor/bar” and keep 45°." },
          { bad: "Neck cranes forward", fix: "Long neck; eyes slightly ahead, not up." },
        ],
        regress: isBw ? "Incline push-up on a bench or wall." : "Lighter DBs / machine chest press.",
        progress: isBw ? "Feet-elevated or slower 4-second lowers." : "Pause at the chest · add load.",
      };
    case "push-vertical":
      return {
        setup: [
          "Grip just outside shoulders; wrists stacked.",
          "Ribs down, glutes lightly squeezed — no banana back.",
          "Bar/DBs start around collarbone height.",
        ],
        execute: [
          "Press up in a slight forward arc so the load finishes over mid-foot.",
          "Lock out with biceps near ears without shrugging into traps.",
          "Lower to the start with the same path.",
        ],
        mistakes: [
          { bad: "Excessive back lean", fix: "Softer knees, stronger brace, lighter load." },
          { bad: "Shrugging finish", fix: "Keep shoulders down; finish with long neck." },
          { bad: "Flared elbows early", fix: "Forearms vertical under the load." },
        ],
        regress: "Seated DB press or landmine press.",
        progress: "Standing strict press · pause at eye level.",
      };
    case "pull-horizontal":
      return {
        setup: [
          "Hinge or set chest on bench so the spine is neutral.",
          "Arms long, shoulders away from ears.",
          "Grip firm; soft knees if standing.",
        ],
        execute: [
          "Pull elbows toward hips / back pockets.",
          "Squeeze shoulder blades without shrugging up.",
          "Lengthen fully between reps — earn the stretch.",
        ],
        mistakes: [
          { bad: "Yanking with arms only", fix: "Start the pull by “opening the chest.”" },
          { bad: "Rounded upper back", fix: "Proud chest; stop the set when form breaks." },
          { bad: "Using momentum", fix: "Pause 1s at full contraction." },
        ],
        regress: "Chest-supported row or band row.",
        progress: "1.5-rep rows · heavier sets of 6–8.",
      };
    case "pull-vertical":
      return {
        setup: [
          "Dead hang with active shoulders (not passive shrug).",
          "Grip preferred width; hollow a light brace in the abs.",
          "Legs quiet — no kipping unless trained for it.",
        ],
        execute: [
          "Drive elbows down to the ribs.",
          "Chin clears the bar without craning the neck.",
          "Lower to a full hang every rep.",
        ],
        mistakes: [
          { bad: "Half-reps at the top", fix: "Full hang every rep; use a band if needed." },
          { bad: "Swinging", fix: "Slow the eccentric; bend knees slightly and stay still." },
          { bad: "Only using biceps", fix: "Cue “elbows to pockets” and lead with the back." },
        ],
        regress: "Band-assisted pull-up, foot-assisted, or inverted row.",
        progress: "Pause chin-over-bar · slow 4s lowers · weighted.",
      };
    case "squat":
      return {
        setup: [
          "Feet about shoulder-width (adjust for comfort).",
          "Brace before you move; own the floor with whole foot.",
          equip.includes("barbell") ? "Bar sits stable on upper back or front rack." : "Arms free for balance or hold load at chest.",
        ],
        execute: [
          "Sit hips down and slightly back while knees track over mid-foot.",
          "Depth: as low as you keep a neutral spine and heels down.",
          "Drive the floor away; stand tall without hyperextending.",
        ],
        mistakes: [
          { bad: "Knees cave in", fix: "Push knees toward little toes; lighter load." },
          { bad: "Heels lift", fix: "Shorter stance or elevate heels slightly; sit between feet." },
          { bad: "Chest collapses", fix: "Big brace; stop above the breakdown point." },
        ],
        regress: "Box squat to a target or goblet squat to a chair.",
        progress: "Pause in the hole · tempo squats · add load.",
      };
    case "hinge":
      return {
        setup: [
          "Soft knees that stay soft — this is not a squat.",
          "Neutral spine from head to tailbone.",
          "Load close to the body (bar/DBs track shins).",
        ],
        execute: [
          "Push hips back until you feel hamstrings load.",
          "Keep the bar path vertical and close.",
          "Stand by squeezing glutes — don’t yank with the low back.",
        ],
        mistakes: [
          { bad: "Rounding the back", fix: "Reduce range; brace harder; lighter load." },
          { bad: "Squatting the hinge", fix: "Less knee bend; more hip travel back." },
          { bad: "Bar drifting forward", fix: "Drag the bar up the legs; lats tight." },
        ],
        regress: "Hip hinge with broomstick · DB RDL light.",
        progress: "Deficit RDL · paused hinge · conventional deadlift load.",
      };
    case "lunge":
      return {
        setup: [
          "Long enough step that both knees can bend ~90°.",
          "Hips square to the front; torso tall.",
          "Front foot fully planted.",
        ],
        execute: [
          "Lower until back knee nearly kisses the floor.",
          "Front knee tracks over mid-foot.",
          "Drive through the front heel/mid-foot to stand.",
        ],
        mistakes: [
          { bad: "Front knee collapses in", fix: "Push knee out over pinky toe." },
          { bad: "Tiny steps", fix: "Step farther; own the back knee drop." },
          { bad: "Torso collapses forward", fix: "Brace; hold load at chest for feedback." },
        ],
        regress: "Static split squat holding a wall.",
        progress: "Walking lunges · reverse lunges with load · deficit.",
      };
    case "core-brace":
      return {
        setup: [
          "Ribs down toward pelvis — no flared chest.",
          "Glutes lightly on; neck long.",
          "Own the contact points (forearms/hands/floor).",
        ],
        execute: [
          "Push the floor away to create full-body tension.",
          "Breathe without losing the brace.",
          "Stop the set when hips sag or pike.",
        ],
        mistakes: [
          { bad: "Hips too high/low", fix: "Film side-on; stack shoulders–hips–heels/knees." },
          { bad: "Holding breath forever", fix: "Short quiet breaths while abs stay firm." },
          { bad: "Only “enduring”", fix: "Actively push floor away each second." },
        ],
        regress: "Incline plank or shorter 10–15s holds.",
        progress: "Shoulder taps · longer holds · ab wheel.",
      };
    case "core-flex":
      return {
        setup: [
          "Low back supported or lightly pressed into the floor/bench.",
          "Chin slightly tucked — hands support, don’t yank.",
          "Move from the ribcage, not the hips.",
        ],
        execute: [
          "Curl or rotate with a smooth exhale.",
          "Pause briefly at peak contraction.",
          "Lower under control — no flopping.",
        ],
        mistakes: [
          { bad: "Pulling on the neck", fix: "Elbows wide; eyes to ceiling; lighter range." },
          { bad: "Using hip flexors only", fix: "Smaller range; think “ribs to pelvis.”" },
          { bad: "Rushing reps", fix: "2-second lowers every rep." },
        ],
        regress: "Dead bug or crunch with shorter range.",
        progress: "Weighted crunch · hanging leg raise slow.",
      };
    case "isolation":
      return {
        setup: [
          `Set a stable base for ${ex.target || "the target muscle"}.`,
          "Lock joints that should not move.",
          "Choose a load you can control for 10+ clean reps.",
        ],
        execute: [
          "Move only the intended joint through a full pain-free range.",
          "Squeeze the target at peak contraction.",
          "Lower slower than you lift.",
        ],
        mistakes: [
          { bad: "Swinging the weight", fix: "Reduce load; pin elbows/shoulders still." },
          { bad: "Partial range forever", fix: "Full stretch + full squeeze when joints allow." },
          { bad: "Ego weight", fix: "Leave 2 reps in reserve; chase feel, not numbers." },
        ],
        regress: "Cable/machine version or lighter unilateral work.",
        progress: "1.5 reps · longer eccentrics · drop sets.",
      };
    case "cardio":
      return {
        setup: [
          "Clear space; soft landings preferred.",
          "Start slower than you think for 2 rounds.",
          "Keep form standards even when breathing hard.",
        ],
        execute: [
          "Repeat the cycle with consistent rhythm.",
          "Land quietly; stack joints on impact.",
          "Break sets before form collapses.",
        ],
        mistakes: [
          { bad: "Sloppy landings", fix: "Step-back variations instead of jumps." },
          { bad: "All-out then crash", fix: "Even pacing across planned intervals." },
          { bad: "Breath holding", fix: "Speak a short phrase — if you can’t, slow down." },
        ],
        regress: "Low-impact step versions · longer rest.",
        progress: "Shorter rest · denser intervals · loaded variations.",
      };
    case "calves":
      return {
        setup: [
          "Ball of foot on edge or floor; ankles free to move.",
          "Knees soft or locked depending on variation (straight vs bent).",
          "Hold support lightly for balance if needed.",
        ],
        execute: [
          "Rise onto the balls of the feet fully.",
          "Pause 1s at the top.",
          "Lower into a full stretch without bouncing.",
        ],
        mistakes: [
          { bad: "Bouncing", fix: "Dead-stop stretch at the bottom." },
          { bad: "Tiny range", fix: "Slow lowers off a step." },
          { bad: "Turning it into a balance circus", fix: "Hold a wall; load the calf, not the wobble." },
        ],
        regress: "Seated or bilateral supported raises.",
        progress: "Single-leg · pause reps · slow 4s lowers.",
      };
    case "carry":
      return {
        setup: [
          "Pack shoulders; tall spine.",
          "Even grip; arms long beside the body.",
          "Eyes forward; short even steps planned.",
        ],
        execute: [
          "Walk without leaning or twisting.",
          "Keep ribs stacked over pelvis.",
          "Set the load down with control.",
        ],
        mistakes: [
          { bad: "Shrugging the load", fix: "Shoulders down; lighter weight." },
          { bad: "Leaning to one side", fix: "Switch hands more often; film yourself." },
          { bad: "Shuffling desperately", fix: "Shorter distance; own each step." },
        ],
        regress: "Suitcase carry light · rack carry.",
        progress: "Heavier farmers · longer distances · uneven loads.",
      };
    default:
      return {
        setup: ["Set a stable base.", "Brace before you move."],
        execute: ["Move with control.", "Match the demo tempo."],
        mistakes: [{ bad: "Rushing", fix: "Slow the eccentric." }],
        regress: "Reduce load or range.",
        progress: "Add load or tempo.",
      };
  }
}

export function buildLesson(ex: Exercise): TeachLesson {
  const pattern = detectPattern(ex);
  const meta = PATTERN_META[pattern];
  const specific = patternSpecific(ex, pattern);
  return { ...meta, ...specific };
}

export function patternCatalog(): {
  id: MovementPattern;
  label: string;
  skillFocus: string;
  color: string;
}[] {
  return (Object.keys(PATTERN_META) as MovementPattern[]).map((id) => ({
    id,
    label: PATTERN_META[id].patternLabel,
    skillFocus: PATTERN_META[id].skillFocus,
    color: PATTERN_META[id].color,
  }));
}

export function exercisesForPattern(all: Exercise[], pattern: MovementPattern, limit?: number) {
  const list = all.filter((e) => detectPattern(e) === pattern);
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export type PatternGroup = { bodyPart: string; exercises: Exercise[] };

/** Full catalog for a pattern, organized by body part (largest group first). */
export function groupedPattern(all: Exercise[], pattern: MovementPattern): PatternGroup[] {
  const map = new Map<string, Exercise[]>();
  for (const e of exercisesForPattern(all, pattern)) {
    const key = e.body_part || "other";
    const g = map.get(key);
    if (g) g.push(e);
    else map.set(key, [e]);
  }
  return [...map.entries()]
    .map(([bodyPart, exercises]) => ({ bodyPart, exercises }))
    .sort((a, b) => b.exercises.length - a.exercises.length);
}
