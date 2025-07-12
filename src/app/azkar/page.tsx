"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Heart, Check, RotateCcw, Sun, Moon, Clock } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface Zikr {
  id: string
  arabic: string
  transliteration: string
  translation: string
  count: number
  currentCount: number
  reference: string
}

const azkarData = {
  morning: [
    {
      id: "morning-1",
      arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
      transliteration: "A'udhu billahi min ash-shaytani'r-rajim",
      translation: "I seek refuge in Allah from Satan, the accursed.",
      count: 1,
      currentCount: 0,
      reference: "Quran 16:98",
    },
    {
      id: "morning-2",
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      transliteration: "Bismillahi'r-rahmani'r-rahim",
      translation: "In the name of Allah, the Most Gracious, the Most Merciful.",
      count: 1,
      currentCount: 0,
      reference: "Quran 1:1",
    },
    {
      id: "morning-3",
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
      transliteration: "Subhan Allahi wa bihamdihi",
      translation: "Glory be to Allah and praise Him.",
      count: 100,
      currentCount: 0,
      reference: "Sahih Bukhari",
    },
  ],
  evening: [
    {
      id: "evening-1",
      arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
      transliteration: "Amsayna wa amsa'l-mulku lillah",
      translation: "We have reached the evening and at this very time unto Allah belongs all sovereignty.",
      count: 1,
      currentCount: 0,
      reference: "Sahih Muslim",
    },
    {
      id: "evening-2",
      arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ",
      transliteration: "Allahumma anta rabbi la ilaha illa ant",
      translation: "O Allah, You are my Lord, none has the right to be worshipped except You.",
      count: 1,
      currentCount: 0,
      reference: "Sahih Bukhari",
    },
  ],
  afterPrayer: [
    {
      id: "after-1",
      arabic: "سُبْحَانَ اللَّهِ",
      transliteration: "Subhan Allah",
      translation: "Glory be to Allah.",
      count: 33,
      currentCount: 0,
      reference: "Sahih Muslim",
    },
    {
      id: "after-2",
      arabic: "الْحَمْدُ لِلَّهِ",
      transliteration: "Alhamdulillah",
      translation: "Praise be to Allah.",
      count: 33,
      currentCount: 0,
      reference: "Sahih Muslim",
    },
    {
      id: "after-3",
      arabic: "اللَّهُ أَكْبَرُ",
      transliteration: "Allahu Akbar",
      translation: "Allah is Greatest.",
      count: 34,
      currentCount: 0,
      reference: "Sahih Muslim",
    },
  ],
  sleep: [
    {
      id: "sleep-1",
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      transliteration: "Bismika Allahumma amutu wa ahya",
      translation: "In Your name O Allah, I live and die.",
      count: 1,
      currentCount: 0,
      reference: "Sahih Bukhari",
    },
    {
      id: "sleep-2",
      arabic: "أَسْتَغْفِرُ اللَّهَ",
      transliteration: "Astaghfirullah",
      translation: "I seek forgiveness from Allah.",
      count: 3,
      currentCount: 0,
      reference: "Sahih Muslim",
    },
  ],
}

