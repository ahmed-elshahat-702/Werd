"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import { Chapter, ViewMode, Verse } from "@/lib/types";
import { BookOpenCheck, Grid3X3 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CardsView from "./cards-view";

interface ChapterData {
  chapter: Chapter | null;
  verses: Verse[];
  totalPages: number | null;
  error: string | null;
  isLoading: boolean;
}

const useChapterData = (chapterId: string) => {
  const { setIsHandling, setHeaderArabicTitle, setHeaderEnglishTitle } =
    useAppStore();
  const [data, setData] = useState<ChapterData>({
    chapter: null,
    verses: [],
    totalPages: null,
    error: null,
    isLoading: false,
  });
  const [isLoadingChapter, setIsLoadingChapter] = useState(false);
  const [isLoadingVerses, setIsLoadingVerses] = useState(false);
  const [loadedPages, setLoadedPages] = useState<number[]>([]);

  const initialVersesLoaded = useRef(false);

  useEffect(() => {
    setData({
      chapter: null,
      verses: [],
      totalPages: null,
      error: null,
      isLoading: false,
    });
    setLoadedPages([]);
    initialVersesLoaded.current = false;
  }, [chapterId]);

  const fetchChapter = useCallback(async () => {
    if (!chapterId || isNaN(Number(chapterId))) {
      setData((prev) => ({ ...prev, error: "Invalid chapter ID" }));
      return;
    }

    setIsLoadingChapter(true);
    setIsHandling(true);
    try {
      const res = await fetch(`/api/quran/chapters/${chapterId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Chapter HTTP ${res.status}`);
      const chapterData = await res.json();
      if (!chapterData.chapter) throw new Error("Chapter data not found");

      setData((prev) => ({ ...prev, chapter: chapterData.chapter }));
      setHeaderArabicTitle(chapterData.chapter.name_arabic);
      setHeaderEnglishTitle(chapterData.chapter.name_simple);
    } catch (error) {
      console.error("Fetch chapter error:", error);
      setData((prev) => ({
        ...prev,
        error: "Failed to load chapter data",
      }));
      toast.error("Failed to load chapter data");
    } finally {
      setIsHandling(false);
      setIsLoadingChapter(false);
    }
  }, [chapterId, setIsHandling, setHeaderArabicTitle, setHeaderEnglishTitle]);

  const fetchVerses = useCallback(
    async (page: number, forceFetch: boolean = false) => {
      if (!chapterId || isNaN(Number(chapterId))) return;
      if (loadedPages.includes(page) && !forceFetch) {
        console.log(`Page ${page} already loaded.`);
        return;
      }

      setIsLoadingVerses(true);
      try {
        const res = await fetch(
          `/api/quran/verses/by_chapter/${chapterId}?page=${page}&per_page=5`
        );
        if (!res.ok) throw new Error(`Verses HTTP ${res.status}`);
        const versesData = await res.json();
        if (!versesData.verses) throw new Error("Verses data not found");

        const newVerses = versesData.verses.filter(
          (newVerse: Verse) =>
            !data.verses.some(
              (existingVerse) => existingVerse.id === newVerse.id
            )
        );

        setData((prev) => ({
          ...prev,
          verses: [...prev.verses, ...newVerses],
          totalPages:
            versesData.pagination?.total_pages || prev.totalPages || 1,
          error: null,
        }));
        setLoadedPages((prev) => [...prev, page]);
      } catch (error) {
        console.error("Fetch verses error:", error);
        setData((prev) => ({
          ...prev,
          error: "Failed to load verses",
        }));
        toast.error("Failed to load verses");
        // Remove failed page from loadedPages to allow retry
        setLoadedPages((prev) => prev.filter((p) => p !== page));
      } finally {
        setIsLoadingVerses(false);
      }
    },
    [chapterId, loadedPages, data.verses]
  );

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  useEffect(() => {
    if (data.chapter && !initialVersesLoaded.current && !isLoadingVerses) {
      console.log("Fetching initial verses (page 1)...");
      fetchVerses(1);
      initialVersesLoaded.current = true;
    }
  }, [data.chapter, fetchVerses, isLoadingVerses]);

  return { ...data, fetchVerses, isLoadingChapter, isLoadingVerses };
};

const ChapterContent = ({ chapterId }: { chapterId: string }) => {
  const {
    chapter,
    verses,
    totalPages,
    error,
    isLoadingChapter,
    isLoadingVerses,
    fetchVerses,
  } = useChapterData(chapterId);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentPage > 1) {
      fetchVerses(currentPage);
    }
  }, [currentPage, fetchVerses]);

  useEffect(() => {
    if (viewMode === "cards") {
      setCurrentPage(1);
    }
  }, [viewMode]);

  // Infinite scroll observer
  useEffect(() => {
    const loader = loaderRef.current;

    if (
      !loader ||
      isLoadingVerses ||
      !totalPages ||
      currentPage >= totalPages
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
          }
        }
      },
      {
        rootMargin: "400px", // Increased for earlier detection
      }
    );

    observer.observe(loader);

    // Fallback: Trigger fetch if no verses after a delay
    const timeout = setTimeout(() => {
      if (verses.length === 0 && currentPage === 1 && !isLoadingVerses) {
        fetchVerses(1, true); // Force fetch page 1
      }
    }, 2000);

    return () => {
      if (loader) observer.unobserve(loader);
      clearTimeout(timeout);
    };
  }, [isLoadingVerses, currentPage, totalPages, verses.length, fetchVerses]);

  if (error) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <Button
              onClick={() => {
                fetchVerses(currentPage, true);
              }}
              className="mt-4"
              disabled={isLoadingVerses}
            >
              {isLoadingVerses ? "Loading..." : "Retry"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoadingChapter || !chapter) {
    return (
      <div dir="rtl" className="flex-1 p-6 space-y-8">
        <Skeleton className="h-8 w-64" />
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const showBismillah = chapter.bismillah_pre;

  return (
    <div className="flex-1 min-h-screen p-6 w-full space-y-8">
      <Breadcrumb dir="rtl" className="arabic-text">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">الرئيسية</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rotate-180" />
          <BreadcrumbItem>
            <BreadcrumbLink href="/quran">القرءان الكريم</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="rotate-180" />
          <BreadcrumbItem>
            <BreadcrumbPage>{chapter.name_arabic}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card dir="rtl">
        <CardHeader>
          <div className="md:flex items-center justify-between">
            <div className="space-y-1 max-md:flex items-center justify-between">
              <CardTitle className="text-2xl">{chapter.name_arabic}</CardTitle>
              <CardDescription className="arabic-text text-xl font-semibold">
                {chapter.name_simple}
              </CardDescription>
            </div>
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as ViewMode)}
              className="w-48"
            >
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="cards" className="flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" /> Cards
                </TabsTrigger>
                <TabsTrigger value="mushaf" className="flex items-center gap-2">
                  <BookOpenCheck className="h-4 w-4" /> Mushaf
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
      </Card>
      {showBismillah && (
        <div className="text-center text-2xl arabic-text mb-6">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle className={viewMode === "cards" ? "arabic-text" : ""}>
            {viewMode === "cards" ? "الآيات" : "Mushaf View"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "cards" ? (
            <CardsView verses={verses} />
          ) : (
            <div className="text-center text-gray-500">
              Mushaf View (Coming Soon)
            </div>
          )}
        </CardContent>
      </Card>

      {viewMode === "cards" && (
        <div ref={loaderRef} className="mt-8 w-full">
          {isLoadingVerses && (
            <div className="w-full space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChapterContent;
