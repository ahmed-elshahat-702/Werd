import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  name: string;
  location: string;
}

interface Surah {
  id: number;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
}

interface Bookmark {
  id: string;
  type: "quran" | "hadith";
  title: string;
  content: string;
}

interface AppState {
  user: User;
  selectedSurah: Surah | null;
  selectedZikr: string;
  bookmarks: Bookmark[];
  theme: "light" | "dark";
  completedAzkar: string[];
  misbaha: {
    count: number;
    customZikr: string;
    sessions: Array<{ zikr: string; count: number; date: string }>;
  };

  dailyVerseState: {
    surahId: number;
    ayahNumber: number;
    lastShownDate: string; // in format YYYY-MM-DD
  };

  updateDailyVerseState: (
    date: string,
    surahId: number,
    ayahNumber: number
  ) => void;

  setSurah: (surah: Surah) => void;
  setZikr: (zikr: string) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  toggleTheme: () => void;
  markAzkarComplete: (azkarId: string) => void;
  incrementMisbaha: () => void;
  resetMisbaha: () => void;
  setCustomZikr: (zikr: string) => void;
  saveMisbahaSession: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        name: "أخي الكريم",
        location: "Cairo",
      },
      selectedSurah: null,
      selectedZikr: "سبحان الله",
      bookmarks: [],
      theme: "light",
      completedAzkar: [],
      misbaha: {
        count: 0,
        customZikr: "سبحان الله",
        sessions: [],
      },

      dailyVerseState: {
        surahId: 1,
        ayahNumber: 1,
        lastShownDate: "", // in format YYYY-MM-DD
      },

      updateDailyVerseState: (
        date: string,
        surahId: number,
        ayahNumber: number
      ) =>
        set({
          dailyVerseState: {
            surahId,
            ayahNumber,
            lastShownDate: date,
          },
        }),

      setSurah: (surah) => set({ selectedSurah: surah }),
      setZikr: (zikr) => set({ selectedZikr: zikr }),
      addBookmark: (bookmark) =>
        set((state) => ({
          bookmarks: [...state.bookmarks, bookmark],
        })),
      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      markAzkarComplete: (azkarId) =>
        set((state) => ({
          completedAzkar: [...state.completedAzkar, azkarId],
        })),
      incrementMisbaha: () =>
        set((state) => ({
          misbaha: { ...state.misbaha, count: state.misbaha.count + 1 },
        })),
      resetMisbaha: () =>
        set((state) => ({
          misbaha: { ...state.misbaha, count: 0 },
        })),
      setCustomZikr: (zikr) =>
        set((state) => ({
          misbaha: { ...state.misbaha, customZikr: zikr },
        })),
      saveMisbahaSession: () =>
        set((state) => ({
          misbaha: {
            ...state.misbaha,
            sessions: [
              ...state.misbaha.sessions,
              {
                zikr: state.misbaha.customZikr,
                count: state.misbaha.count,
                date: new Date().toISOString(),
              },
            ],
            count: 0,
          },
        })),
    }),
    {
      name: "werd-storage",
    }
  )
);
