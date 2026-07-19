import type { MovementPattern, TeachLesson } from "./teaching";

/** Cantonese (written 粵語) coaching copy keyed by movement pattern. */
export type YueLessonBits = {
  patternLabel: string;
  skillFocus: string;
  breathe: string;
  feel: string;
  tempo: string;
  setsRepsHint: string;
  setup: string[];
  execute: string[];
  mistakes: { bad: string; fix: string }[];
  regress: string;
  progress: string;
};

export const YUE_PATTERN: Record<MovementPattern, YueLessonBits> = {
  "push-horizontal": {
    patternLabel: "水平推",
    skillFocus: "向前／向下推嘅時候，肋骨收好，膊頭穩定唔聳起。",
    breathe: "吸氣預備 → 出力推嘅時候呼氣。",
    feel: "主要係胸同三頭出力；膊頭保持放鬆，唔好成日聳膊。",
    tempo: "3 秒落 · 停一停 · 1 秒推起",
    setsRepsHint: "3–4 組 × 6–12 下乾淨動作",
    setup: [
      "手距離大約膊頭闊少少。",
      "手腕對正手肘，膊頭夾低。",
      "全身成一直線（或者跪膝版）。",
    ],
    execute: [
      "控制落去，直至胸口接近地面／槓。",
      "手肘同身體夾大約 30–45 度，唔好完全打開。",
      "平均推起，膊頭依然收穩。",
    ],
    mistakes: [
      { bad: "腰塌落或者尻得太高", fix: "收腹夾尻，每一組前先夾實。" },
      { bad: "手肘開到 90 度", fix: "想像手掌旋入地下／槓，保持 45 度。" },
      { bad: "頸伸長向前望", fix: "頸放長，目光微微向前，唔好成日抬頭。" },
    ],
    regress: "斜板掌上壓或者靠牆掌上壓。",
    progress: "腳墊高，或者落去用 4 秒慢速。",
  },
  "push-vertical": {
    patternLabel: "垂直推",
    skillFocus: "舉過頭頂，身體挺直，核心夾實。",
    breathe: "推起之前先收腹 · 上推時呼氣。",
    feel: "膊頭帶動；尻同腹保持你唔好向後仰得誇張。",
    tempo: "2 秒落 · 順暢推上",
    setsRepsHint: "3–4 組 × 6–10 下",
    setup: [
      "握距稍闊過膊頭，手腕疊直。",
      "肋骨向下，尻輕微夾，唔好腰塌。",
      "啞鈴／槓由鎖骨高度開始。",
    ],
    execute: [
      "沿略向前嘅弧線推上，重量最終喺腳中間上空。",
      "鎖定時唔好聳膊。",
      "沿同一路徑控制落返嚟。",
    ],
    mistakes: [
      { bad: "過度向後仰", fix: "膝微彎、核心再夾、重量減啲。" },
      { bad: "頂部聳膊", fix: "膊頭向下收，頸保持長。" },
      { bad: "手肘太早向外開", fix: "前臂保持垂直喺重量下面。" },
    ],
    regress: "坐姿啞鈴推舉或者地雷推。",
    progress: "站姿嚴格推舉 · 喺視線高度停一停。",
  },
  "pull-horizontal": {
    patternLabel: "水平拉",
    skillFocus: "手肘向臀／腰位拉，胸口打開。",
    breathe: "拉嘅時候呼氣 · 伸直手臂時吸氣。",
    feel: "中背同闊背收緊；頸保持長，唔好縮頸。",
    tempo: "1 秒拉 · 1 秒夾 · 2 秒放",
    setsRepsHint: "3–4 組 × 8–12 下",
    setup: [
      "髖鉸鏈或者趴櫈，脊骨保持中立。",
      "手臂伸直，膊頭離開耳朵。",
      "握實，站立版膝微彎。",
    ],
    execute: [
      "手肘拉向腰／褲袋方向。",
      "夾肩胛骨，但唔好聳膊。",
      "每一組之間完全伸展，感受拉開。",
    ],
    mistakes: [
      { bad: "淨係用手力拉", fix: "由打開胸口開始拉。" },
      { bad: "上背圓住", fix: "胸挺起；姿勢一散就停。" },
      { bad: "借勢甩動", fix: "頂部停 1 秒先放。" },
    ],
    regress: "胸靠式划船或者彈力帶划船。",
    progress: "1.5 下划船 · 6–8 下加重。",
  },
  "pull-vertical": {
    patternLabel: "垂直拉",
    skillFocus: "手肘向下向內拉——闊背先出力，先至下巴過槓。",
    breathe: "拉上呼氣 · 落去控制吸氣。",
    feel: "先闊背，後二頭；唔好甩身借勢。",
    tempo: "1 秒拉 · 2–3 秒慢落",
    setsRepsHint: "3–5 組 × 3–8 下高質動作",
    setup: [
      "死吊開始，膊頭主動（唔好完全甩鬆）。",
      "握距揀舒服嘅；輕微收腹。",
      "腳保持靜，唔好亂踢（除非練 kipping）。",
    ],
    execute: [
      "手肘向下拉到肋骨位。",
      "下巴過槓，但唔好過度伸頸。",
      "每一組都落到完全吊直。",
    ],
    mistakes: [
      { bad: "只做到半程", fix: "每下都完全吊直；需要就用彈力帶輔助。" },
      { bad: "成身甩動", fix: "放慢落槓；膝微彎保持靜。" },
      { bad: "淨用手臂", fix: "提示「手肘入褲袋」，用背帶動。" },
    ],
    regress: "彈力帶輔助引體、腳輔助，或者反向划船。",
    progress: "下巴過槓停 · 4 秒慢落 · 加重。",
  },
  squat: {
    patternLabel: "深蹲",
    skillFocus: "髖同膝一齊出力；軀幹收穩、夠挺。",
    breathe: "頂部深吸一口氣 · 落去憋住核心 · 企起再呼氣。",
    feel: "股四頭同尻出力；腳踭貼地，膝跟住腳尖方向。",
    tempo: "3 秒落 · 有力企起",
    setsRepsHint: "3–5 組 × 5–10 下",
    setup: [
      "腳大約膊頭闊（按舒適度調）。",
      "郁之前先收腹；全腳掌踩實。",
      "槓放上背或者前架要穩。",
    ],
    execute: [
      "髖向後向下坐，膝跟住腳中線。",
      "深度：脊骨仲中立、腳踭唔離地就得。",
      "踩地企起，唔好過度後仰。",
    ],
    mistakes: [
      { bad: "膝向內塌", fix: "膝推向腳仔趾方向；減重量。" },
      { bad: "腳踭離地", fix: "站距調一調或者輕微墊高腳踭。" },
      { bad: "胸口塌落", fix: "核心再夾；到散姿勢前就企返起。" },
    ],
    regress: "箱式深蹲或者高腳杯深蹲坐櫈。",
    progress: "底部停頓 · 節奏深蹲 · 加重。",
  },
  hinge: {
    patternLabel: "髖鉸鏈",
    skillFocus: "髖向後推，膝軟，背平——練後鏈。",
    breathe: "鉸鏈前先收腹 · 企直時呼氣。",
    feel: "腘繩肌同尻先拉長再收縮——唔好淨係用腰硬扯。",
    tempo: "3 秒鉸 · 有意圖企直",
    setsRepsHint: "3–4 組 × 5–8 下",
    setup: [
      "膝軟定，但唔好變深蹲。",
      "由頭到尾骨保持中立脊。",
      "重量貼近身體（槓沿小腿上）。",
    ],
    execute: [
      "髖向後推到腘繩肌有拉感。",
      "槓路徑垂直貼身。",
      "用尻夾起身——唔好靠腰大力扯。",
    ],
    mistakes: [
      { bad: "背圓住", fix: "減少幅度；再夾核心；減重。" },
      { bad: "做成深蹲", fix: "少屈膝，多推髖向後。" },
      { bad: "槓向前甩", fix: "槓沿腿上；闊背夾住。" },
    ],
    regress: "掃把棍練髖鉸鏈 · 輕啞鈴 RDL。",
    progress: "赤字 RDL · 停頓鉸鏈 · 傳統硬拉加重。",
  },
  lunge: {
    patternLabel: "弓步／分腿",
    skillFocus: "單腳力量，軀幹靜，步幅均勻。",
    breathe: "收腹 · 前腳蹬起時呼氣。",
    feel: "前腳尻／股四頭；後膝軟；髖向前對正。",
    tempo: "2 秒落 · 蹬起",
    setsRepsHint: "3 組 × 每腳 6–10 下",
    setup: [
      "步幅夠長，兩個膝都可以大約 90 度。",
      "髖向前，軀幹挺。",
      "前腳全掌着地。",
    ],
    execute: [
      "落到後膝幾乎貼地。",
      "前膝跟住腳尖方向。",
      "用前腳踭／中掌蹬返起。",
    ],
    mistakes: [
      { bad: "前膝向內塌", fix: "膝推向腳仔趾。" },
      { bad: "步幅太細", fix: "踏遠啲，後膝真係落到。" },
      { bad: "軀幹前傾散", fix: "收腹；負重放胸口幫手感。" },
    ],
    regress: "扶牆靜態分腿蹲。",
    progress: "行弓步 · 反向弓步加重 · 赤字。",
  },
  "core-brace": {
    patternLabel: "核心穩定",
    skillFocus: "抗移動——肋骨同盤骨保持疊好。",
    breathe: "輕聲用鼻呼吸，軀幹保持硬。",
    feel: "腹同側腹維持形狀；腰唔好塌。",
    tempo: "時間張力 · 質素優先",
    setsRepsHint: "3–4 組 × 20–45 秒或者慢速下數",
    setup: [
      "肋骨向下對住盤骨——唔好挺胸散。",
      "尻輕夾；頸放長。",
      "撐點（前臂／手）踩實。",
    ],
    execute: [
      "想像推開地面，全身張力。",
      "呼吸都唔好散核心。",
      "腰一塌或者尻抬太高就停。",
    ],
    mistakes: [
      { bad: "尻太高／太低", fix: "側拍片檢查膊–尻–腳線。" },
      { bad: "成世閉氣", fix: "短而靜嘅呼吸，腹仍然硬。" },
      { bad: "淨係死撐", fix: "每一秒都主動推地。" },
    ],
    regress: "斜板平板或者 10–15 秒短持。",
    progress: "肩輕拍 · 加長時間 · 健腹輪。",
  },
  "core-flex": {
    patternLabel: "核心屈曲／旋轉",
    skillFocus: "由軀幹捲或者轉——唔好扯頸或者甩髖。",
    breathe: "捲／轉時呼氣 · 返落吸氣。",
    feel: "腹有控制地縮短；唔好借勢。",
    tempo: "2 秒捲 · 2 秒落",
    setsRepsHint: "3 組 × 10–15 下有控制",
    setup: [
      "腰輕貼地／櫈。",
      "下巴微收——手扶頭，唔好扯頸。",
      "由肋骨帶動，唔係淨係抬髖。",
    ],
    execute: [
      "順暢呼氣同時捲或者轉。",
      "最高點短停。",
      "控制落，唔好啪一聲跌返。",
    ],
    mistakes: [
      { bad: "扯住頸起身", fix: "手肘打開；眼望天花；幅度細啲。" },
      { bad: "淨用髖屈肌", fix: "細幅度；想像「肋骨去盤骨」。" },
      { bad: "太快", fix: "每下落 2 秒。" },
    ],
    regress: "死蟲式或者短幅度捲腹。",
    progress: "負重捲腹 · 懸吊抬腿慢速。",
  },
  isolation: {
    patternLabel: "孤立訓練",
    skillFocus: "一個關節做功——其他位鎖死。",
    breathe: "夾緊時呼氣 · 伸展時吸氣。",
    feel: "目標肌肉；唔好甩動或者聳膊。",
    tempo: "2 秒夾 · 2–3 秒落",
    setsRepsHint: "2–4 組 × 10–15 下",
    setup: [
      "為目標肌設穩固底座。",
      "唔應該郁嘅關節鎖好。",
      "揀可以乾淨做 10 下以上嘅重量。",
    ],
    execute: [
      "只郁目標關節，幅度痛楚範圍內盡量完整。",
      "最高點夾實目標肌。",
      "落重慢過起。",
    ],
    mistakes: [
      { bad: "借勢甩重量", fix: "減重；肘／膊固定。" },
      { bad: "成日半程", fix: "關節許可就做到全伸全夾。" },
      { bad: "重量太大", fix: "留 2 下儲備；追感覺唔好淨追數字。" },
    ],
    regress: "器械版或者更輕單邊。",
    progress: "1.5 下 · 更長離心 · 遞減組。",
  },
  cardio: {
    patternLabel: "心肺訓練",
    skillFocus: "氣喘都要保持姿勢——質素大過亂衝。",
    breathe: "搵節奏；唔好閉氣。",
    feel: "心跳上，但動作仍然認得返。",
    tempo: "順暢循環 · 落地要輕",
    setsRepsHint: "4–8 組短組或者計時間歇",
    setup: [
      "預留空間；落地盡量輕。",
      "前兩輪慢過你以為。",
      "再喘都要守住動作標準。",
    ],
    execute: [
      "用穩定節奏重複循環。",
      "落地輕，關節疊好。",
      "姿勢一散就拆組休息。",
    ],
    mistakes: [
      { bad: "落地好重／散", fix: "改踏後版，唔好亂跳。" },
      { bad: "一開始就爆完", fix: "全程均速。" },
      { bad: "閉氣", fix: "講到短句就得——講唔到就慢。" },
    ],
    regress: "低衝擊踏步版 · 休息長啲。",
    progress: "休息短啲 · 密度高啲 · 負重變化。",
  },
  calves: {
    patternLabel: "小腿",
    skillFocus: "底部完全拉長，頂部完全夾起。",
    breathe: "企起呼氣 · 落去吸氣。",
    feel: "小腿燒——唔好彈跳。",
    tempo: "1 秒起 · 2 秒拉",
    setsRepsHint: "3–4 組 × 12–20 下",
    setup: [
      "腳掌前半踩邊或者平地，腳踝郁得。",
      "按變化屈膝或者伸直膝。",
      "需要可以輕扶穩。",
    ],
    execute: [
      "完全踮起到腳尖。",
      "頂部停 1 秒。",
      "落到全拉長，唔好彈。",
    ],
    mistakes: [
      { bad: "彈跳", fix: "底部死停拉長。" },
      { bad: "幅度好細", fix: "用踏板慢落。" },
      { bad: "變成平衡表演", fix: "扶牆；練小腿唔好練甩。" },
    ],
    regress: "坐姿或者雙腳有支撐。",
    progress: "單腳 · 停頓 · 4 秒慢落。",
  },
  carry: {
    patternLabel: "負重行走",
    skillFocus: "負重行得挺——膊頭收，核心夾。",
    breathe: "握實同時穩定呼吸。",
    feel: "握力、核心、姿勢一齊做。",
    tempo: "控制每一步",
    setsRepsHint: "3–5 段 × 20–40 米",
    setup: [
      "膊頭收低；脊挺。",
      "兩邊握均勻；手臂垂側。",
      "向前望；步幅短而均。",
    ],
    execute: [
      "行嘅時候唔好側傾或者扭身。",
      "肋骨疊喺盤骨上。",
      "放低重量都要有控制。",
    ],
    mistakes: [
      { bad: "聳住膊頭孭", fix: "膊頭向下；減重。" },
      { bad: "向一邊歪", fix: "更常換手；拍片睇。" },
      { bad: "急步亂行", fix: "距離短啲；每步企穩。" },
    ],
    regress: "輕suitcase 手提 · 架上負重行。",
    progress: "更重農夫行 · 更遠 · 不對稱負重。",
  },
};

export function yueLessonOverlay(pattern: MovementPattern): YueLessonBits {
  return YUE_PATTERN[pattern];
}

export function applyYueToLesson(lesson: TeachLesson): TeachLesson {
  const y = YUE_PATTERN[lesson.pattern];
  return {
    ...lesson,
    patternLabel: y.patternLabel,
    skillFocus: y.skillFocus,
    breathe: y.breathe,
    feel: y.feel,
    tempo: y.tempo,
    setsRepsHint: y.setsRepsHint,
    setup: y.setup,
    execute: y.execute,
    mistakes: y.mistakes,
    regress: y.regress,
    progress: y.progress,
  };
}
