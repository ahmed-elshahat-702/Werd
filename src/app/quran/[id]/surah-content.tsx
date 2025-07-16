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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import {
  EnhancedVerse,
  PageData,
  Recitation,
  Surah,
  Verse,
  ViewMode,
} from "@/lib/types";
import { BookOpenCheck, Grid3X3, Pause, Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import CardsView from "./cards-view";
import MushafView from "./mushaf-view";

const useSurahData = (surahId: string) => {
  const { setIsHandling, setHeaderArabicTitle, setHeaderEnglishTitle } =
    useAppStore();
  const [surah, setSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<EnhancedVerse[]>([]);
  const [versesLoading, setVersesLoading] = useState(false);
  const [recitations, setRecitations] = useState<Recitation[]>([]);
  const [recitationsLoading, setRecitationsLoading] = useState(false);

  useEffect(() => {
    if (surah) {
      setHeaderArabicTitle(surah.name);
      setHeaderEnglishTitle(surah.englishName);
    }
  }, [setHeaderArabicTitle, setHeaderEnglishTitle, surah]);

  useEffect(() => {
    if (!surahId || isNaN(Number(surahId))) return;

    const fetchSurah = async () => {
      setIsHandling(true);
      try {
        const res = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahId}`
        );
        if (!res.ok) throw new Error("Failed to fetch surah");
        const data = await res.json();
        setSurah(data.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch surah");
      } finally {
        setIsHandling(false);
      }
    };

    fetchSurah();
  }, [surahId, setIsHandling]);

  useEffect(() => {
    const fetchRecitations = async () => {
      setRecitationsLoading(true);
      try {
        const res = await fetch(
          "https://api.alquran.cloud/v1/edition?format=audio"
        );
        if (!res.ok) throw new Error("Failed to fetch recitations");
        const data = await res.json();
        setRecitations(data.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch recitations");
      } finally {
        setRecitationsLoading(false);
      }
    };

    fetchRecitations();
  }, []);

  return {
    surah,
    verses,
    setVerses,
    versesLoading,
    setVersesLoading,
    recitations,
    recitationsLoading,
  };
};

const useAudioPlayer = () => {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [playingVerseId, setPlayingVerseId] = useState<number | null>(null);
  const individualAudiosRef = useRef<Map<number, HTMLAudioElement>>(new Map());
  const playSessionRef = useRef<symbol | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentVerseIndexRef = useRef<number>(0);
  const audioUrlsRef = useRef<string[]>([]);

  const [selectedRecitation, setSelectedRecitation] = useState<string>("ar.alafasy");

  const playAudio = async (surahId: number) => {
    // Prevent race conditions: create a local flag for this play session
    const playSession = Symbol("playSession");
    playSessionRef.current = playSession;

    // If already paused and currentAudio exists, resume
    if (currentAudioRef.current && !audioPlaying) {
      currentAudioRef.current.play().then(() => setAudioPlaying(true));
      return;
    }

    // Always stop any previous audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      setCurrentAudio(null);
      currentAudioRef.current = null;
    }
    setAudioPlaying(false);
    currentVerseIndexRef.current = 0;

    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahId}/${selectedRecitation}`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data.data.ayahs) throw new Error("No ayahs found");

      const audioUrls = data.data.ayahs.map((ayah: Verse) => ayah.audio);
      audioUrlsRef.current = audioUrls;
      let currentIndex = currentVerseIndexRef.current;
      let prevAudio: HTMLAudioElement | null = null;

      const playNext = () => {
        // If another play session started, abort
        if (playSessionRef.current !== playSession) {
          if (prevAudio) {
            prevAudio.pause();
            prevAudio.currentTime = 0;
          }
          setAudioPlaying(false);
          setCurrentAudio(null);
          currentAudioRef.current = null;
          return;
        }
        if (currentIndex >= audioUrls.length) {
          setAudioPlaying(false);
          setCurrentAudio(null);
          currentAudioRef.current = null;
          return;
        }
        // Clean up previous audio
        if (prevAudio) {
          prevAudio.pause();
          prevAudio.currentTime = 0;
        }
        const audio = new Audio(audioUrls[currentIndex]);
        setCurrentAudio(audio);
        currentAudioRef.current = audio;
        prevAudio = audio;
        currentVerseIndexRef.current = currentIndex;
        audio.onended = () => {
          currentIndex++;
          currentVerseIndexRef.current = currentIndex;
          playNext();
        };
        audio.onerror = () => {
          setAudioPlaying(false);
          setCurrentAudio(null);
          currentAudioRef.current = null;
        };
        audio.play().then(() => {
          setAudioPlaying(true);
        }).catch(() => {
          setAudioPlaying(false);
          setCurrentAudio(null);
          currentAudioRef.current = null;
        });
      };
      playNext();
    } catch (error) {
      console.error(error);
      setAudioPlaying(false);
      setCurrentAudio(null);
      currentAudioRef.current = null;
    }
  };

  const stopAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      setCurrentAudio(null);
      currentAudioRef.current = null;
    }
    individualAudiosRef.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    individualAudiosRef.current.clear();
    setAudioPlaying(false);
    setPlayingVerseId(null);
    // Invalidate play session
    playSessionRef.current = null;
    currentVerseIndexRef.current = 0;
    audioUrlsRef.current = [];
  }, []);

  // Play/pause toggle for surah audio
  const toggleAudio = (surahId: number) => {
    if (audioPlaying) {
      // Just pause, do not reset index
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        setAudioPlaying(false);
      }
    } else {
      // Resume if paused, or start from current index
      if (currentAudioRef.current && audioUrlsRef.current.length > 0) {
        currentAudioRef.current.play().then(() => setAudioPlaying(true));
      } else {
        playAudio(surahId);
      }
    }
  };

  // Play individual verse audio
  const playIndividualVerse = (verse: EnhancedVerse) => {
    if (playingVerseId === verse.number) {
      const audio = individualAudiosRef.current.get(verse.number);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setPlayingVerseId(null);
      return;
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      setAudioPlaying(false);
      setCurrentAudio(null);
      currentAudioRef.current = null;
    }

    if (verse.audioUrl) {
      const audio = new Audio(verse.audioUrl);
      individualAudiosRef.current.set(verse.number, audio);
      setPlayingVerseId(verse.number);

      audio.onended = () => {
        setPlayingVerseId(null);
      };

      audio.play().catch(() => {
        setPlayingVerseId(null);
      });
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  return {
    playAudio,
    audioPlaying,
    setAudioPlaying,
    currentAudio,
    setCurrentAudio,
    playingVerseId,
    setPlayingVerseId,
    stopAudio,
    selectedRecitation,
    setSelectedRecitation,
    playIndividualVerse,
    toggleAudio,
  };
};

const SurahContent = ({ surahId }: { surahId: string }) => {
  const {
    surah,
    verses,
    setVerses,
    versesLoading,
    setVersesLoading,
    recitations,
    recitationsLoading,
  } = useSurahData(surahId);
  const {
    currentAudio,
    toggleAudio,
    audioPlaying,
    playingVerseId,
    stopAudio,
    selectedRecitation,
    setSelectedRecitation,
    playIndividualVerse,
  } = useAudioPlayer();

  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [currentPage, setCurrentPage] = useState(1);

  const pages = useMemo(() => {
    const versesPerPage = 10;
    const result: PageData[] = [];
    for (let i = 0; i < verses.length; i += versesPerPage) {
      result.push({
        number: Math.floor(i / versesPerPage) + 1,
        verses: verses.slice(i, i + versesPerPage),
      });
    }
    return result;
  }, [verses]);

  const totalPages = pages.length;

  useEffect(() => {
    if (!surahId || !selectedRecitation) return;

    const fetchVersesWithTranslation = async () => {
      setVersesLoading(true);
      try {
        const endpoints = [
          `https://api.alquran.cloud/v1/surah/${surahId}/ar.uthmani`,
          `https://api.alquran.cloud/v1/surah/${surahId}/en.sahih`,
          `https://api.alquran.cloud/v1/surah/${surahId}/${selectedRecitation}`,
        ];

        const responses = await Promise.all(
          endpoints.map((url) =>
            fetch(url).then((res) => {
              if (!res.ok) throw new Error(`Failed to fetch ${url}`);
              return res.json();
            })
          )
        );

        const [arabicData, translationData, audioData] = responses;

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

        setVerses(enhancedVerses);
        setCurrentPage(1);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load surah data");
      } finally {
        setVersesLoading(false);
      }
    };

    fetchVersesWithTranslation();
  }, [selectedRecitation, surahId, setVerses, setVersesLoading]);

  const currentRecitationName = useMemo(() => {
    const recitation = recitations.find(
      (r) => r.identifier === selectedRecitation
    );
    return recitation?.englishName || "Alafasy";
  }, [recitations, selectedRecitation]);

  const goToPage = useCallback(
    (pageNumber: number) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    },
    [totalPages]
  );

  if (!surahId || isNaN(Number(surahId))) {
    return <div>Invalid Surah ID</div>;
  }

  if (!surah || versesLoading) {
    return (
      <div className="flex-1 p-6 space-y-8">
        <Skeleton className="h-10 w-64" />
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-px w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <BreadcrumbPage>{surah.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{surah.englishName}</CardTitle>
              <CardDescription className="arabic-text text-lg">
                {surah.name}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => toggleAudio(surah.number)}
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
                disabled={!currentAudio && !audioPlaying && !playingVerseId}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Recitation</label>
              <Select
                value={selectedRecitation}
                onValueChange={setSelectedRecitation}
                disabled={recitationsLoading}
              >
                <SelectTrigger className="w-full h-fit py-8 border-muted rounded-xl shadow-sm focus:ring-2 focus:ring-primary transition">
                  <SelectValue
                    placeholder={
                      recitationsLoading
                        ? "جاري التحميل..."
                        : currentRecitationName
                    }
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-lg bg-background">
                  {recitations.map((recitation) => (
                    <SelectItem
                      key={recitation.identifier}
                      value={recitation.identifier}
                      className="py-3 px-4 hover:bg-muted/50 transition-all rounded-md"
                    >
                      <div className="flex flex-col text-start">
                        <span className="font-semibold text-sm text-foreground">
                          {recitation.englishName}
                        </span>
                        {recitation.name !== recitation.englishName && (
                          <span className="text-xs text-muted-handling arabic-text mt-0.5">
                            {recitation.name}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">View Mode</label>
              <Tabs
                value={viewMode}
                onValueChange={(value) => setViewMode(value as ViewMode)}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="cards"
                    className="flex items-center gap-2"
                  >
                    <Grid3X3 className="h-4 w-4" /> Cards
                  </TabsTrigger>
                  <TabsTrigger
                    value="mushaf"
                    className="flex items-center gap-2"
                  >
                    <BookOpenCheck className="h-4 w-4" /> Mushaf
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {audioPlaying && (
              <div className="text-sm text-muted-foreground">
                {audioPlaying && `Playing Surah: ${currentRecitationName}`}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          {viewMode === "cards" ? (
            <CardTitle>Verses</CardTitle>
          ) : (
            <div className="flex justify-between items-center">
              <CardTitle>Mushaf View</CardTitle>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {viewMode === "cards" ? (
              <CardsView
                pages={pages}
                playingVerseId={playingVerseId}
                playIndividualVerse={playIndividualVerse}
              />
            ) : (
              <MushafView
                pages={pages}
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
                playingVerseId={playingVerseId}
                playIndividualVerse={playIndividualVerse}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurahContent;
