"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const { dailyVerseState, updateDailyVerseState } = useAppStore.getState();

    const isNewDay = today !== dailyVerseState.lastShownDate;

    const fetchNextVerse = async () => {
      let surahId = dailyVerseState.surahId;
      let ayahNumber = dailyVerseState.ayahNumber;

      // لو يوم جديد، نجيب الآية اللي بعدها
      if (isNewDay) {
        // Fetch عدد الآيات في السورة الحالية
        const res = await fetch(`http://api.alquran.cloud/v1/surah/${surahId}`);
        const data = await res.json();
        const totalAyat = data.data.numberOfAyahs;

        if (ayahNumber >= totalAyat) {
          surahId += 1;
          ayahNumber = 1;
        } else {
          ayahNumber += 1;
        }

        // حدّث الستور
        updateDailyVerseState(today, surahId, ayahNumber);
      }

      // بعد التحديث أو لو مش يوم جديد، fetch الآية من API
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
          {dailyVerse ? (
            <div className="space-y-3 text-right">
              <div className="arabic-text text-lg leading-relaxed">
                {dailyVerse.text}
              </div>
              <div className="text-sm text-muted-foreground arabic-text">
                {dailyVerse.surah.name} - الآية {dailyVerse.numberInSurah}
              </div>
            </div>
          ) : (
            <div className="text-right arabic-text">جاري تحميل الآية...</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyVerseCard;
