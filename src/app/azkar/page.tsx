"use client";

import { useState, useEffect, JSX } from "react";
import { motion } from "framer-motion";
import { Heart, Check, RotateCcw, Sun, Moon, Clock } from "lucide-react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AzkarCategory, ZikrItem } from "@/lib/types";
import { useAppStore } from "@/lib/store";

const initialAzkarData: Record<AzkarCategory, ZikrItem[]> = {
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
      translation:
        "In the name of Allah, the Most Gracious, the Most Merciful.",
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
      reference: "Sahih Muslim 2694",
    },
    {
      id: "morning-4",
      arabic:
        "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
      transliteration:
        "Allahumma bika asbahna, wabika amsayna, wabika nahya, wabika namutu, wa ilayka'n-nushur",
      translation:
        "O Allah, by You we enter the morning, by You we enter the evening, by You we live, by You we die, and to You is the resurrection.",
      count: 1,
      currentCount: 0,
      reference: "Sunan Abi Dawud 5068",
    },
    {
      id: "morning-5",
      arabic:
        "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَٰهَ إِلَّا أَنْتَ",
      transliteration:
        "Allahumma ‘afini fi badani, Allahumma ‘afini fi sam‘i, Allahumma ‘afini fi basari, la ilaha illa ant",
      translation:
        "O Allah, grant health to my body, grant health to my hearing, grant health to my sight. There is no deity except You.",
      count: 3,
      currentCount: 0,
      reference: "Sunan Abi Dawud 5090",
    },
  ],
  evening: [
    {
      id: "evening-1",
      arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
      transliteration: "Amsayna wa amsa'l-mulku lillah",
      translation:
        "We have reached the evening and at this very time unto Allah belongs all sovereignty.",
      count: 1,
      currentCount: 0,
      reference: "Sahih Muslim 2723",
    },
    {
      id: "evening-2",
      arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ",
      transliteration: "Allahumma anta rabbi la ilaha illa ant",
      translation:
        "O Allah, You are my Lord, none has the right to be worshipped except You.",
      count: 1,
      currentCount: 0,
      reference: "Sahih Bukhari 6306",
    },
    {
      id: "evening-3",
      arabic:
        "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
      transliteration:
        "Allahumma inni as’alukal-‘afiyata fid-dunya wal-akhirah",
      translation:
        "O Allah, I ask You for well-being in this world and the Hereafter.",
      count: 1,
      currentCount: 0,
      reference: "Sunan Ibn Majah 3871",
    },
    {
      id: "evening-4",
      arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
      transliteration: "A‘udhu bikalimatillahi’t-tammati min sharri ma khalaq",
      translation:
        "I seek refuge in the perfect words of Allah from the evil of what He has created.",
      count: 3,
      currentCount: 0,
      reference: "Sahih Muslim 2708",
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
      reference: "Sahih Muslim 597",
    },
    {
      id: "after-2",
      arabic: "الْحَمْدُ لِلَّهِ",
      transliteration: "Alhamdulillah",
      translation: "Praise be to Allah.",
      count: 33,
      currentCount: 0,
      reference: "Sahih Muslim 597",
    },
    {
      id: "after-3",
      arabic: "اللَّهُ أَكْبَرُ",
      transliteration: "Allahu Akbar",
      translation: "Allah is Greatest.",
      count: 34,
      currentCount: 0,
      reference: "Sahih Muslim 597",
    },
    {
      id: "after-4",
      arabic:
        "لَا إِلَٰهَ إِلَّا ٱللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ ٱلْمُلْكُ وَلَهُ ٱلْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ",
      transliteration:
        "La ilaha illallahu wahdahu la sharika lah, lahul-mulku wa lahul-hamdu wa huwa ‘ala kulli shay’in qadir",
      translation:
        "There is no deity except Allah alone with no partner; to Him belongs the dominion, and to Him belongs all praise, and He is over all things competent.",
      count: 1,
      currentCount: 0,
      reference: "Sahih Muslim 598",
    },
    {
      id: "after-5",
      arabic: "اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ",
      transliteration: "Allahumma ajirni min an-nar",
      translation: "O Allah, protect me from the Fire.",
      count: 7,
      currentCount: 0,
      reference: "Sunan Abi Dawud 5079",
    },
  ],
  sleep: [
    {
      id: "sleep-1",
      arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
      transliteration: "Bismika Allahumma amutu wa ahya",
      translation: "In Your name, O Allah, I live and die.",
      count: 1,
      currentCount: 0,
      reference: "Sahih Bukhari 6324",
    },
    {
      id: "sleep-2",
      arabic: "أَسْتَغْفِرُ اللَّهَ",
      transliteration: "Astaghfirullah",
      translation: "I seek forgiveness from Allah.",
      count: 3,
      currentCount: 0,
      reference: "Sahih Muslim 2711",
    },
    {
      id: "sleep-3",
      arabic:
        "اللَّهُمَّ رَبَّ السَّمَاوَاتِ السَّبْعِ وَرَبَّ الأَرْضِ وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَى، مُنْزِلَ التَّوْرَاةِ وَالإِنْجِيلِ وَالْقُرْآنِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ",
      transliteration:
        "Allahumma Rabbas-samawati’s-sab‘i wa Rabbal-ardi wa Rabba kulli shay’in, faliqal-habbi wan-nawa, munzilat-Tawrati wal-Injili wal-Qur’an, a‘udhu bika min sharri kulli shay’in anta akhidhun binasiyatihi",
      translation:
        "O Allah, Lord of the seven heavens and Lord of the earth and Lord of all things, Splitter of the grain and the date-stone, Revealer of the Torah, the Gospel, and the Quran, I seek refuge in You from the evil of everything You hold by its forelock.",
      count: 1,
      currentCount: 0,
      reference: "Sunan Abi Dawud 5067",
    },
    {
      id: "sleep-4",
      arabic: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
      transliteration: "Allahumma qini ‘adhabaka yawma tab‘athu ‘ibadak",
      translation:
        "O Allah, protect me from Your punishment on the day You resurrect Your servants.",
      count: 3,
      currentCount: 0,
      reference: "Sunan Tirmidhi 3393",
    },
  ],
};

