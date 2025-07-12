"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Search, BookOpen } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface Surah {
  id: number
  name_simple: string
  name_arabic: string
  verses_count: number
  revelation_place: string
}

interface Verse {
  id: number
  verse_number: number
  text_uthmani: string
}

export default function QuranPage() {
  const { selectedSurah, setSurah } = useAppStore()
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [verses, setVerses] = useState<Verse[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [versesLoading, setVersesLoading] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Fetch list of surahs
    fetch("https://api.quran.com/v4/chapters")
      .then((res) => res.json())
      .then((data) => {
        if (data.chapters) {
          setSurahs(data.chapters)
        }
        setLoading(false)
      })
      .catch(() => {
        // Fallback data
        setSurahs([
          { id: 1, name_simple: "Al-Fatihah", name_arabic: "الفاتحة", verses_count: 7, revelation_place: "makkah" },
          { id: 2, name_simple: "Al-Baqarah", name_arabic: "البقرة", verses_count: 286, revelation_place: "madinah" },
          { id: 3, name_simple: "Ali 'Imran", name_arabic: "آل عمران", verses_count: 200, revelation_place: "madinah" },
        ])
        setLoading(false)
      })
  }, [])

  const handleSurahClick = async (surah: Surah) => {
    setSurah(surah)
    setVersesLoading(true)

    try {
      const response = await fetch(`https://api.quran.com/v4/quran/verses/uthmani?chapter_number=${surah.id}`)
      const data = await response.json()
      if (data.verses) {
        setVerses(data.verses)
      }
    } catch (error) {
      // Fallback verses for Al-Fatihah
      if (surah.id === 1) {
        setVerses([
          { id: 1, verse_number: 1, text_uthmani: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ" },
          { id: 2, verse_number: 2, text_uthmani: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ" },
          { id: 3, verse_number: 3, text_uthmani: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ" },
        ])
      }
    }
    setVersesLoading(false)
  }

  const playAudio = (surahId: number) => {
    if (currentAudio) {
      currentAudio.pause()
      setCurrentAudio(null)
      setAudioPlaying(false)
    }

    const audio = new Audio(`https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surahId}.mp3`)
    audio
      .play()
      .then(() => {
        setCurrentAudio(audio)
        setAudioPlaying(true)
      })
      .catch(() => {
        console.log("Audio playback failed")
      })

    audio.onended = () => {
      setAudioPlaying(false)
      setCurrentAudio(null)
    }
  }

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.name_simple.toLowerCase().includes(searchTerm.toLowerCase()) || surah.name_arabic.includes(searchTerm),
  )

  if (loading) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Qur'an</h1>
        </header>
        <div className="flex-1 p-6">
          <div className="text-center">Loading...</div>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Qur'an</h1>
          <span className="text-sm arabic-text text-muted-foreground">القرآن الكريم</span>
        </div>
      </header>

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
              {filteredSurahs.map((surah, index) => (
                <motion.div
                  key={surah.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`cursor-pointer transition-colors hover:bg-accent ${
                      selectedSurah?.id === surah.id ? "bg-accent" : ""
                    }`}
                    onClick={() => handleSurahClick(surah)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {surah.id}
                          </div>
                          <div>
                            <div className="font-medium">{surah.name_simple}</div>
                            <div className="text-sm text-muted-foreground">{surah.verses_count} verses</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="arabic-text text-lg font-semibold">{surah.name_arabic}</div>
                          <Badge variant="outline" className="text-xs">
                            {surah.revelation_place}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
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
                        <CardTitle>{selectedSurah.name_simple}</CardTitle>
                        <CardDescription className="arabic-text text-lg">{selectedSurah.name_arabic}</CardDescription>
                      </div>
                      <Button onClick={() => playAudio(selectedSurah.id)} className="misbaha-button">
                        {audioPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
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
                            key={verse.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="arabic-text text-xl leading-relaxed">{verse.text_uthmani}</div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {verse.verse_number}
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
                    <p className="text-muted-foreground">Select a surah to read</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
