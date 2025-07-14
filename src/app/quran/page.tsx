"use client";

import AppHeader from "@/components/layout/app-header";
import { SidebarInset } from "@/components/ui/sidebar";
import { useAppStore } from "@/lib/store";
import {
  EnhancedVerse,
  PageData,
  Recitation,
  Surah,
  Verse,
  ViewMode,
} from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";
import SelectedsurahContent from "./selected-surah-content";
import SurahsSidebar from "./surahs-sidebar";

export default function QuranPage() {
  const { selectedSurah, isHandling, setSurah } = useAppStore();
  const [verses, setVerses] = useState<EnhancedVerse[]>([]);
  const [versesLoading, setVersesLoading] = useState(false);

  const [recitations, setRecitations] = useState<Recitation[]>([]);
  const [selectedRecitation, setSelectedRecitation] =
    useState<string>("ar.alafasy");
  const [recitationsLoading, setRecitationsLoading] = useState(false);

  // New states for enhanced features
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState<PageData[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  // Infinite scroll
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  // Fetch recitations on component mount
  useEffect(() => {
    setRecitationsLoading(true);
    fetch("https://api.alquran.cloud/v1/edition?format=audio")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.data) {
          setRecitations(data.data);
        }
        setRecitationsLoading(false);
      })
      .catch((error) => {
        console.error("Fetch recitations error:", error);
        setRecitations([]);
        setRecitationsLoading(false);
      });
  }, []);

  // Function to create pages from verses
  const createPagesFromVerses = (
    verses: EnhancedVerse[],
    versesPerPage: number = 10
  ) => {
    const pages: PageData[] = [];
    for (let i = 0; i < verses.length; i += versesPerPage) {
      pages.push({
        number: Math.floor(i / versesPerPage) + 1,
        verses: verses.slice(i, i + versesPerPage),
      });
    }
    return pages;
  };

  // Function to fetch verses with translation
  const fetchVersesWithTranslation = async (surahNumber: number) => {
    try {
      const [arabicResponse, translationResponse, audioResponse] =
        await Promise.all([
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.uthmani`),
          fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/en.sahih`),
          fetch(
            `https://api.alquran.cloud/v1/surah/${surahNumber}/${selectedRecitation}`
          ),
        ]);

      if (!arabicResponse.ok || !translationResponse.ok || !audioResponse.ok) {
        throw new Error("Failed to fetch surah data");
      }

      const [arabicData, translationData, audioData] = await Promise.all([
        arabicResponse.json(),
        translationResponse.json(),
        audioResponse.json(),
      ]);

      const enhancedVerses: EnhancedVerse[] = arabicData.data.ayahs.map(
        (ayah: Verse, index: number) => ({
          number: ayah.number,
          text: ayah.text,
          numberInSurah: ayah.numberInSurah,
          juz: ayah.juz,
          manzil: ayah.manzil,
          page: ayah.page,
          ruku: ayah.ruku,
          hizbQuarter: ayah.hizbQuarter,
          sajda: ayah.sajda,
          translation: translationData.data.ayahs[index]?.text || "",
          audioUrl: audioData.data.ayahs[index]?.audio || "",
        })
      );

      return enhancedVerses;
    } catch (error) {
      console.error("Error fetching verses:", error);
      return [];
    }
  };

  const handleSurahClick = async (surah: Surah) => {
    setSurah(surah);
    setVersesLoading(true);
    setCurrentPage(1);
    setPages([]);
    setHasMore(true);

    try {
      const enhancedVerses = await fetchVersesWithTranslation(surah.number);
      setVerses(enhancedVerses);

      if (viewMode === "mushaf") {
        const pagesData = createPagesFromVerses(enhancedVerses, 10);
        setPages(pagesData);
        setTotalPages(pagesData.length);
      } else {
        const firstBatch = enhancedVerses.slice(0, 10);
        setPages([{ number: 1, verses: firstBatch }]);
        setHasMore(enhancedVerses.length > 10);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setVerses([]);
    }
    setVersesLoading(false);
  };
  // Load more verses for infinite scroll
  const loadMoreVerses = useCallback(() => {
    if (loadingMore || !hasMore || !selectedSurah) return;

    setLoadingMore(true);

    setTimeout(() => {
      const nextStartIndex = pages.reduce(
        (total, page) => total + page.verses.length,
        0
      );
      const nextBatch = verses.slice(nextStartIndex, nextStartIndex + 10);

      if (nextBatch.length > 0) {
        setPages((prev) => [
          ...prev,
          { number: prev.length + 1, verses: nextBatch },
        ]);
        setHasMore(nextStartIndex + 10 < verses.length);
      } else {
        setHasMore(false);
      }

      setLoadingMore(false);
    }, 1000);
  }, [loadingMore, hasMore, selectedSurah, pages, verses]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (viewMode !== "cards") return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreVerses();
        }
      },
      { threshold: 1.0 }
    );

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [viewMode, hasMore, loadingMore, loadMoreVerses]);

  // Handle view mode change
  useEffect(() => {
    if (selectedSurah && verses.length > 0) {
      if (viewMode === "mushaf") {
        const pagesData = createPagesFromVerses(verses, 10);
        setPages(pagesData);
        setTotalPages(pagesData.length);
        setCurrentPage(1);
      } else {
        const firstBatch = verses.slice(0, 10);
        setPages([{ number: 1, verses: firstBatch }]);
        setHasMore(verses.length > 10);
      }
    }
  }, [viewMode, selectedSurah, verses]);

  if (isHandling) {
    return (
      <SidebarInset>
        <AppHeader englishText="Qur'an" arabicText="القرآن الكريم" />
        <div className="flex-1 p-6">
          <div className="text-center">Loading...</div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <AppHeader englishText="Qur'an" arabicText="القرآن الكريم" />
      <div className="flex-1 p-6 flex">
        {/* Selected Surah Content */}
        <SelectedsurahContent
          versesLoading={versesLoading}
          setSelectedRecitation={setSelectedRecitation}
          recitations={recitations}
          recitationsLoading={recitationsLoading}
          viewMode={viewMode}
          setViewMode={setViewMode}
          currentPage={currentPage}
          totalPages={totalPages}
          handleSurahClick={handleSurahClick}
          selectedRecitation={selectedRecitation}
          setCurrentPage={setCurrentPage}
          verses={verses}
          pages={pages}
          hasMore={hasMore}
          lastElementRef={lastElementRef}
          loadingMore={loadingMore}
        />

        {/* Surahs Sidebar */}
        <SurahsSidebar
          handleSurahClick={handleSurahClick}
          selectedSurah={selectedSurah}
        />
      </div>
    </SidebarInset>
  );
}
