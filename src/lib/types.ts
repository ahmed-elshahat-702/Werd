export interface User {
  name: string;
  location: string;
}

export interface Surah {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
}

export interface Bookmark {
  id: string;
  type: "quran" | "hadith";
  title: string;
  content: string;
}

export interface ZikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  count: number;
  currentCount: number;
}

export type AzkarCategory = "morning" | "evening" | "afterPrayer" | "sleep";

export interface AppState {
  user: User;
  selectedSurah: Surah | null;
  bookmarks: Bookmark[];
  azkar: Record<AzkarCategory, ZikrItem[]>;
  setAzkar: (data: Record<AzkarCategory, ZikrItem[]>) => void;
  lastResetDate: string;
  setLastResetDate: (date: string) => void;
  incrementZikr: (category: AzkarCategory, zikrId: string) => void;
  resetZikr: (category: AzkarCategory, zikrId: string) => void;
  resetCategory: (category: AzkarCategory) => void;
  resetAllAzkar: () => void;
  isLoading: boolean;
  setIsLoading: (state: boolean) => void;
  isHandling: boolean;
  setIsHandling: (state: boolean) => void;
  misbaha: {
    count: number;
    customZikr: string;
    sessions: Array<{ zikr: string; count: number; date: string }>;
  };
  dailyVerseState: {
    surahId: number;
    ayahNumber: number;
    lastShownDate: string;
  };
  updateDailyVerseState: (
    date: string,
    surahId: number,
    ayahNumber: number
  ) => void;
  setSurah: (surah: Surah) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  incrementMisbaha: () => void;
  resetMisbaha: () => void;
  setCustomZikr: (zikr: string) => void;
  saveMisbahaSession: () => void;
  clearMisbahaSessions: () => void;
}
