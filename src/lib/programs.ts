import type { Program } from "./types";

/**
 * Curated progressive paths. Exercise IDs map to the slim dataset.
 * Teaching order: pattern literacy → equipment → compounds.
 */
export const PROGRAMS: Program[] = [
  {
    id: "foundation",
    title: "Foundation",
    tagline: "Bodyweight patterns that teach real strength",
    description:
      "Three progressive full-body sessions. Learn push, squat, hinge, pull, and core control with clear form cues — no gym required.",
    weeks: 3,
    level: "beginner",
    equipment: "Body weight only",
    color: "oklch(0.72 0.16 145)",
    sessions: [
      {
        id: "foundation-a",
        title: "Session A · Push & Core",
        focus: "Push pattern + trunk stability",
        durationMin: 28,
        level: "beginner",
        exercises: [
          {
            exerciseId: "0493",
            sets: [
              { reps: "8–10", note: "Hands elevated if needed" },
              { reps: "8–10" },
              { reps: "AMRAP −2", note: "Stop 2 short of failure" },
            ],
            restSec: 60,
            coaching:
              "Lock a long spine. Lower with control. Drive the floor away on every rep.",
          },
          {
            exerciseId: "3013",
            sets: [
              { reps: "12" },
              { reps: "12" },
              { reps: "12", note: "Pause 1s at the top" },
            ],
            restSec: 45,
            coaching: "Ribs down, squeeze glutes hard at the top — not your lower back.",
          },
          {
            exerciseId: "0274",
            sets: [{ reps: "12" }, { reps: "12" }, { reps: "10–12" }],
            restSec: 40,
            coaching: "Exhale as you curl. Don’t yank the neck — chin lightly tucked.",
          },
          {
            exerciseId: "3239",
            sets: [
              { reps: "20–30s" },
              { reps: "20–30s" },
              { reps: "30–40s", note: "Slow shoulder taps" },
            ],
            restSec: 40,
            coaching: "Push the floor away. Hips level — no rocking.",
          },
          {
            exerciseId: "1373",
            sets: [{ reps: "15" }, { reps: "15" }],
            restSec: 30,
            coaching: "Full stretch at the bottom, quiet pause at the top.",
          },
        ],
      },
      {
        id: "foundation-b",
        title: "Session B · Legs & Pull",
        focus: "Squat, lunge, horizontal pull",
        durationMin: 30,
        level: "beginner",
        exercises: [
          {
            exerciseId: "1685",
            sets: [{ reps: "10" }, { reps: "10" }, { reps: "10" }],
            restSec: 60,
            coaching: "Sit hips back and down. Knees track over mid-foot. Stand tall.",
          },
          {
            exerciseId: "1460",
            sets: [
              { reps: "8/leg" },
              { reps: "8/leg" },
              { reps: "8/leg" },
            ],
            restSec: 60,
            coaching: "Long stride, front knee soft, torso upright. Switch sides evenly.",
          },
          {
            exerciseId: "0499",
            sets: [{ reps: "8–10" }, { reps: "8–10" }, { reps: "8–10" }],
            restSec: 60,
            coaching:
              "Pull chest to the bar/line. Squeeze shoulder blades. Full hang between reps.",
          },
          {
            exerciseId: "0276",
            sets: [{ reps: "8/side" }, { reps: "8/side" }],
            restSec: 40,
            coaching: "Low back pinned. Move only arms and opposite legs — slow.",
          },
          {
            exerciseId: "0630",
            sets: [{ reps: "20s" }, { reps: "20s" }, { reps: "25s" }],
            restSec: 40,
            coaching: "Hands under shoulders, hips low, quiet feet — quality over speed.",
          },
        ],
      },
      {
        id: "foundation-c",
        title: "Session C · Full-Body Flow",
        focus: "Conditioning + skill polish",
        durationMin: 32,
        level: "beginner",
        exercises: [
          {
            exerciseId: "0662",
            sets: [{ reps: "6–10" }, { reps: "6–10" }, { reps: "6–10" }],
            restSec: 60,
            coaching: "Progress from incline to floor. Elbows ~45° from torso.",
          },
          {
            exerciseId: "0514",
            sets: [{ reps: "8" }, { reps: "8" }, { reps: "8" }],
            restSec: 60,
            coaching: "Soft landing, full depth squat. Skip jumps if knees complain.",
          },
          {
            exerciseId: "0651",
            sets: [
              { reps: "3–6", note: "Or assisted / band" },
              { reps: "3–6" },
              { reps: "AMRAP clean" },
            ],
            restSec: 90,
            coaching: "Start from a dead hang. Pull elbows down. Chin over bar.",
          },
          {
            exerciseId: "3544",
            sets: [{ reps: "20s/side" }, { reps: "20s/side" }],
            restSec: 40,
            coaching: "Stack hips over heels. Lift the top hip without twisting.",
          },
          {
            exerciseId: "1160",
            sets: [{ reps: "5" }, { reps: "5" }],
            restSec: 75,
            coaching: "Smooth floor contact. Step back instead of jumping if needed.",
          },
        ],
      },
    ],
  },
  {
    id: "dumbbell-engine",
    title: "Dumbbell Engine",
    tagline: "Home or gym — one pair of dumbbells",
    description:
      "Build usable strength with presses, rows, hinges, and goblet squats. Perfect once Foundation feels easy.",
    weeks: 4,
    level: "intermediate",
    equipment: "Dumbbells",
    color: "oklch(0.7 0.15 230)",
    sessions: [
      {
        id: "db-push",
        title: "Push Day",
        focus: "Chest · shoulders · triceps",
        durationMin: 40,
        level: "intermediate",
        exercises: [
          {
            exerciseId: "0289",
            sets: [{ reps: "8" }, { reps: "8" }, { reps: "8" }, { reps: "8" }],
            restSec: 90,
            coaching: "Wrists stacked over elbows. Touch chest lightly, press evenly.",
          },
          {
            exerciseId: "0405",
            sets: [{ reps: "8–10" }, { reps: "8–10" }, { reps: "8–10" }],
            restSec: 75,
            coaching: "Brace abs. Don’t flare ribs. Path is slightly forward of the face.",
          },
          {
            exerciseId: "0334",
            sets: [{ reps: "12" }, { reps: "12" }, { reps: "12" }],
            restSec: 60,
            coaching: "Lead with elbows, soft bend, stop at shoulder height.",
          },
          {
            exerciseId: "0285",
            sets: [{ reps: "10" }, { reps: "10" }, { reps: "10" }],
            restSec: 60,
            coaching: "Elbows fixed. Curl without swinging. Lower in 2–3 seconds.",
          },
        ],
      },
      {
        id: "db-pull",
        title: "Pull Day",
        focus: "Back · rear delts · biceps",
        durationMin: 40,
        level: "intermediate",
        exercises: [
          {
            exerciseId: "0293",
            sets: [{ reps: "10" }, { reps: "10" }, { reps: "10" }],
            restSec: 75,
            coaching: "Hinge at hips, flat back. Pull elbows toward hips, not ears.",
          },
          {
            exerciseId: "0327",
            sets: [{ reps: "10" }, { reps: "10" }, { reps: "10" }],
            restSec: 60,
            coaching: "Chest on bench, squeeze at the top, control the stretch.",
          },
          {
            exerciseId: "0311",
            sets: [{ reps: "12" }, { reps: "12" }],
            restSec: 45,
            coaching: "Thumbs slightly up. No shrugging. Own the top range.",
          },
          {
            exerciseId: "0285",
            sets: [{ reps: "10–12" }, { reps: "10–12" }, { reps: "10–12" }],
            restSec: 45,
            coaching: "Finish with strict curls — no hip drive.",
          },
        ],
      },
      {
        id: "db-legs",
        title: "Legs & Hinge",
        focus: "Quads · glutes · posterior chain",
        durationMin: 42,
        level: "intermediate",
        exercises: [
          {
            exerciseId: "1760",
            sets: [{ reps: "10" }, { reps: "10" }, { reps: "10" }, { reps: "10" }],
            restSec: 90,
            coaching: "Goblet the bell at the chest. Elbows inside knees at the bottom.",
          },
          {
            exerciseId: "1459",
            sets: [{ reps: "8–10" }, { reps: "8–10" }, { reps: "8–10" }],
            restSec: 90,
            coaching: "Soft knees, push hips back, feel hamstrings. Stand by squeezing glutes.",
          },
          {
            exerciseId: "1460",
            sets: [{ reps: "8/leg" }, { reps: "8/leg" }, { reps: "8/leg" }],
            restSec: 60,
            coaching: "Optional dumbbells at sides. Knee tracks toe line.",
          },
          {
            exerciseId: "3013",
            sets: [{ reps: "15" }, { reps: "15" }],
            restSec: 45,
            coaching: "Bridge finishers — full glute squeeze every rep.",
          },
        ],
      },
    ],
  },
  {
    id: "barbell-base",
    title: "Barbell Base",
    tagline: "The big four compounds",
    description:
      "Bench, squat, deadlift, and row — the classic strength stack. Use only after you own bodyweight patterns and dumbbell control.",
    weeks: 6,
    level: "advanced",
    equipment: "Barbell + rack",
    color: "oklch(0.7 0.16 35)",
    sessions: [
      {
        id: "bb-a",
        title: "Day A · Squat Focus",
        focus: "Lower body strength",
        durationMin: 50,
        level: "advanced",
        exercises: [
          {
            exerciseId: "0043",
            sets: [
              { reps: "5", note: "Work sets — leave 1–2 in reserve" },
              { reps: "5" },
              { reps: "5" },
              { reps: "5" },
            ],
            restSec: 150,
            coaching: "Brace before unracking. Depth to crease-below-knee if mobility allows.",
          },
          {
            exerciseId: "0085",
            sets: [{ reps: "6" }, { reps: "6" }, { reps: "6" }],
            restSec: 120,
            coaching: "Romanian hinge — bar stays close, hamstrings load, no rounded back.",
          },
          {
            exerciseId: "1370",
            sets: [{ reps: "12" }, { reps: "12" }],
            restSec: 45,
            coaching: "Optional calf work after the heavy pairs.",
          },
        ],
      },
      {
        id: "bb-b",
        title: "Day B · Press Focus",
        focus: "Upper push + pull",
        durationMin: 50,
        level: "advanced",
        exercises: [
          {
            exerciseId: "0025",
            sets: [{ reps: "5" }, { reps: "5" }, { reps: "5" }, { reps: "5" }],
            restSec: 150,
            coaching: "Feet planted, slight arch OK, bar path slightly diagonal to shoulders.",
          },
          {
            exerciseId: "0027",
            sets: [{ reps: "6–8" }, { reps: "6–8" }, { reps: "6–8" }],
            restSec: 120,
            coaching: "Hinge, pull bar to lower ribs, pause, lower under control.",
          },
          {
            exerciseId: "0091",
            sets: [{ reps: "6–8" }, { reps: "6–8" }, { reps: "6–8" }],
            restSec: 90,
            coaching: "Seated overhead — brace hard, no excessive lean.",
          },
        ],
      },
      {
        id: "bb-c",
        title: "Day C · Deadlift Focus",
        focus: "Posterior chain peak",
        durationMin: 55,
        level: "advanced",
        exercises: [
          {
            exerciseId: "0032",
            sets: [
              { reps: "3–5", note: "Warm-up thoroughly first" },
              { reps: "3–5" },
              { reps: "3–5" },
            ],
            restSec: 180,
            coaching: "Bar over mid-foot, lats tight, push floor away. Reset each rep if needed.",
          },
          {
            exerciseId: "0054",
            sets: [{ reps: "6/leg" }, { reps: "6/leg" }],
            restSec: 90,
            coaching: "Controlled reverse or forward lunges with light barbell or empty bar.",
          },
          {
            exerciseId: "0472",
            sets: [{ reps: "8–12" }, { reps: "8–12" }],
            restSec: 60,
            coaching: "Core finisher — control the swing, no kipping.",
          },
        ],
      },
    ],
  },
];

export function getProgram(id: string): Program | undefined {
  return PROGRAMS.find((p) => p.id === id);
}

export function getSession(sessionId: string) {
  for (const program of PROGRAMS) {
    const session = program.sessions.find((s) => s.id === sessionId);
    if (session) return { program, session };
  }
  return undefined;
}

export function getAllSessions() {
  return PROGRAMS.flatMap((p) =>
    p.sessions.map((s) => ({ program: p, session: s })),
  );
}
