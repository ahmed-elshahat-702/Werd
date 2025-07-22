import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppState } from "./types";

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        name: "أخي الكريم",
        location: "Cairo, Egypt",
      },
      headerArabicTitle: "",
      headerEnglishTitle: "",
      setHeaderArabicTitle: (title) => set({ headerArabicTitle: title }),
      setHeaderEnglishTitle: (title) => set({ headerEnglishTitle: title }),
      chapters: [],
      setChapters: (data) => set({ chapters: data }),
      bookmarks: [],
      azkar: { morning: [], evening: [], afterPrayer: [], sleep: [] },
      setAzkar: (data) => set({ azkar: data }),
      dailyHadiths: { hadiths: [], date: "" },
      setDailyHadiths: (hadiths, date) =>
        set({ dailyHadiths: { hadiths, date } }),
      lastResetDate: "",
      setLastResetDate: (date) => set({ lastResetDate: date }),
      prayerTimes: null,
      setPrayerTimes: (times) => set({ prayerTimes: times }),
      location: "Cairo, Egypt",
      setLocation: (location) => set({ location }),
      isLoading: false,
      setIsLoading: (state) => set({ isLoading: state }),
      isHandling: false,
      setIsHandling: (state) => set({ isHandling: state }),
      misbaha: {
        count: 0,
        customZikr: "سبحان الله",
        sessions: [],
      },
      dailyVerseState: {
        chapterId: 1,
        ayahNumber: 1,
        lastShownDate: "",
      },
      updateDailyVerseState: (date, chapterId, ayahNumber) =>
        set({
          dailyVerseState: {
            chapterId,
            ayahNumber,
            lastShownDate: date,
          },
        }),
      incrementZikr: (category, zikrId) => {
        set((state) => ({
          azkar: {
            ...state.azkar,
            [category]: state.azkar[category].map((zikr) =>
              zikr.id === zikrId && zikr.currentCount < zikr.count
                ? { ...zikr, currentCount: zikr.currentCount + 1 }
                : zikr
            ),
          },
        }));
        if ("vibrate" in navigator) navigator.vibrate(30);
      },
      resetZikr: (category, zikrId) => {
        set((state) => ({
          azkar: {
            ...state.azkar,
            [category]: state.azkar[category].map((zikr) =>
              zikr.id === zikrId ? { ...zikr, currentCount: 0 } : zikr
            ),
          },
        }));
      },
      resetCategory: (category) => {
        set((state) => ({
          azkar: {
            ...state.azkar,
            [category]: state.azkar[category].map((zikr) => ({
              ...zikr,
              currentCount: 0,
            })),
          },
        }));
      },
      resetAllAzkar: () => {
        set((state) => ({
          azkar: {
            ...state.azkar,
            morning: state.azkar.morning.map((zikr) => ({
              ...zikr,
              currentCount: 0,
            })),
            evening: state.azkar.evening.map((zikr) => ({
              ...zikr,
              currentCount: 0,
            })),
            afterPrayer: state.azkar.afterPrayer.map((zikr) => ({
              ...zikr,
              currentCount: 0,
            })),
            sleep: state.azkar.sleep.map((zikr) => ({
              ...zikr,
              currentCount: 0,
            })),
          },
          lastResetDate: new Date().toDateString(),
        }));
      },
      addBookmark: (bookmark) =>
        set((state) => ({
          bookmarks: [...state.bookmarks, bookmark],
        })),
      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
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
      clearMisbahaSessions: () =>
        set((state) => ({
          misbaha: {
            ...state.misbaha,
            sessions: [],
          },
        })),
    }),
    {
      name: "werd-storage",
      partialize: (state) => ({
        user: state.user,
        chapters: state.chapters,
        bookmarks: state.bookmarks,
        azkar: state.azkar,
        dailyHadiths: state.dailyHadiths,
        misbaha: state.misbaha,
        dailyVerseState: state.dailyVerseState,
        lastResetDate: state.lastResetDate,
        prayerTimes: state.prayerTimes,
        location: state.location,
      }),
    }
  )
);
