"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useAppStore } from "@/lib/store";
import { Hadith } from "@/lib/types";
import { motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";

const API_KEY = "$2y$10$gFlfjMlGjKiL1BP6jgs7HOpObXZqy13tChPFdfmUsEVX5IPtaVFi";
const TOTAL_HADITHS = 40465;
const PER_PAGE = 25;
const TOTAL_PAGES = Math.ceil(TOTAL_HADITHS / PER_PAGE);

const DailyHadithCard = ({ itemVariants }: { itemVariants: Variants }) => {
  const { isHandling, setIsHandling, dailyHadiths, setDailyHadiths } =
    useAppStore();
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [expandedHadithId, setExpandedHadithId] = useState<number | null>(null);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const today = new Date().toDateString();

    if (dailyHadiths.date === today && dailyHadiths.hadiths.length > 0) {
      setHadiths(dailyHadiths.hadiths);
      return;
    }

    if (hasFetchedRef.current) return;

    async function fetchRandomHadiths() {
      setIsHandling(true);
      hasFetchedRef.current = true;

      const randomPage = Math.floor(Math.random() * TOTAL_PAGES) + 1;

      try {
        const res = await fetch(
          `https://hadithapi.com/api/hadiths?page=${randomPage}&apiKey=${API_KEY}`
        );
        const json = await res.json();

        const fetchedHadiths = json.hadiths?.data || [];
        if (!fetchedHadiths.length) throw new Error("No hadiths found.");

        setHadiths(fetchedHadiths);
        setDailyHadiths(fetchedHadiths, today);
      } catch (e) {
        toast.error("فشل تحميل الأحاديث. تأكد من الاتصال أو الـ API KEY.");
        console.error("Error fetching hadiths:", e);
      } finally {
        setIsHandling(false);
      }
    }

    fetchRandomHadiths();
  }, [setIsHandling, setDailyHadiths, dailyHadiths]);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setExpandedHadithId(null); // Reset expanded state
      setCurrentSlide(api.selectedScrollSnap()); // Update current slide
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const toggleExpand = (hadithId: number) => {
    setExpandedHadithId(expandedHadithId === hadithId ? null : hadithId);
  };

  return (
    <motion.div variants={itemVariants}>
      <div dir="rtl" className="w-full space-y-4">
        <h1 className="arabic-text text-xl font-bold">الأحاديث اليومية</h1>

        <div className="space-y-4">
          {isHandling ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-1/2 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4 rounded-lg" />
            </div>
          ) : hadiths.length > 0 ? (
            <Carousel
              setApi={setApi}
              className="w-full "
              dir="ltr"
              opts={{ loop: false }}
            >
              <CarouselContent>
                {hadiths.map((hadith) => (
                  <CarouselItem key={hadith.id} className="sm:basis-full h-fit">
                    <Card className="flex flex-col h-fit shadow-md border rounded-2xl">
                      <CardContent className="flex flex-col justify-between flex-grow space-y-4 text-right p-6 arabic-text">
                        <div
                          className={`text-xl leading-loose font-medium text-gray-900 ${
                            expandedHadithId === hadith.id ? "" : "line-clamp-4"
                          }`}
                        >
                          {hadith.hadithArabic}
                        </div>
                        <div
                          className={`text-sm text-muted-foreground leading-relaxed ltr ${
                            expandedHadithId === hadith.id ? "" : "line-clamp-3"
                          }`}
                        >
                          {hadith.hadithEnglish}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-right text-gray-500 font-semibold">
                            📖 {hadith.book.bookName}
                          </div>
                          <Button
                            variant="link"
                            className="text-blue-600 text-xs p-0"
                            onClick={() => toggleExpand(hadith.id)}
                          >
                            {expandedHadithId === hadith.id
                              ? "عرض أقل"
                              : "عرض المزيد"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-4 space-x-2">
                {hadiths.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 md:w-3 h-2 md:h-3 rounded-full ${
                      currentSlide === index ? "bg-blue-600" : "bg-gray-300"
                    }`}
                    onClick={() => api?.scrollTo(index)}
                  />
                ))}
              </div>
            </Carousel>
          ) : (
            <div className="text-right arabic-text text-red-500">
              لا توجد أحاديث متاحة حالياً.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DailyHadithCard;
