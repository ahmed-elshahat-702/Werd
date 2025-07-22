"use client";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ChapterCard from "./chapter-card";
import { removeArabicDiacritics } from "@/lib/utils";
import { Chapter } from "@/lib/types";

const ChaptersList = () => {
  const {
    setIsHandling,
    isHandling,
    chapters,
    setChapters,
    setHeaderArabicTitle,
    setHeaderEnglishTitle,
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    setHeaderArabicTitle("القرءان الكريم");
    setHeaderEnglishTitle("Qur'an");
  }, [setHeaderArabicTitle, setHeaderEnglishTitle]);

  useEffect(() => {
    const fetchChapters = async () => {
      setIsHandling(true);
      setFetchError(false);
      try {
        const res = await fetch("/api/quran/chapters");
        if (!res.ok) {
          throw new Error("Failed to fetch chapters");
        }

        const data: { chapters: Chapter[] } = await res.json();

        if (!data.chapters || !Array.isArray(data.chapters)) {
          throw new Error("Unexpected response format");
        }

        setChapters(data.chapters);
      } catch (error) {
        console.error("Chapter fetch error:", error);
        toast.error("تعذر تحميل السور. تحقق من اتصالك بالإنترنت.");
        setChapters([]);
        setFetchError(true);
      } finally {
        setIsHandling(false);
      }
    };

    if (!chapters || chapters.length === 0) {
      fetchChapters();
    }
  }, [chapters, setIsHandling, setChapters]);

  const filteredChapters = useMemo(() => {
    if (!searchTerm.trim()) return chapters;
    return chapters.filter(
      (chapter) =>
        chapter.name_simple.toLowerCase().includes(searchTerm.toLowerCase()) ||
        removeArabicDiacritics(chapter.name_arabic).includes(
          removeArabicDiacritics(searchTerm)
        )
    );
  }, [searchTerm, chapters]);

  if (isHandling) {
    return (
      <div className="flex-1 p-6 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div
          dir="rtl"
          className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {[...Array(12)].map((_, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen p-6 w-full space-y-8">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold arabic-text">السور</h2>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            dir="rtl"
            placeholder="إبحث عن سورة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
            aria-label="ابحث عن سورة"
          />
        </div>
      </div>

      {fetchError ? (
        <div className="text-center text-red-500 arabic-text">
          حدث خطأ أثناء تحميل السور. يرجى المحاولة لاحقًا.
        </div>
      ) : (
        <div
          dir="rtl"
          className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {filteredChapters.length === 0 ? (
            <div className="text-center text-muted-foreground arabic-text">
              لم يتم العثور على السورة
            </div>
          ) : (
            filteredChapters.map((chapter, index) => (
              <ChapterCard key={chapter.id} chapter={chapter} index={index} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ChaptersList;