export default function AzkarPage() {
  const { completedAzkar, markAzkarComplete } = useAppStore()
  const [activeTab, setActiveTab] = useState("morning")
  const [azkarState, setAzkarState] = useState(azkarData)

  const incrementZikr = (category: keyof typeof azkarData, zikrId: string) => {
    setAzkarState((prev) => ({
      ...prev,
      [category]: prev[category].map((zikr) =>
        zikr.id === zikrId && zikr.currentCount < zikr.count ? { ...zikr, currentCount: zikr.currentCount + 1 } : zikr,
      ),
    }))

    // Vibration feedback
    if ("vibrate" in navigator) {
      navigator.vibrate(30)
    }
  }

  const resetZikr = (category: keyof typeof azkarData, zikrId: string) => {
    setAzkarState((prev) => ({
      ...prev,
      [category]: prev[category].map((zikr) => (zikr.id === zikrId ? { ...zikr, currentCount: 0 } : zikr)),
    }))
  }

  const resetCategory = (category: keyof typeof azkarData) => {
    setAzkarState((prev) => ({
      ...prev,
      [category]: prev[category].map((zikr) => ({ ...zikr, currentCount: 0 })),
    }))
  }

  const markCategoryComplete = (category: keyof typeof azkarData) => {
    const categoryId = `${category}-${new Date().toDateString()}`
    markAzkarComplete(categoryId)
  }

  const isCategoryComplete = (category: keyof typeof azkarData) => {
    return azkarState[category].every((zikr) => zikr.currentCount >= zikr.count)
  }

  const getCategoryProgress = (category: keyof typeof azkarData) => {
    const total = azkarState[category].reduce((sum, zikr) => sum + zikr.count, 0)
    const completed = azkarState[category].reduce((sum, zikr) => sum + zikr.currentCount, 0)
    return Math.round((completed / total) * 100)
  }

  const tabsData = [
    { value: "morning", label: "Morning", arabic: "الصباح", icon: <Sun className="h-4 w-4" /> },
    { value: "evening", label: "Evening", arabic: "المساء", icon: <Moon className="h-4 w-4" /> },
    { value: "afterPrayer", label: "After Prayer", arabic: "بعد الصلاة", icon: <Heart className="h-4 w-4" /> },
    { value: "sleep", label: "Before Sleep", arabic: "قبل النوم", icon: <Clock className="h-4 w-4" /> },
  ]

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Azkar</h1>
          <span className="text-sm arabic-text text-muted-foreground">الأذكار</span>
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              {tabsData.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
                  {tab.icon}
                  <div className="hidden sm:block">
                    <div>{tab.label}</div>
                    <div className="text-xs arabic-text">{tab.arabic}</div>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {tabsData.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h2 className="text-2xl font-semibold">{tab.label} Azkar</h2>
                    <p className="text-muted-foreground arabic-text">{tab.arabic}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {getCategoryProgress(tab.value as keyof typeof azkarData)}% Complete
                    </Badge>
                    <Button
                      onClick={() => resetCategory(tab.value as keyof typeof azkarData)}
                      variant="outline"
                      size="sm"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>

                <div className="space-y-4">
                  {azkarState[tab.value as keyof typeof azkarData].map((zikr, index) => (
                    <motion.div
                      key={zikr.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={
                          zikr.currentCount >= zikr.count
                            ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800"
                            : ""
                        }
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <CardTitle className="arabic-text text-xl leading-relaxed">{zikr.arabic}</CardTitle>
                              <CardDescription className="space-y-1">
                                <div className="text-base">{zikr.transliteration}</div>
                                <div className="text-sm">{zikr.translation}</div>
                                <div className="text-xs text-muted-foreground">- {zikr.reference}</div>
                              </CardDescription>
                            </div>
                            {zikr.currentCount >= zikr.count && (
                              <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Button
                                onClick={() => incrementZikr(tab.value as keyof typeof azkarData, zikr.id)}
                                disabled={zikr.currentCount >= zikr.count}
                                className="misbaha-button"
                              >
                                Count
                              </Button>
                              <div className="text-lg font-semibold">
                                {zikr.currentCount} / {zikr.count}
                              </div>
                            </div>
                            <Button
                              onClick={() => resetZikr(tab.value as keyof typeof azkarData, zikr.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(zikr.currentCount / zikr.count) * 100}%` }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {isCategoryComplete(tab.value as keyof typeof azkarData) && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
                      <CardContent className="p-6 text-center">
                        <div className="space-y-2">
                          <Check className="h-12 w-12 mx-auto text-emerald-600 dark:text-emerald-400" />
                          <h3 className="text-lg font-semibold">Congratulations!</h3>
                          <p className="text-muted-foreground">
                            You have completed all {tab.label} Azkar. May Allah accept your remembrance.
                          </p>
                          <p className="arabic-text text-emerald-600 dark:text-emerald-400">بارك الله فيك</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </SidebarInset>
  )
}
