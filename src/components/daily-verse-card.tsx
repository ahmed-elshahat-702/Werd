"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";
import { motion, Variants } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

interface DailyVerse {
  text: string;
  surah: { englishName: string; name: string };
  numberInSurah: number;
}

const DailyVerseCard = ({ itemVariants }: { itemVariants: Variants }) => {
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null);
  const [isHandling, setIsHandling] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const { dailyVerseState, updateDailyVerseState } = useAppStore.getState();

    const isNewDay = today !== dailyVerseState.lastShownDate;

    const fetchNextVerse = async () => {
      let surahId = dailyVerseState.surahId;
      let ayahNumber = dailyVerseState.ayahNumber;

      try {
        setIsHandling(true);

        if (isNewDay) {
          const res = await fetch(
            `https://api.alquran.cloud/v1/surah/${surahId}`
          );
          const data = await res.json();
          const totalAyat = data.data.numberOfAyahs;

          if (ayahNumber >= totalAyat) {
            surahId += 1;
            ayahNumber = 1;
          } else {
            ayahNumber += 1;
          }

          updateDailyVerseState(today, surahId, ayahNumber);
        }

        const response = await fetch(
          `https://api.alquran.cloud/v1/ayah/${surahId}:${ayahNumber}`
        );
        const verseData = await response.json();

        if (verseData.data) {
          setDailyVerse({
            text: verseData.data.text,
            surah: verseData.data.surah,
            numberInSurah: verseData.data.numberInSurah,
          });
        }
      } catch (error) {
        console.error("فشل تحميل الآية:", error);
      } finally {
        setIsHandling(false);
      }
    };

    fetchNextVerse();
  }, []);

  return (
    <motion.div variants={itemVariants}>
      <Card dir="rtl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl arabic-text">
            <BookOpen className="h-5 w-5" />
            الآية اليومية
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isHandling ? (
            <div className="space-y-3 text-right">
              <Skeleton className="h-6 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4 rounded-lg" />
            </div>
          ) : dailyVerse ? (
            <div className="space-y-3 text-right">
              <div className="arabic-text text-lg leading-relaxed">
                {dailyVerse.text}
              </div>
              <div className="text-sm text-muted-foreground arabic-text">
                {dailyVerse.surah.name} - الآية {dailyVerse.numberInSurah}
              </div>
            </div>
          ) : (
            <div className="text-right arabic-text text-red-500">
              لا يوجد آية متاحة حالياً.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyVerseCard;
