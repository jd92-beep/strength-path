/** Full Cantonese (粵語) copy for programs, sessions, and in-workout coaching. */

export type ProgramYue = {
  title: string;
  tagline: string;
  description: string;
  equipment: string;
  level: string;
  sessions: Record<
    string,
    {
      title: string;
      focus: string;
      coaching: Record<string, string>;
      notes: Record<string, string>;
    }
  >;
};

export const LEVEL_YUE: Record<string, string> = {
  beginner: "初階",
  intermediate: "中階",
  advanced: "高階",
};

export const PROGRAMS_YUE: Record<string, ProgramYue> = {
  foundation: {
    title: "打好基礎",
    tagline: "用徒手動作，學識真正點用力",
    description:
      "三堂全身訓練，由淺入深。你會學點推、點蹲、點鉸鏈、點拉，同埋點用核心。屋企就練到，唔一定要去健身室。",
    equipment: "徒手（唔使器材）",
    level: "初階",
    sessions: {
      "foundation-a": {
        title: "課堂 A · 推同核心",
        focus: "推嘅模式 + 軀幹穩定",
        coaching: {
          "0493": "脊骨拉長，控制落去。每一下都想像將地面推開。",
          "3013": "肋骨向下收，頂部用力夾臀——唔好淨係靠腰發力。",
          "0274": "捲起嗰陣呼氣。唔好扯頸，下巴輕輕收埋。",
          "3239": "推開地面。髖保持水平，唔好左右搖。",
          "1373": "底部完全拉長，頂部靜靜停一停。",
        },
        notes: {
          "0493:0": "需要可以將手墊高啲",
          "0493:2": "做到差兩下就力竭就停",
          "3013:2": "頂部停一秒",
          "3239:2": "慢慢拍膊頭",
        },
      },
      "foundation-b": {
        title: "課堂 B · 腿同拉",
        focus: "深蹲、弓步、水平拉",
        coaching: {
          "1685": "髖向後向下坐，膝跟住腳中線，企返直。",
          "1460": "步幅長少少，前膝微彎，軀幹挺直。兩邊平均換。",
          "0499": "胸口拉向槓或者線，夾實肩胛。每下之間完全吊直。",
          "0276": "腰貼實，只郁手同對側腳——要慢。",
          "0630": "手喺膊頭下面，髖放低，腳步要輕——質素大過速度。",
        },
        notes: {},
      },
      "foundation-c": {
        title: "課堂 C · 全身流動",
        focus: "心肺 + 技巧打磨",
        coaching: {
          "0662": "由斜板進步到平地。手肘同身體大約 45 度。",
          "0514": "落地要輕，深蹲做夠深。膝唔舒服就唔好跳。",
          "0651": "由死吊開始，手肘向下拉，下巴過槓。",
          "3544": "髖疊喺腳踭上面。頂髖向上，唔好扭身。",
          "1160": "落地要順。需要可以用踏後代替跳。",
        },
        notes: {
          "0651:0": "可以用輔助或者彈力帶",
        },
      },
    },
  },
  "dumbbell-engine": {
    title: "啞鈴力量",
    tagline: "一對啞鈴，屋企定健身室都得",
    description:
      "練推、划、鉸鏈同高腳杯深蹲，整出日常生活用得着嘅力量。當你覺得「打好基礎」已經得心應手，就可以上嚟呢個階段。",
    equipment: "一對啞鈴",
    level: "中階",
    sessions: {
      "db-push": {
        title: "推日",
        focus: "胸 · 膊 · 三頭",
        coaching: {
          "0289": "手腕疊喺手肘上面。輕觸胸口，平均推起。",
          "0405": "收腹。肋骨唔好打開。路徑略向前過面。",
          "0334": "手肘帶動，輕微彎，到膊頭高度就停。",
          "0285": "手肘固定，唔好甩。落重用兩至三秒。",
        },
        notes: {},
      },
      "db-pull": {
        title: "拉日",
        focus: "背 · 後三角 · 二頭",
        coaching: {
          "0293": "髖鉸鏈，背保持平。手肘拉向髖，唔好拉向耳仔。",
          "0327": "胸口貼櫈，頂部夾實，控制伸展。",
          "0311": "拇指微微向上。唔好聳膊。頂部幅度要做完整。",
          "0285": "以嚴格彎舉收尾——唔好借髖力。",
        },
        notes: {},
      },
      "db-legs": {
        title: "腿同鉸鏈",
        focus: "股四頭 · 臀 · 後鏈",
        coaching: {
          "1760": "啞鈴捧喺胸口。底部手肘要喺膝入面。",
          "1459": "膝微彎，髖向後推，感覺腘繩肌。夾臀企起。",
          "1460": "可以手提啞鈴。膝跟住腳尖線。",
          "3013": "橋式收尾——每一下都夾實臀。",
        },
        notes: {},
      },
    },
  },
  "barbell-base": {
    title: "槓鈴四大項",
    tagline: "卧推、深蹲、硬拉、划船",
    description:
      "經典力量四式：卧推、深蹲、硬拉、划船。建議你已經穩陣掌握徒手同啞鈴先開始。動作質素一定要放喺重量前面。",
    equipment: "槓鈴同深蹲架",
    level: "高階",
    sessions: {
      "bb-a": {
        title: "日 A · 深蹲重點",
        focus: "下半身力量",
        coaching: {
          "0043": "出架之前先收腹。活動度夠就蹲到髖皺低過膝。",
          "0085": "羅馬尼亞鉸鏈——槓貼身，腘繩肌受力，背唔好圓。",
          "1370": "大重量之後，可以加做小腿。",
        },
        notes: {
          "0043:0": "工作組——留一兩下儲備",
        },
      },
      "bb-b": {
        title: "日 B · 推舉重點",
        focus: "上推 + 拉",
        coaching: {
          "0025": "腳踩實，輕微弓腰得，槓路徑略對膊斜上。",
          "0027": "鉸鏈，槓拉到下肋，停一停，控制落。",
          "0091": "坐姿過頭推——核心夾實，唔好過度後仰。",
        },
        notes: {},
      },
      "bb-c": {
        title: "日 C · 硬拉重點",
        focus: "後鏈高峰",
        coaching: {
          "0032": "槓喺腳中間上空，闊背夾實，推開地面。需要就每下重置。",
          "0054": "用輕槓或者空槓，控制前後弓步。",
          "0472": "核心收尾——控制擺動，唔好 kip。",
        },
        notes: {
          "0032:0": "先充分熱身",
        },
      },
    },
  },
};

export function localizeProgramText(
  programId: string,
  field: "title" | "tagline" | "description" | "equipment" | "level",
  fallback: string,
  yueMode: boolean,
) {
  if (!yueMode) return fallback;
  return PROGRAMS_YUE[programId]?.[field] ?? fallback;
}
