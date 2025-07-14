export interface User {
  name: string;
  location: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Verse[];
}

export interface Verse {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  audio: string;
  audioSecondary: string[];
}

export interface Recitation {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction: string | null;
}

// Verse with translation
export interface EnhancedVerse extends Verse {
  translation?: string;
  audioUrl?: string;
}

export interface PageData {
  number: number;
  verses: EnhancedVerse[];
}

export type ViewMode = "cards" | "mushaf";

export interface Book {
  id: number;
  bookName: string;
  writerName: string;
  aboutWriter: string | null;
  writerDeath: string;
  bookSlug: string;
}

export interface Chapter {
  id: number;
  chapterNumber: string;
  chapterEnglish: string;
  chapterUrdu: string;
  chapterArabic: string;
  bookSlug: string;
}

export interface Hadith {
  id: number;
  hadithNumber: string;
  englishNarrator: string;
  urduNarrator: string;
  hadithEnglish: string;
  hadithUrdu: string;
  hadithArabic: string;
  headingArabic: string;
  headingUrdu: string;
  headingEnglish: string;
  chapterId: string;
  bookSlug: string;
  volume: string;
  status: string;
  book: Book;
  chapter: Chapter;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface HadithsResponse {
  status: number;
  message: string;
  hadiths: {
    current_page: number;
    data: Hadith[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    links: PaginationLink[];
  };
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

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface AppState {
  user: User;
  selectedSurah: Surah | null;
  bookmarks: Bookmark[];
  azkar: Record<AzkarCategory, ZikrItem[]>;
  setAzkar: (data: Record<AzkarCategory, ZikrItem[]>) => void;
  dailyHadiths: { hadiths: Hadith[]; date: string };
  setDailyHadiths: (hadiths: Hadith[], date: string) => void;
  lastResetDate: string;
  setLastResetDate: (date: string) => void;
  prayerTimes: PrayerTimes | null;
  setPrayerTimes: (times: PrayerTimes) => void;
  location: string;
  setLocation: (location: string) => void;
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
