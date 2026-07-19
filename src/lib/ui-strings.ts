export type AppLangMode = "en" | "yue" | "both";

export type UiKey =
  | "brand"
  | "back"
  | "summary"
  | "forYou"
  | "startWorkout"
  | "seeAll"
  | "trainerTips"
  | "byBody"
  | "withDemos"
  | "search"
  | "workouts"
  | "library"
  | "formStudio"
  | "play"
  | "pause"
  | "expand"
  | "close"
  | "set"
  | "of"
  | "completeSet"
  | "nextExercise"
  | "finishWorkout"
  | "skipRestComplete"
  | "restReset"
  | "breatheReady"
  | "skipRest"
  | "openCoaching"
  | "hideCoaching"
  | "setup"
  | "ifFormBreaks"
  | "steps"
  | "fullStudio"
  | "sessionComplete"
  | "stronger"
  | "backToProgram"
  | "studyPatterns"
  | "watch"
  | "cues"
  | "fix"
  | "level"
  | "data"
  | "alsoHits"
  | "language"
  | "english"
  | "cantonese"
  | "enPlusYue"
  | "playingTap"
  | "photoTap"
  | "formPattern"
  | "featured"
  | "sessions"
  | "workoutsCount"
  | "moves"
  | "letsGo"
  | "filterDemos"
  | "bodyPart"
  | "equipment"
  | "targetMuscle"
  | "all"
  | "clear"
  | "noMatches"
  | "avoid"
  | "doThis"
  | "easier"
  | "harder"
  | "feel"
  | "breathing"
  | "starterDose"
  | "coachNote"
  | "howTo"
  | "missingData"
  | "tryAgain"
  | "patterns"
  | "formLibrary"
  | "strengthPath"
  | "guideEn"
  | "guideYue";

const en: Record<UiKey, string> = {
  brand: "Strength Path",
  back: "Back",
  summary: "Summary",
  forYou: "For You",
  startWorkout: "Start a workout",
  seeAll: "See All",
  trainerTips: "Trainer tips",
  byBody: "By body",
  withDemos: "With demos",
  search: "Search",
  workouts: "Workouts",
  library: "Library",
  formStudio: "Form studio",
  play: "Play",
  pause: "Pause",
  expand: "Expand",
  close: "Close",
  set: "Set",
  of: "of",
  completeSet: "Complete set · start rest",
  nextExercise: "Next exercise",
  finishWorkout: "Finish workout",
  skipRestComplete: "Skip rest · complete set",
  restReset: "Rest & reset",
  breatheReady: "Breathe. Next set when ready.",
  skipRest: "Skip rest",
  openCoaching: "Open coaching (cues · fixes · steps)",
  hideCoaching: "Hide coaching",
  setup: "Setup",
  ifFormBreaks: "If form breaks",
  steps: "Steps",
  fullStudio: "Full form studio →",
  sessionComplete: "Session complete",
  stronger: "Stronger than yesterday",
  backToProgram: "Back to program",
  studyPatterns: "Study patterns",
  watch: "Watch",
  cues: "Cues",
  fix: "Fix",
  level: "Level",
  data: "Data",
  alsoHits: "Also hits",
  language: "Language",
  english: "English",
  cantonese: "Cantonese",
  enPlusYue: "EN + 粵",
  playingTap: "Playing · tap to pause",
  photoTap: "Photo · tap to play",
  formPattern: "Form pattern",
  featured: "Featured",
  sessions: "sessions",
  workoutsCount: "workouts",
  moves: "moves",
  letsGo: "Let's Go",
  filterDemos: "Filter demos",
  bodyPart: "Body part",
  equipment: "Equipment",
  targetMuscle: "Target muscle",
  all: "All",
  clear: "Clear",
  noMatches: "No matches",
  avoid: "Avoid",
  doThis: "Do this",
  easier: "Easier · regress",
  harder: "Harder · progress",
  feel: "Feel",
  breathing: "Breathing",
  starterDose: "Starter dose",
  coachNote: "Coach note",
  howTo: "How to do it",
  missingData: "Missing exercise data",
  tryAgain: "Try again",
  patterns: "Patterns",
  formLibrary: "Form library",
  strengthPath: "Strength path",
  guideEn: "English guide",
  guideYue: "Cantonese guide",
};

/** Written Cantonese (粵語) UI — natural spoken/written style */
const yue: Record<UiKey, string> = {
  brand: "力量之路",
  back: "返回",
  summary: "今日概覽",
  forYou: "今日計劃",
  startWorkout: "由呢度開始練",
  seeAll: "睇晒全部",
  trainerTips: "教練小貼士",
  byBody: "按身體部位",
  withDemos: "示範動作",
  search: "搜尋",
  workouts: "訓練計劃",
  library: "動作庫",
  formStudio: "動作教學",
  play: "播放",
  pause: "暫停",
  expand: "放大",
  close: "關閉",
  set: "組",
  of: "/",
  completeSet: "完成呢組，休息一下",
  nextExercise: "下一個動作",
  finishWorkout: "完成今日訓練",
  skipRestComplete: "唔休息，直接做完呢組",
  restReset: "休息時間",
  breatheReady: "慢慢唞啖氣，準備好就繼續。",
  skipRest: "跳過休息",
  openCoaching: "打開教學提示",
  hideCoaching: "收起教學",
  setup: "預備姿勢",
  ifFormBreaks: "常見錯誤",
  steps: "步驟",
  fullStudio: "睇完整教學 →",
  sessionComplete: "做得好，今堂完啦",
  stronger: "今日又進步咗",
  backToProgram: "返返個計劃",
  studyPatterns: "學動作模式",
  watch: "睇示範",
  cues: "要點",
  fix: "改錯",
  level: "升級",
  data: "資料",
  alsoHits: "順帶練到",
  language: "語言",
  english: "English",
  cantonese: "粵語",
  enPlusYue: "中英對照",
  playingTap: "播放中，撳一下就停",
  photoTap: "撳一下播放示範",
  formPattern: "動作模式",
  featured: "今期精選",
  sessions: "堂",
  workoutsCount: "個計劃",
  moves: "個動作",
  letsGo: "即刻開始",
  filterDemos: "套用篩選",
  bodyPart: "身體部位",
  equipment: "器材",
  targetMuscle: "目標肌肉",
  all: "全部",
  clear: "清除",
  noMatches: "搵唔到相關動作",
  avoid: "避免",
  doThis: "應該咁做",
  easier: "簡單啲（退階）",
  harder: "難啲（進階）",
  feel: "應該有咩感覺",
  breathing: "呼吸",
  starterDose: "建議組數",
  coachNote: "教練補充",
  howTo: "點樣做",
  missingData: "暫時搵唔到呢個動作",
  tryAgain: "再試一次",
  patterns: "動作模式",
  formLibrary: "教學庫",
  strengthPath: "力量之路",
  guideEn: "英文說明",
  guideYue: "粵語說明",
};

export function t(key: UiKey, mode: AppLangMode): string {
  if (mode === "yue") return yue[key];
  return en[key];
}

export function tBoth(key: UiKey): { en: string; yue: string } {
  return { en: en[key], yue: yue[key] };
}

export const LANG_MODES: { id: AppLangMode; labelEn: string; labelYue: string }[] = [
  { id: "en", labelEn: "English", labelYue: "English" },
  { id: "yue", labelEn: "Cantonese", labelYue: "粵語" },
  { id: "both", labelEn: "EN + 粵", labelYue: "中英對照" },
];
