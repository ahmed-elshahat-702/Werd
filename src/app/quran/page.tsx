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
import { Separator } from "@/components/ui/separator";
import { SidebarInset } from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { Surah, Verse } from "@/lib/types";
import { motion } from "framer-motion";
import { BookOpen, Pause, Play, Search, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

// Interface for recitation data
interface Recitation {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  direction: string | null;
}

export default function QuranPage() {
  const { selectedSurah, setSurah, isHandling, setIsHandling } = useAppStore();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [verses, setVerses] = useState<Verse[]>([]);
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

  const handleSurahClick = async (surah: Surah) => {
    setSurah(surah);
    setVersesLoading(true);
    try {
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surah.number}/ar.uthmani`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.data.ayahs) {
        setVerses(
          data.data.ayahs.map((ayah: Verse) => ({
            number: ayah.number,
            text: ayah.text,
            numberInSurah: ayah.numberInSurah,
            juz: ayah.juz,
            manzil: ayah.manzil,
            page: ayah.page,
            ruku: ayah.ruku,
            hizbQuarter: ayah.hizbQuarter,
            sajda: ayah.sajda,
          }))
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setVerses([]);
    }
    setVersesLoading(false);
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setAudioPlaying(false);
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

  const handleRecitationChange = (newRecitation: string) => {
    // Stop current audio when changing recitation
    stopAudio();
    setSelectedRecitation(newRecitation);
  };

  // Get the current recitation name for display
  const getCurrentRecitationName = () => {
    const recitation = recitations.find(
      (r) => r.identifier === selectedRecitation
    );
    return recitation?.englishName || "Alafasy";
  };

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
                          disabled={!currentAudio && !audioPlaying}
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

                      {audioPlaying && (
                        <div className="text-sm text-muted-foreground">
                          Playing: {getCurrentRecitationName()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Verses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {versesLoading ? (
                      <div className="text-center py-8">Loading verses...</div>
                    ) : (
                      <div className="space-y-6">
                        {verses.map((verse, index) => (
                          <motion.div
                            key={verse.number}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="arabic-text text-xl leading-relaxed">
                              {verse.text}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {verse.numberInSurah}
                              </Badge>
                            </div>
                            {index < verses.length - 1 && <Separator />}
                          </motion.div>
                        ))}
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
