"use client";

import AppHeader from "@/components/layout/app-header";
import { Input } from "@/components/ui/input";
import { SidebarInset } from "@/components/ui/sidebar";
import { useAppStore } from "@/lib/store";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import SurahCard from "./surah-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuranPage() {
  const { setIsHandling, isHandling, surahs, setSurahs } = useAppStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchSurahs = async () => {
      setIsHandling(true);
      setFetchError(false);
      try {
        const response = await fetch("https://api.alquran.cloud/v1/surah");
        const data = await response.json();

        if (data?.data?.length) {
          setSurahs(data.data);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (error) {
        console.error("Surah fetch error:", error);
        toast.error("تعذر تحميل السور. تحقق من اتصالك بالإنترنت.");
        setSurahs([]);
        setFetchError(true);
      } finally {
        setIsHandling(false);
      }
    };

    if (!surahs || surahs.length === 0) {
      fetchSurahs();
    }
  }, [surahs, setIsHandling, setSurahs]);

  function removeArabicDiacritics(text: string) {
    const arabicDiacritics =
      /[\u0610-\u061A\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g;
    return text.replace(arabicDiacritics, "");
  }

  const filteredSurahs = useMemo(() => {
    if (!searchTerm.trim()) return surahs;
    return surahs.filter(
      (surah) =>
        surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        removeArabicDiacritics(surah.name).includes(
          removeArabicDiacritics(searchTerm)
        )
    );
  }, [searchTerm, surahs]);

  if (isHandling) {
    return (
      <SidebarInset>
        <AppHeader englishText="Qur'an" arabicText="القرآن الكريم" />
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
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <AppHeader englishText="Qur'an" arabicText="القرآن الكريم" />
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
            {filteredSurahs.length === 0 ? (
              <div className="text-center text-muted-foreground arabic-text">
                لم يتم العثور على السورة
              </div>
            ) : (
              filteredSurahs.map((surah, index) => (
                <SurahCard key={surah.number} surah={surah} index={index} />
              ))
            )}
          </div>
        )}
      </div>
    </SidebarInset>
  );
}
