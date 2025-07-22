export interface User {
  name: string;
  location: string;
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

export interface Verse {
  id: number;
  chapter_id: number;
  verse_number: number;
  verse_key: string;
  verse_index?: number;
  text_uthmani?: string;
  text_uthmani_simple?: string;
  text_imlaei?: string;
  text_imlaei_simple?: string;
  text_indopak?: string;
  text_uthmani_tajweed?: string;
  juz_number: number;
  hizb_number: number;
  rub_number: number;
  page_number: number;
  image_url?: string;
  image_width?: number;
  v1_page?: number;
  v2_page?: number;
  audio?: AudioInfo;
  words?: Word[];
  translations?: Translation[];
  tafsirs?: Tafsir[];
  code_v1?: string;
  code_v2?: string;
}

export interface PageData {
  number: number;
  verses: Verse[];
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

export type TranslatedName = {
  language_name: string;
  name: string;
};

export interface Chapter {
  id: number;
  revelation_place: "makkah" | "madinah";
  revelation_order: number;
  bismillah_pre: boolean;
  name_simple: string;
  name_complex: string;
  name_arabic: string;
  verses_count: number;
  pages: [number, number];
  translated_name: TranslatedName;
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
  headerArabicTitle: string;
  headerEnglishTitle: string;
  setHeaderArabicTitle: (title: string) => void;
  setHeaderEnglishTitle: (title: string) => void;
  chapters: Chapter[];
  setChapters: (chapters: Chapter[]) => void;
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
    chapterId: number;
    ayahNumber: number;
    lastShownDate: string;
  };
  updateDailyVerseState: (
    date: string,
    chapterId: number,
    ayahNumber: number
  ) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  incrementMisbaha: () => void;
  resetMisbaha: () => void;
  setCustomZikr: (zikr: string) => void;
  saveMisbahaSession: () => void;
  clearMisbahaSessions: () => void;
}

// quran api types
// 🔹 Root structure for the API response
export interface VersesByChapterResponse {
  verses: Verse[];
  pagination: Pagination;
}

// 🔹 Audio metadata for the verse
export interface AudioInfo {
  url: string;
  duration: number;
  format: string;
  segments: AudioSegment[];
}

export interface AudioSegment {
  url: string;
  start_time: number;
  duration: number;
}

// 🔹 Word-level details within a verse
export interface Word {
  id?: number;
  position: number;
  verse_key?: string;
  page_number?: number;
  line_number?: number;
  audio_url: string;
  char_type_name: string;
  code_v1?: string;
  code_v2?: string;
  text_uthmani?: string;
  text_imlaei?: string;
  text_indopak?: string;
  v1_page?: number;
  v2_page?: number;

  translation: {
    text: string;
    language_name: string;
  };
  transliteration: {
    text: string;
    language_name: string;
  };
}

// 🔹 Verse-level translations
export interface Translation {
  resource_id: number;
  resource_name?: string;
  id?: number;
  text: string;
  verse_id?: number;
  language_id?: number;
  language_name?: string;
  verse_key?: string;
  chapter_id?: number;
  verse_number?: number;
  juz_number?: number;
  hizb_number?: number;
  rub_number?: number;
  page_number?: number;
}

// 🔹 Verse-level tafsir entries
export interface Tafsir {
  id: number;
  language_name: string;
  name: string;
  text: string;
}

// 🔹 Pagination info
export interface Pagination {
  per_page: number;
  current_page: number;
  next_page?: number;
  total_pages: number;
  total_records: number;
}