export default function AzkarPage() {
  const {
    azkar,
    setAzkar,
    lastResetDate,
    setLastResetDate,
    incrementZikr,
    resetZikr,
    resetCategory,
    resetAllAzkar,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<AzkarCategory>("morning");

  useEffect(() => {
    setAzkar(initialAzkarData);
  }, [setAzkar]);

  // Reset all azkar daily
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastResetDate !== today) {
      resetAllAzkar();
      setLastResetDate(today);
    }
  }, [lastResetDate, resetAllAzkar, setLastResetDate]);

  const isCategoryComplete = (category: AzkarCategory) =>
    azkar[category].every((zikr) => zikr.currentCount >= zikr.count);

  const getCategoryProgress = (category: AzkarCategory) => {
    const total = azkar[category].reduce((sum, zikr) => sum + zikr.count, 0);
    const completed = azkar[category].reduce(
      (sum, zikr) => sum + zikr.currentCount,
      0
    );
    return Math.round((completed / total) * 100);
  };

  const tabsData: {
    value: AzkarCategory;
    label: string;
    arabic: string;
    icon: JSX.Element;
  }[] = [
    {
      value: "morning",
      label: "Morning",
      arabic: "الصباح",
      icon: <Sun className="h-4 w-4" />,
    },
    {
      value: "evening",
      label: "Evening",
      arabic: "المساء",
      icon: <Moon className="h-4 w-4" />,
    },
    {
      value: "afterPrayer",
      label: "After Prayer",
      arabic: "بعد الصلاة",
      icon: <Heart className="h-4 w-4" />,
    },
    {
      value: "sleep",
      label: "Before Sleep",
      arabic: "قبل النوم",
      icon: <Clock className="h-4 w-4" />,
    },
  ];

  return (
    <SidebarInset>
      <header className="flex h-16 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Azkar</h1>
          <span className="text-sm arabic-text text-muted-foreground">
            الأذكار
          </span>
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as AzkarCategory)}
            className="space-y-6"
          >
            <TabsList className="grid w-full h-fit grid-cols-2 lg:grid-cols-4">
              {tabsData.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2"
                >
                  {tab.icon}
                  <div>
                    <div>{tab.label}</div>
                    <div className="text-xs arabic-text">{tab.arabic}</div>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {tabsData.map((tab) => {
              const category = tab.value;

              return (
                <TabsContent
                  key={tab.value}
                  value={tab.value}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {tab.label} Azkar
                      </h2>
                      <p className="text-muted-foreground arabic-text">
                        {tab.arabic}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        {getCategoryProgress(category)}% Complete
                      </Badge>
                      <Button
                        onClick={() => resetCategory(category)}
                        variant="outline"
                        size="sm"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    {azkar[category].map((zikr, index) => (
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
                            <div className="flex justify-between items-start">
                              <div className="space-y-2 flex-1">
                                <CardTitle className="arabic-text text-xl leading-relaxed">
                                  {zikr.arabic}
                                </CardTitle>
                                <CardDescription className="space-y-1">
                                  <div className="text-base">
                                    {zikr.transliteration}
                                  </div>
                                  <div className="text-sm">
                                    {zikr.translation}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    - {zikr.reference}
                                  </div>
                                </CardDescription>
                              </div>
                              {zikr.currentCount >= zikr.count && (
                                <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                <Button
                                  onClick={() =>
                                    incrementZikr(category, zikr.id)
                                  }
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
                                onClick={() => resetZikr(category, zikr.id)}
                                variant="ghost"
                                size="sm"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="mt-3">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${
                                      (zikr.currentCount / zikr.count) * 100
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {isCategoryComplete(category) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
                        <CardContent className="p-6 text-center space-y-2">
                          <Check className="h-12 w-12 mx-auto text-emerald-600 dark:text-emerald-400" />
                          <h3 className="text-lg font-semibold">
                            Congratulations!
                          </h3>
                          <p className="text-muted-foreground">
                            You have completed all {tab.label} Azkar. May Allah
                            accept your remembrance.
                          </p>
                          <p className="arabic-text text-emerald-600 dark:text-emerald-400">
                            بارك الله فيك
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </SidebarInset>
  );
}
