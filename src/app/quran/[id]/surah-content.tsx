"use client";

import AppHeader from "@/components/layout/app-header";
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
import { SidebarInset } from "@/components/ui/sidebar";
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
import { Skeleton } from "@/components/ui/skeleton";
import CardsView from "./cards-view";
import MushafView from "./mushaf-view";

const useSurahData = (surahId: string) => {
  const { setIsHandling } = useAppStore();
  const [surah, setSurah] = useState<Surah | null>(null);
  const [verses, setVerses] = useState<EnhancedVerse[]>([]);
  const [versesLoading, setVersesLoading] = useState(false);
  const [recitations, setRecitations] = useState<Recitation[]>([]);
  const [recitationsLoading, setRecitationsLoading] = useState(false);

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
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [playingVerseId, setPlayingVerseId] = useState<number | null>(null);
  const individualAudiosRef = useRef<Map<number, HTMLAudioElement>>(new Map());

  const stopAudio = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    individualAudiosRef.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    individualAudiosRef.current.clear();
    setAudioPlaying(false);
    setPlayingVerseId(null);
  }, [currentAudio]);

  useEffect(() => {
    return () => stopAudio();
  }, [stopAudio]);

  return {
    audioPlaying,
    setAudioPlaying,
    currentAudio,
    setCurrentAudio,
    playingVerseId,
    setPlayingVerseId,
    individualAudios: individualAudiosRef.current,
    stopAudio,
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
    audioPlaying,
    setAudioPlaying,
    currentAudio,
    setCurrentAudio,
    playingVerseId,
    setPlayingVerseId,
    individualAudios,
    stopAudio,
  } = useAudioPlayer();
  const [selectedRecitation, setSelectedRecitation] =
    useState<string>("ar.alafasy");
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

  const playAudio = useCallback(async () => {
    if (audioPlaying && currentAudio) {
      currentAudio.pause();
      setAudioPlaying(false);
      return;
    }

    if (currentAudio && !audioPlaying) {
      try {
        await currentAudio.play();
        setAudioPlaying(true);
      } catch (error) {
        console.error(error);
        toast.error("Audio playback failed");
      }
      return;
    }

    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahId}/${selectedRecitation}`
      );
      if (!response.ok) throw new Error("Failed to fetch audio");
      const data = await response.json();
      const audioUrls = data.data.ayahs.map((ayah: Verse) => ayah.audio);

      if (audioUrls.length > 0) {
        const audio = new Audio(audioUrls[0]);
        setCurrentAudio(audio);
        setAudioPlaying(true);

        audio.onended = () => {
          setCurrentAudio(null);
          setAudioPlaying(false);
        };

        audio.play().catch(() => {
          toast.error("Audio playback failed");
          setAudioPlaying(false);
          setCurrentAudio(null);
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load audio");
    }
  }, [
    audioPlaying,
    currentAudio,
    selectedRecitation,
    setAudioPlaying,
    setCurrentAudio,
    surahId,
  ]);

  const playIndividualVerse = useCallback(
    (verse: EnhancedVerse) => {
      if (playingVerseId === verse.number) {
        const audio = individualAudios.get(verse.number);
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        individualAudios.delete(verse.number);
        setPlayingVerseId(null);
        return;
      }

      stopAudio();

      if (verse.audioUrl) {
        const audio = new Audio(verse.audioUrl);
        individualAudios.set(verse.number, audio);
        setPlayingVerseId(verse.number);

        audio.onended = () => {
          individualAudios.delete(verse.number);
          setPlayingVerseId(null);
        };

        audio.play().catch(() => {
          toast.error("Verse audio playback failed");
          individualAudios.delete(verse.number);
          setPlayingVerseId(null);
        });
      }
    },
    [individualAudios, playingVerseId, setPlayingVerseId, stopAudio]
  );

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
      <SidebarInset>
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
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <AppHeader englishText={surah.englishName} arabicText={surah.name} />
      <div className="flex-1 min-h-screen p-6 w-full space-y-8">
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
                <Button onClick={playAudio} className="misbaha-button">
                  {audioPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  onClick={stopAudio}
                  variant="outline"
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
              {(audioPlaying || playingVerseId) && (
                <div className="text-sm text-muted-foreground">
                  {audioPlaying && `Playing: ${currentRecitationName}`}
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
    </SidebarInset>
  );
};

export default SurahContent;
