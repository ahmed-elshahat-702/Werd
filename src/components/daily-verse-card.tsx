"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";
import { motion, Variants } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

const DailyVerseCard = ({ itemVariants }: { itemVariants: Variants }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { dailyVerseState, updateDailyVerseState, dailyVerse, setDailyVerse } =
    useAppStore();

  useEffect(() => {
    const fetchAndSetDailyVerse = async () => {
      setIsLoading(true);
      setError(null);

      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      let { chapterId, verseNumber } = dailyVerseState;
      const { lastShownDate } = dailyVerseState;

      chapterId = chapterId || 1;
      verseNumber = verseNumber || 1;

      const isNewDay = today !== lastShownDate;

      // Only fetch if it's a new day OR if dailyVerse is null in the store
      if (isNewDay || !dailyVerse) {
        try {
          if (isNewDay) {
            const chapterInfoRes = await fetch(
              `/api/quran/chapters/${chapterId}`
            );

            if (!chapterInfoRes.ok) {
              throw new Error(
                `Failed to fetch chapter info: ${chapterInfoRes.statusText}`
              );
            }
            const chapterInfoData = await chapterInfoRes.json();
            const totalAyat = chapterInfoData?.chapter?.verses_count;

            if (totalAyat === undefined) {
              throw new Error(
                "Could not retrieve total number of verses for the chapter."
              );
            }

            if (verseNumber >= totalAyat) {
              chapterId += 1;
              verseNumber = 1;
            } else {
              verseNumber += 1;
            }

            updateDailyVerseState(today, chapterId, verseNumber);
          }

          const verseResponse = await fetch(
            `/api/quran/verses/by_key/${chapterId}:${verseNumber}`
          );

          if (!verseResponse.ok) {
            throw new Error(
              `Failed to fetch daily verse: ${verseResponse.statusText}`
            );
          }

          const verseData = await verseResponse.json();

          if (verseData.verse) {
            setDailyVerse(verseData.verse);
          } else {
            throw new Error("No verse data found in the API response.");
          }
        } catch (err) {
          console.error("فشل تحميل الآية:", err);
          setError("فشل تحميل الآية. الرجاء المحاولة لاحقاً.");
          setDailyVerse(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchAndSetDailyVerse();
  }, [dailyVerseState, updateDailyVerseState, dailyVerse, setDailyVerse]);

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
          {isLoading ? (
            <div className="space-y-3 text-right">
              <Skeleton className="h-6 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4 rounded-lg" />
            </div>
          ) : error ? (
            <div className="text-right arabic-text text-red-500">{error}</div>
          ) : dailyVerse ? (
            <div className="space-y-3">
              <div className="arabic-text text-lg leading-relaxed">
                {dailyVerse.text_imlaei}
              </div>
              {dailyVerse.words && (
                <div dir="ltr" className="text-sm w-full">
                  <p className="text-sm text-muted-foreground mt-3 italic">
                    {dailyVerse.words
                      ?.map((w) => w.transliteration?.text)
                      .filter(Boolean)
                      .join(" ")}
                  </p>
                  {dailyVerse.words
                    ?.map((w) => w.translation?.text)
                    .filter(Boolean)
                    .join(" ")}
                </div>
              )}
              <div className="text-sm text-muted-foreground arabic-text">
                الآية {dailyVerse.verse_number}
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
