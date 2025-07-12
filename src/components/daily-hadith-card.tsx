"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";

export interface Book {
  id: number;
  bookName: string;
  writerName: string;
  aboutWriter: string | null;
  writerDeath: string;
  bookSlug: string;
}

export interface Chapter {
  id: number;
  chapterNumber: string;
  chapterEnglish: string;
  chapterUrdu: string;
  chapterArabic: string;
  bookSlug: string;
}

export interface Hadith {
  id: number;
  hadithNumber: string;
  englishNarrator: string;
  urduNarrator: string;
  hadithEnglish: string;
  hadithUrdu: string;
  hadithArabic: string;
  headingArabic: string;
  headingUrdu: string;
  headingEnglish: string;
  chapterId: string;
  bookSlug: string;
  volume: string;
  status: string;
  book: Book;
  chapter: Chapter;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface HadithsResponse {
  status: number;
  message: string;
  hadiths: {
    current_page: number;
    data: Hadith[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    links: PaginationLink[];
  };
}

const API_KEY = "$2y$10$gFlfjMlGjKiL1BP6jgs7HOpObXZqy13tChPFdfmUsEVX5IPtaVFi";
const TOTAL_HADITHS = 40465;
const PER_PAGE = 25;
const TOTAL_PAGES = Math.ceil(TOTAL_HADITHS / PER_PAGE);

const DailyHadithCard = ({ itemVariants }: { itemVariants: Variants }) => {
  const { isHandling, setIsHandling } = useAppStore();
  const [hadith, setHadith] = useState<Hadith | null>(null);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;

    async function fetchRandomHadith() {
      setIsHandling(true);
      hasFetchedRef.current = true;

      const randomPage = Math.floor(Math.random() * TOTAL_PAGES) + 1;

      try {
        const res = await fetch(
          `https://hadithapi.com/api/hadiths?page=${randomPage}&apiKey=${API_KEY}`
        );
        const json = await res.json();

        const h = json.hadiths?.data?.[0];
        if (!h) throw new Error("No hadith found.");

        setHadith(h);
      } catch (e) {
        toast.error("فشل تحميل الحديث. تأكد من الاتصال أو الـ API KEY.");
        console.error("Error fetching hadith:", e);
      } finally {
        setIsHandling(false);
      }
    }

    fetchRandomHadith();
  }, [setIsHandling]);

  return (
    <motion.div variants={itemVariants}>
      <Card dir="rtl">
        <CardHeader>
          <CardTitle className="arabic-text">الحديث اليومي</CardTitle>
        </CardHeader>
        <CardContent>
          {isHandling ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-1/2 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4 rounded-lg" />
            </div>
          ) : hadith ? (
            <div className="space-y-3 text-right arabic-text">
              <div className="text-lg leading-relaxed">
                {hadith.hadithArabic}
              </div>
              <div className="text-sm text-muted-foreground">
                {hadith.hadithEnglish}
              </div>
              <div>{hadith.book.bookName}</div>
            </div>
          ) : (
            <div className="text-right arabic-text text-red-500">
              لا يوجد حديث متاح حالياً.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyHadithCard;
