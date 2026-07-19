import { notFound } from "next/navigation";
import { BodyPartPageClient } from "@/components/BodyPartPageClient";
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

const TEACHING: Record<
  string,
  { goal: string; goalYue: string; tips: string[]; tipsYue: string[]; starter: string; starterYue: string }
> = {
  chest: {
    goal: "Build pressing power and a stable shoulder girdle.",
    goalYue: "練推嘅力量，同埋穩定嘅膊帶。",
    tips: [
      "Master incline or knee push-ups before heavy benches.",
      "Control the eccentric — 2–3 seconds down.",
      "Pair presses with upper-back work the same week.",
    ],
    tipsYue: [
      "重卧推前，先練好斜板／跪膝掌上壓。",
      "落去控制——2–3 秒。",
      "同一星期要配上背拉。",
    ],
    starter: "Start with push-up variations 3×/week.",
    starterYue: "一星期 3 次由掌上壓變化開始。",
  },
  back: {
    goal: "Own your posture and pull strength.",
    goalYue: "練好姿勢同拉嘅力量。",
    tips: [
      "Think elbows to hips on rows.",
      "Full hang + full squeeze on pull-ups.",
      "Balance every push day with a pull day.",
    ],
    tipsYue: [
      "划船時想像手肘去髖。",
      "引體：完全吊直 + 頂部夾實。",
      "每個推日都要配拉日。",
    ],
    starter: "Inverted rows → assisted pull-ups → strict pull-ups.",
    starterYue: "反向划船 → 輔助引體 → 嚴格引體。",
  },
  "upper legs": {
    goal: "Drive strength through squat and hinge patterns.",
    goalYue: "用深蹲同鉸鏈模式帶動力量。",
    tips: [
      "Depth only as far as form stays honest.",
      "Hinge days protect the back — brace first.",
      "Lunges fix left/right imbalances.",
    ],
    tipsYue: [
      "深度只去到姿勢仲誠實嘅位置。",
      "鉸鏈日先保護腰——先收腹。",
      "弓步改善左右不平衡。",
    ],
    starter: "Bodyweight squat + glute bridge before loaded work.",
    starterYue: "加重前先做徒手蹲 + 尻橋。",
  },
  shoulders: {
    goal: "Overhead capacity without cranky joints.",
    goalYue: "練過頭能力，關節唔好嘈。",
    tips: [
      "Warm up with light raises before presses.",
      "Stop short of pain — delts love control.",
      "Include rear-delt work for balance.",
    ],
    tipsYue: [
      "推舉前用輕側平舉熱身。",
      "痛之前就停——三角肌鍾意控制。",
      "要加後三角保持平衡。",
    ],
    starter: "Lateral raises + light overhead press.",
    starterYue: "側平舉 + 輕過頭推。",
  },
  "upper arms": {
    goal: "Direct arm work after big compounds.",
    goalYue: "大複合動作之後再直接練手臂。",
    tips: [
      "Triceps drive lockout on presses.",
      "Biceps grow with full stretch and slow lowers.",
      "Don't let ego weight ruin elbow paths.",
    ],
    tipsYue: [
      "推嘅鎖定靠三頭。",
      "二頭要全伸 + 慢落。",
      "唔好因為重而毀咗手肘軌跡。",
    ],
    starter: "Close-grip push-ups + curls twice weekly.",
    starterYue: "窄距掌上壓 + 彎舉，一星期兩次。",
  },
  waist: {
    goal: "A brace you can trust under load.",
    goalYue: "練到負重都信得過嘅核心支撐。",
    tips: [
      "Anti-rotation and planks beat endless crunches.",
      "Breathe out on the hard part.",
      "Train core after strength, not before heavy lifts.",
    ],
    tipsYue: [
      "抗旋轉同平板好過無限捲腹。",
      "用力嗰下要呼氣。",
      "核心放力量訓練之後，唔好喺大重量前先累死。",
    ],
    starter: "Plank variations + dead bugs.",
    starterYue: "平板變化 + 死蟲式。",
  },
  "lower legs": {
    goal: "Spring, balance, and ankle integrity.",
    goalYue: "彈力、平衡同腳踝健康。",
    tips: [
      "Train both straight-knee and bent-knee raises.",
      "Full stretch at the bottom every rep.",
      "High reps (12–20) work well here.",
    ],
    tipsYue: [
      "直膝同屈膝抬踵都要練。",
      "每下底部都要全拉長。",
      "高次數（12–20）好適合。",
    ],
    starter: "Standing calf raises 3×15 after leg days.",
    starterYue: "腿日後站姿提踵 3×15。",
  },
  "lower arms": {
    goal: "Grip that survives heavy pulls.",
    goalYue: "練到大重量拉都握得住。",
    tips: [
      "Farmer carries and dead hangs build transferable grip.",
      "Train wrist extensors, not only flexors.",
      "Stop if tendons complain — volume over intensity.",
    ],
    tipsYue: [
      "農夫行同死吊最練握力。",
      "手腕伸肌都要練，唔好淨係屈。",
      "腱有意見就停——用容量大過用極重。",
    ],
    starter: "Hang from a bar 3×20–40s.",
    starterYue: "吊槓 3×20–40 秒。",
  },
  cardio: {
    goal: "Work capacity so strength sessions feel easier.",
    goalYue: "提高做功能力，力量課會輕鬆啲。",
    tips: [
      "Use as finishers, not replacements for strength.",
      "Keep form clean when breathing hard.",
      "2 short sessions beat one death march.",
    ],
    tipsYue: [
      "用嚟收尾，唔好取代力量。",
      "氣喘都要姿勢乾淨。",
      "兩堂短嘅好過一堂死撐。",
    ],
    starter: "Mountain climbers or burpees for 4–6 short sets.",
    starterYue: "登山者或者波比 4–6 短組。",
  },
  neck: {
    goal: "Supportive, low-load control only.",
    goalYue: "只做輔助、低負荷控制。",
    tips: [
      "Very light resistance — never yank.",
      "Slow isometrics beat aggressive reps.",
      "Skip if you have neck injuries without clearance.",
    ],
    tipsYue: [
      "阻力好輕——絕對唔好扯。",
      "慢速等長好過猛做。",
      "有頸傷未批准就跳過。",
    ],
    starter: "Gentle isometrics if pain-free.",
    starterYue: "無痛先做溫和等長。",
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
    <BodyPartPageClient
      partId={meta.id}
      label={meta.label}
      accent={meta.accent}
      goalEn={teach?.goal ?? meta.blurb}
      goalYue={teach?.goalYue ?? meta.blurb}
      tipsEn={teach?.tips ?? []}
      tipsYue={teach?.tipsYue ?? teach?.tips ?? []}
      starterEn={teach?.starter ?? ""}
      starterYue={teach?.starterYue ?? teach?.starter ?? ""}
      featured={featured}
      exercises={exercises}
    />
  );
}
