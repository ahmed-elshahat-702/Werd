"use client";

import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { RefObject, useState } from "react";

const SelectedsurahContent = ({
  versesLoading,
  setSelectedRecitation,
  recitations,
  recitationsLoading,
  viewMode,
  setViewMode,
  currentPage,
  totalPages,
  handleSurahClick,
  selectedRecitation,
  setCurrentPage,
  verses,
  pages,
  hasMore,
  lastElementRef,
  loadingMore,
}: {
  versesLoading: boolean;
  setSelectedRecitation: (newRecitation: string) => void;
  recitations: Recitation[];
  recitationsLoading: boolean;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentPage: number;
  totalPages: number;
  handleSurahClick: (surah: Surah) => void;
  selectedRecitation: string;
  setCurrentPage: (page: number) => void;
  verses: Verse[];
  pages: PageData[];
  hasMore: boolean;
  lastElementRef: RefObject<HTMLDivElement | null>;
  loadingMore: boolean;
}) => {
  const { selectedSurah } = useAppStore();
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [playingVerseId, setPlayingVerseId] = useState<number | null>(null);
  const [individualAudios, setIndividualAudios] = useState<
    Map<number, HTMLAudioElement>
  >(new Map());

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

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setAudioPlaying(false);

    individualAudios.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    setIndividualAudios(new Map());
    setPlayingVerseId(null);
  };
  // Play individual verse audio
  const playIndividualVerse = (verse: EnhancedVerse) => {
    if (playingVerseId === verse.number) {
      const audio = individualAudios.get(verse.number);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setPlayingVerseId(null);
      return;
    }

    if (playingVerseId) {
      const prevAudio = individualAudios.get(playingVerseId);
      if (prevAudio) {
        prevAudio.pause();
        prevAudio.currentTime = 0;
      }
    }

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
  return (
    <div className="flex-1 space-y-4">
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
                            {recitation.name !== recitation.englishName && (
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
                    {audioPlaying && `Playing: ${getCurrentRecitationName()}`}
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
                                  <Badge variant="outline" className="text-xs">
                                    Verse {verse.numberInSurah}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => playIndividualVerse(verse)}
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
                            {index < page.verses.length - 1 && <Separator />}
                          </motion.div>
                        ))
                      )}

                      {hasMore && (
                        <div ref={lastElementRef} className="text-center py-8">
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
                    <>
                      {pages[currentPage - 1]?.verses.map((verse, index) => (
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
                              <Badge variant="outline" className="text-xs">
                                {verse.numberInSurah}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => playIndividualVerse(verse)}
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
                            pages[currentPage - 1]?.verses.length - 1 && (
                            <Separator />
                          )}
                        </motion.div>
                      ))}
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
              <p className="text-muted-foreground">Select a surah to read</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SelectedsurahContent;
