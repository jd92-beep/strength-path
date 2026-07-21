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
  | "byMachine"
  | "machineType"
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
  | "guideYue"
  | "ringMove"
  | "ringExercise"
  | "ringStand"
  | "demoLangs"
  | "log"
  | "weight"
  | "reps"
  | "loggedSets"
  | "totalVolume"
  | "daysActive"
  | "history"
  | "historyTitle"
  | "historyEmpty"
  | "historyEmptyCta"
  | "exportCsv"
  | "exportJson"
  | "healthSync"
  | "healthSyncBlurb"
  | "musclesTrained"
  | "clearHistory"
  | "clearHistoryConfirm"
  | "trainToday"
  | "continueSession"
  | "startPath"
  | "repeatSession"
  | "min"
  | "howItFelt"
  | "rpeEasy"
  | "rpeOk"
  | "rpeHard"
  | "suggestWeight"
  | "suggestProgress"
  | "suggestDeload"
  | "suggestLast"
  | "est1RM"
  | "swapMove"
  | "noEquipment"
  | "useThis"
  | "restCue"
  | "patternFilter"
  | "programFilter"
  | "inProgram"
  | "quickSession"
  | "quickSessionBlurb"
  | "buildSession"
  | "startQuick"
  | "equipmentAny"
  | "equipmentBw"
  | "equipmentDb"
  | "pickPatterns"
  | "personalRecords"
  | "weeklyVolume"
  | "noPrsYet"
  | "bestLoad"
  | "setsLabel"
  | "nextTime"
  | "sessionSummary"
  | "totalSetsShort";

const en: Record<UiKey, string> = {
  brand: "Strength Path",
  back: "Back",
  summary: "Summary",
  forYou: "For You",
  startWorkout: "Start a workout",
  seeAll: "See all",
  trainerTips: "Trainer tips",
  byBody: "By body",
  byMachine: "By machine",
  machineType: "Machine type",
  withDemos: "With demos",
  search: "Search",
  workouts: "Workouts",
  library: "Learn",
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
  ringMove: "Move",
  ringExercise: "Exercise",
  ringStand: "Stand",
  demoLangs: "languages",
  log: "Log",
  weight: "Weight (kg)",
  reps: "Reps",
  loggedSets: "Sets logged",
  totalVolume: "Volume (kg)",
  daysActive: "Days active",
  history: "History",
  historyTitle: "Training log",
  historyEmpty: "No sets logged yet.",
  historyEmptyCta: "Finish sets in any workout and they land here automatically.",
  exportCsv: "Export CSV",
  exportJson: "Export JSON",
  healthSync: "Sync to your health app",
  healthSyncBlurb:
    "Apple Health, Google Health (Health Connect), Samsung Health, OnePlus Health and Honor Health only accept data from native phone apps — no website can write to them directly. Export your log below and import it with your favourite logging app, or keep everything here.",
  musclesTrained: "Muscles trained",
  clearHistory: "Clear history",
  clearHistoryConfirm: "Delete the whole training log on this device?",
  trainToday: "Train today",
  continueSession: "Continue your path",
  startPath: "Start your path",
  repeatSession: "Run it again",
  min: "min",
  howItFelt: "How it felt",
  rpeEasy: "Easy",
  rpeOk: "OK",
  rpeHard: "Hard",
  suggestWeight: "Suggested",
  suggestProgress: "Hit the top — try a bit heavier",
  suggestDeload: "Last time was tough — ease the load",
  suggestLast: "Last load",
  est1RM: "Est. 1RM",
  swapMove: "Swap exercise",
  noEquipment: "Missing equipment?",
  useThis: "Use this",
  restCue: "While you rest",
  patternFilter: "Pattern",
  programFilter: "Program",
  inProgram: "In this path",
  quickSession: "Quick session",
  quickSessionBlurb: "Pick movement patterns. We fill in demos, sets, and rest.",
  buildSession: "Build session",
  startQuick: "Start session",
  equipmentAny: "Any gear",
  equipmentBw: "Body weight",
  equipmentDb: "Dumbbells",
  pickPatterns: "Patterns (4–6)",
  personalRecords: "Personal records",
  weeklyVolume: "Weekly volume",
  noPrsYet: "Log weighted sets to earn PRs.",
  bestLoad: "Best load",
  setsLabel: "sets",
  nextTime: "Next time",
  sessionSummary: "Session summary",
  totalSetsShort: "sets",
};

