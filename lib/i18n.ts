export type Language = "ko" | "en";

export interface Translations {
  // Common
  confirm: string;
  cancel: string;
  reroll: string;
  save: string;
  share: string;

  // Gacha
  gachaTitle: string;
  gachaSubtitle: string;
  selectPosition: string;
  findingPlayers: string;

  // Championship
  worldsChampion: string;
  msiChampion: string;
  lckChampion: string;
  lplChampion: string;
  lecChampion: string;
  lcsChampion: string;

  // Positions
  top: string;
  jungle: string;
  mid: string;
  adc: string;
  support: string;

  // Community
  community: string;
  shared: string;
  likes: string;
  comments: string;
  addComment: string;
  enterName: string;

  // Championship badge
  championshipWinner: (year: number, league: string) => string;
}

const translations: Record<Language, Translations> = {
  ko: {
    // Common
    confirm: "확인",
    cancel: "다시 뽑기",
    reroll: "다시 뽑기",
    save: "저장",
    share: "공유",

    // Gacha
    gachaTitle: "LoL 로스터 뽑기",
    gachaSubtitle: "최강의 드림팀을 만들어보세요!",
    selectPosition: "포지션을 선택하세요",
    findingPlayers: "당신의 선수를 찾았습니다!",

    // Championship
    worldsChampion: "월드 챔피언십 우승",
    msiChampion: "MSI 우승",
    lckChampion: "LCK 우승",
    lplChampion: "LPL 우승",
    lecChampion: "LEC 우승",
    lcsChampion: "LCS 우승",

    // Positions
    top: "탑",
    jungle: "정글",
    mid: "미드",
    adc: "원딜",
    support: "서포터",

    // Community
    community: "커뮤니티",
    shared: "공유",
    likes: "좋아요",
    comments: "댓글",
    addComment: "댓글 추가",
    enterName: "닉네임을 입력하세요",

    // Championship badge
    championshipWinner: (year: number, league: string) => {
      const leagueNames: Record<string, string> = {
        WORLDS: "월드 챔피언십",
        MSI: "MSI",
        LCK: "LCK",
        LPL: "LPL",
        LEC: "LEC",
        LCS: "LCS",
      };
      return `${year} ${leagueNames[league] || league} 우승`;
    },
  },
  en: {
    // Common
    confirm: "Confirm",
    cancel: "Reroll",
    reroll: "Reroll",
    save: "Save",
    share: "Share",

    // Gacha
    gachaTitle: "LoL Roster Gacha",
    gachaSubtitle: "Build your dream team!",
    selectPosition: "Select a position",
    findingPlayers: "Found your player!",

    // Championship
    worldsChampion: "Worlds Champion",
    msiChampion: "MSI Champion",
    lckChampion: "LCK Champion",
    lplChampion: "LPL Champion",
    lecChampion: "LEC Champion",
    lcsChampion: "LCS Champion",

    // Positions
    top: "Top",
    jungle: "Jungle",
    mid: "Mid",
    adc: "ADC",
    support: "Support",

    // Community
    community: "Community",
    shared: "Shared",
    likes: "Likes",
    comments: "Comments",
    addComment: "Add Comment",
    enterName: "Enter your name",

    // Championship badge
    championshipWinner: (year: number, league: string) => {
      return `${year} ${league} Champion`;
    },
  },
};

const LANGUAGE_KEY = "lol-roster-language";

export function getLanguage(): Language {
  if (typeof window === "undefined") return "ko";
  const saved = localStorage.getItem(LANGUAGE_KEY);
  return (saved as Language) || "ko";
}

export function setLanguage(lang: Language): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(LANGUAGE_KEY, lang);
  }
}

export function getTranslations(lang: Language = getLanguage()): Translations {
  return translations[lang];
}
