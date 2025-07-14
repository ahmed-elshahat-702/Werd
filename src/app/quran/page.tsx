"use client";

import AppHeader from "@/components/layout/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SidebarInset } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import { Recitation, Surah, Verse } from "@/lib/types";
import { motion } from "framer-motion";
import {
  BookOpen,
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// Interface for verse with translation
interface EnhancedVerse extends Verse {
  translation?: string;
  audioUrl?: string;
}

// Interface for page data
interface PageData {
  number: number;
  verses: EnhancedVerse[];
}

type ViewMode = "cards" | "mushaf";

export default function QuranPage() {
  const { selectedSurah, setSurah, isHandling, setIsHandling } = useAppStore();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [verses, setVerses] = useState<EnhancedVerse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [versesLoading, setVersesLoading] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [recitations, setRecitations] = useState<Recitation[]>([]);
  const [selectedRecitation, setSelectedRecitation] =
    useState<string>("ar.alafasy");
  const [recitationsLoading, setRecitationsLoading] = useState(false);

  // New states for enhanced features
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState<PageData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  // const [pageLoading, setPageLoading] = useState(false);
  const [playingVerseId, setPlayingVerseId] = useState<number | null>(null);
  const [individualAudios, setIndividualAudios] = useState<
    Map<number, HTMLAudioElement>
  >(new Map());

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

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.data) {
          setSurahs(data.data);
        }
        setIsHandling(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setSurahs([]);
        setIsHandling(false);
      });
  }, [setIsHandling]);

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
        // For cards view, load first batch
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
    }, 1000); // Simulate loading delay
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
        // Reset to first batch for cards view
        const firstBatch = verses.slice(0, 10);
        setPages([{ number: 1, verses: firstBatch }]);
        setHasMore(verses.length > 10);
      }
    }
  }, [viewMode, selectedSurah, verses]);

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setAudioPlaying(false);

    // Stop all individual audios
    individualAudios.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setIndividualAudios(new Map());
    setPlayingVerseId(null);
  };

  const playAudio = async (surahId: number) => {
    if (audioPlaying && currentAudio) {
      currentAudio.pause();
      setAudioPlaying(false);
      return;
    }

    if (currentAudio && !audioPlaying) {
      currentAudio
        .play()
        .then(() => {
          setAudioPlaying(true);
        })
        .catch(() => {
          console.log("Audio playback failed");
        });
      return;
    }

    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahId}/${selectedRecitation}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data.data.ayahs) throw new Error("No ayahs found");

      const audioUrls = data.data.ayahs.map((ayah: Verse) => ayah.audio);
      let currentIndex = 0;

      const playNext = () => {
        if (currentIndex >= audioUrls.length) {
          setAudioPlaying(false);
          setCurrentAudio(null);
          return;
        }

        const audio = new Audio(audioUrls[currentIndex]);
        setCurrentAudio(audio);
        setAudioPlaying(true);

        audio.onended = () => {
          currentIndex++;
          playNext();
        };

        audio.play().catch(() => {
          console.log("Audio playback failed for verse", currentIndex + 1);
          setAudioPlaying(false);
          setCurrentAudio(null);
        });
      };

      playNext();
    } catch (error) {
      console.error("Audio fetch error:", error);
      setAudioPlaying(false);
      setCurrentAudio(null);
    }
  };

  // Play individual verse audio
  const playIndividualVerse = (verse: EnhancedVerse) => {
    if (playingVerseId === verse.number) {
      // Stop current verse
      const audio = individualAudios.get(verse.number);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setPlayingVerseId(null);
      return;
    }

    // Stop any other playing verse
    if (playingVerseId) {
      const prevAudio = individualAudios.get(playingVerseId);
      if (prevAudio) {
        prevAudio.pause();
        prevAudio.currentTime = 0;
      }
    }

    // Stop main surah audio
    if (currentAudio) {
      currentAudio.pause();
      setAudioPlaying(false);
    }

    if (verse.audioUrl) {
      const audio = new Audio(verse.audioUrl);
      setIndividualAudios((prev) => new Map(prev).set(verse.number, audio));
      setPlayingVerseId(verse.number);

      audio.onended = () => {
        setPlayingVerseId(null);
      };

      audio.play().catch(() => {
        console.log("Individual verse audio playback failed");
        setPlayingVerseId(null);
      });
    }
  };

  const handleRecitationChange = (newRecitation: string) => {
    stopAudio();
    setSelectedRecitation(newRecitation);

    // Reload verses with new recitation if surah is selected
    if (selectedSurah) {
      handleSurahClick(selectedSurah);
    }
  };

  const getCurrentRecitationName = () => {
    const recitation = recitations.find(
      (r) => r.identifier === selectedRecitation
    );
    return recitation?.englishName || "Alafasy";
  };

  // Navigation for mushaf view
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Function to remove Arabic diacritics
  function removeArabicDiacritics(text: string) {
    const arabicDiacritics =
      /[\u0610-\u061A\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g;
    return text.replace(arabicDiacritics, "");
  }

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      removeArabicDiacritics(surah.name).includes(
        removeArabicDiacritics(searchTerm)
      )
  );

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

      <div className="flex-1 p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Surahs List */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Surahs</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search surahs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredSurahs.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  No surahs found
                </div>
              ) : (
                filteredSurahs.map((surah, index) => (
                  <motion.div
                    key={surah.number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`cursor-pointer transition-colors hover:bg-accent ${
                        selectedSurah?.number === surah.number
                          ? "bg-accent"
                          : ""
                      }`}
                      onClick={() => handleSurahClick(surah)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                              {surah.number}
                            </div>
                            <div>
                              <div className="font-medium">
                                {surah.englishName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {surah.numberOfAyahs} verses
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="arabic-text text-lg font-semibold">
                              {surah.name}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {surah.revelationType}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Selected Surah Content */}
          <div className="space-y-4">
            {selectedSurah ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedSurah.englishName}</CardTitle>
                        <CardDescription className="arabic-text text-lg">
                          {selectedSurah.name}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => playAudio(selectedSurah.number)}
                          className="misbaha-button"
                        >
                          {audioPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          onClick={stopAudio}
                          variant="outline"
                          size="default"
                          disabled={
                            !currentAudio && !audioPlaying && !playingVerseId
                          }
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Recitation
                        </label>
                        <Select
                          value={selectedRecitation}
                          onValueChange={handleRecitationChange}
                          disabled={recitationsLoading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a recitation">
                              {recitationsLoading
                                ? "Loading..."
                                : getCurrentRecitationName()}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {recitations.map((recitation) => (
                              <SelectItem
                                key={recitation.identifier}
                                value={recitation.identifier}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {recitation.englishName}
                                  </span>
                                  {recitation.name !==
                                    recitation.englishName && (
                                    <span className="text-xs text-muted-foreground arabic-text">
                                      {recitation.name}
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* View Mode Toggle */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">View Mode</label>
                        <Tabs
                          value={viewMode}
                          onValueChange={(value) =>
                            setViewMode(value as ViewMode)
                          }
                        >
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger
                              value="cards"
                              className="flex items-center gap-2"
                            >
                              <Grid3X3 className="h-4 w-4" />
                              Cards
                            </TabsTrigger>
                            <TabsTrigger
                              value="mushaf"
                              className="flex items-center gap-2"
                            >
                              <BookOpenCheck className="h-4 w-4" />
                              Mushaf
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>

                      {(audioPlaying || playingVerseId) && (
                        <div className="text-sm text-muted-foreground">
                          {audioPlaying &&
                            `Playing: ${getCurrentRecitationName()}`}
                          {playingVerseId &&
                            `Playing verse: ${
                              verses.find((v) => v.number === playingVerseId)
                                ?.numberInSurah
                            }`}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Verses Display */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>
                      {viewMode === "cards"
                        ? "Verses"
                        : `Page ${currentPage} of ${totalPages}`}
                    </CardTitle>
                    {viewMode === "mushaf" && totalPages > 1 && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          {currentPage} / {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {versesLoading ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                        Loading verses...
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {viewMode === "cards" ? (
                          // Cards View with Infinite Scroll
                          <>
                            {pages.map((page) =>
                              page.verses.map((verse, index) => (
                                <motion.div
                                  key={verse.number}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <Card className="p-4">
                                    <div className="space-y-4">
                                      <div className="flex items-center justify-between">
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          Verse {verse.numberInSurah}
                                        </Badge>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() =>
                                            playIndividualVerse(verse)
                                          }
                                          className="h-8 w-8 p-0"
                                        >
                                          {playingVerseId === verse.number ? (
                                            <Pause className="h-4 w-4" />
                                          ) : (
                                            <Play className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </div>
                                      <div className="arabic-text text-xl leading-relaxed">
                                        {verse.text}
                                      </div>
                                      {verse.translation && (
                                        <div className="text-sm text-muted-foreground border-l-2 border-muted pl-4">
                                          {verse.translation}
                                        </div>
                                      )}
                                    </div>
                                  </Card>
                                  {index < page.verses.length - 1 && (
                                    <Separator />
                                  )}
                                </motion.div>
                              ))
                            )}

                            {/* Loading more indicator */}
                            {hasMore && (
                              <div
                                ref={lastElementRef}
                                className="text-center py-8"
                              >
                                {loadingMore ? (
                                  <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    Loading more verses...
                                  </div>
                                ) : (
                                  <div className="text-muted-foreground">
                                    Scroll to load more verses
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        ) : (
                          // Mushaf View with Pagination
                          <>
                            {pages[currentPage - 1]?.verses.map(
                              (verse, index) => (
                                <motion.div
                                  key={verse.number}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="space-y-2"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="arabic-text text-xl leading-relaxed flex-1">
                                      {verse.text}
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {verse.numberInSurah}
                                      </Badge>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          playIndividualVerse(verse)
                                        }
                                        className="h-8 w-8 p-0"
                                      >
                                        {playingVerseId === verse.number ? (
                                          <Pause className="h-4 w-4" />
                                        ) : (
                                          <Play className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                  {index <
                                    pages[currentPage - 1]?.verses.length -
                                      1 && <Separator />}
                                </motion.div>
                              )
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center space-y-2">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Select a surah to read
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