/** Written Cantonese (粵語) UI — natural HK spoken style */
const yue: Record<UiKey, string> = {
  brand: "力量之路",
  back: "返回",
  summary: "今日概覽",
  forYou: "專為你準備",
  startWorkout: "開始訓練",
  seeAll: "睇全部",
  trainerTips: "教練貼士",
  byBody: "按部位練",
  byMachine: "按器材練",
  machineType: "器材類型",
  withDemos: "有示範嘅動作",
  search: "搵動作",
  workouts: "訓練計劃",
  library: "學動作",
  formStudio: "動作教學",
  play: "播放",
  pause: "暫停",
  expand: "放大",
  close: "關閉",
  set: "組",
  of: "/",
  completeSet: "做完呢組，開始休息",
  nextExercise: "下一個動作",
  finishWorkout: "完成今次訓練",
  skipRestComplete: "跳過休息 · 完成呢組",
  restReset: "休息時間",
  breatheReady: "慢慢唞啖氣，準備好就繼續。",
  skipRest: "跳過休息",
  openCoaching: "打開教學（要點 · 改錯 · 步驟）",
  hideCoaching: "收起教學",
  setup: "預備姿勢",
  ifFormBreaks: "常見錯誤",
  steps: "步驟",
  fullStudio: "睇完整教學 →",
  sessionComplete: "做得好！今堂完結",
  stronger: "今日又勁咗少少",
  backToProgram: "返去計劃",
  studyPatterns: "學下動作模式",
  watch: "睇示範",
  cues: "要點",
  fix: "改錯",
  level: "進退階",
  data: "資料",
  alsoHits: "順帶練到",
  language: "語言",
  english: "English",
  cantonese: "粵語",
  enPlusYue: "中英對照",
  playingTap: "播放緊 · 撳一下暫停",
  photoTap: "撳一下睇示範",
  formPattern: "動作模式",
  featured: "精選",
  sessions: "堂課",
  workoutsCount: "堂訓練",
  moves: "個動作",
  letsGo: "即刻開始",
  filterDemos: "套用篩選",
  bodyPart: "身體部位",
  equipment: "器材",
  targetMuscle: "目標肌肉",
  all: "全部",
  clear: "清除",
  noMatches: "搵唔到相關動作",
  avoid: "唔好咁做",
  doThis: "要咁做",
  easier: "簡單啲（退階）",
  harder: "難啲（進階）",
  feel: "應該有咩感覺",
  breathing: "呼吸",
  starterDose: "建議組數同次數",
  coachNote: "教練補充",
  howTo: "點樣做",
  missingData: "暫時搵唔到呢個動作",
  tryAgain: "再試一次",
  patterns: "動作模式",
  formLibrary: "教學庫",
  strengthPath: "力量之路",
  guideEn: "英文說明",
  guideYue: "粵語說明",
  ringMove: "活動",
  ringExercise: "訓練",
  ringStand: "站立",
  demoLangs: "種語言",
  log: "記錄",
  weight: "重量（公斤）",
  reps: "次數",
  loggedSets: "已記錄組數",
  totalVolume: "總訓練量（kg）",
  daysActive: "訓練日數",
  history: "紀錄",
  historyTitle: "訓練日誌",
  historyEmpty: "仲未有訓練紀錄。",
  historyEmptyCta: "喺任何訓練入面完成組數，就會自動記低喺呢度。",
  exportCsv: "匯出 CSV",
  exportJson: "匯出 JSON",
  healthSync: "同步去健康 App",
  healthSyncBlurb:
    "Apple 健康、Google 健康（Health Connect）、三星健康、OnePlus 同榮耀健康只接受手機原生 App 寫入數據——網頁係冇辦法直接同步嘅。你可以喺下面匯出訓練紀錄，再用你慣用嘅記錄 App 匯入，或者全部留喺呢度都得。",
  musclesTrained: "練到嘅肌肉",
  clearHistory: "清除紀錄",
  clearHistoryConfirm: "確定刪除呢部機上面成個訓練日誌？",
  trainToday: "今日練咩",
  continueSession: "繼續你嘅計劃",
  startPath: "開始你嘅計劃",
  repeatSession: "再練多一次",
  min: "分鐘",
  howItFelt: "呢組感覺點",
  rpeEasy: "輕鬆",
  rpeOk: "剛好",
  rpeHard: "吃力",
  suggestWeight: "建議重量",
  suggestProgress: "上次做到頂，試下加重少少",
  suggestDeload: "上次偏硬，今日輕啲",
  suggestLast: "上次重量",
  est1RM: "預估 1RM",
  swapMove: "換動作",
  noEquipment: "冇器材？",
  useThis: "用呢個",
  restCue: "休息期間",
  patternFilter: "動作模式",
  programFilter: "計劃",
  inProgram: "計劃入面嘅動作",
  quickSession: "快速組課",
  quickSessionBlurb: "揀動作模式，自動配示範、組數同休息。",
  buildSession: "組一堂",
  startQuick: "開始訓練",
  equipmentAny: "任何器材",
  equipmentBw: "徒手",
  equipmentDb: "啞鈴",
  pickPatterns: "動作模式（4–6 個）",
  personalRecords: "個人最佳",
  weeklyVolume: "每週訓練量",
  noPrsYet: "記低有重量嘅組數，就會有 PR。",
  bestLoad: "最佳重量",
  setsLabel: "組",
  nextTime: "下次",
  sessionSummary: "今堂總結",
  totalSetsShort: "組",
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
