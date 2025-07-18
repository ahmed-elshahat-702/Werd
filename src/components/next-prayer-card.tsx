"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";
import { formatTo12Hour } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { Clock } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const PRAYER_TRANSLATIONS: Record<string, string> = {
  Fajr: "الفجر",
  Dhuhr: "الظهر",
  Asr: "العصر",
  Maghrib: "المغرب",
  Isha: "العشاء",
};

const NextPrayerCard = ({ itemVariants }: { itemVariants: Variants }) => {
  const { location } = useAppStore();

  const [prayerName, setPrayerName] = useState<string | null>(null);
  const [prayerTime, setPrayerTime] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string | null>(null);
  const [isHandling, setIsHandling] = useState(true);

  const date = new Date();
  const formattedDate = formatDate(date);

  const calculateCountdown = useCallback((prayerTime: string) => {
    const now = new Date();
    const [hours, minutes] = prayerTime.split(":").map(Number);
    const prayer = new Date();
    prayer.setHours(hours, minutes, 0, 0);

    if (prayer < now) {
      prayer.setDate(prayer.getDate() + 1);
    }

    const diff = prayer.getTime() - now.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hoursLeft} س ${minutesLeft} د`;
  }, []);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      const city = location.split(",")[0]?.trim() || "";
      const country = location.split(",")[1]?.trim() || "";
      try {
        const res = await fetch(
          `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=${city}&country=${country}`
        );
        const data = await res.json();

        if (data.data?.timings) {
          const timings = data.data.timings;

          const prayers = [
            { name: "Fajr", time: timings.Fajr },
            { name: "Dhuhr", time: timings.Dhuhr },
            { name: "Asr", time: timings.Asr },
            { name: "Maghrib", time: timings.Maghrib },
            { name: "Isha", time: timings.Isha },
          ];

          const now = new Date();
          const currentTime = now.getHours() * 60 + now.getMinutes();

          const nextPrayer =
            prayers.find((prayer) => {
              const [hours, minutes] = prayer.time.split(":").map(Number);
              const time = hours * 60 + minutes;
              return time > currentTime;
            }) || prayers[0];

          setPrayerName(PRAYER_TRANSLATIONS[nextPrayer.name]);
          setPrayerTime(nextPrayer.time);
          setCountdown(calculateCountdown(nextPrayer.time));
        }
      } catch (error) {
        console.error("خطأ أثناء تحميل أوقات الصلاة:", error);
      } finally {
        setIsHandling(false);
      }
    };

    fetchPrayerTimes();
  }, [calculateCountdown, formattedDate, location]);

  useEffect(() => {
    if (!prayerTime) return;

    const interval = setInterval(() => {
      setCountdown(calculateCountdown(prayerTime));
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [prayerTime, calculateCountdown]);

  return (
    <motion.div variants={itemVariants}>
      <Card className="emerald-gradient text-emerald-foreground arabic-text">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-5 w-5" />
            الصلاة القادمة
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isHandling ? (
            <div className="space-y-3 text-right">
              <Skeleton className="h-6 w-1/3 rounded-lg" />
              <Skeleton className="h-5 w-1/4 rounded-lg" />
              <Skeleton className="h-6 w-1/2 rounded-lg" />
            </div>
          ) : prayerName && prayerTime && countdown ? (
            <div className="space-y-2 text-right">
              <div className="text-2xl font-bold">{prayerName}</div>
              <div className="text-lg text-emerald-foreground/80">
                {formatTo12Hour(prayerTime)}
              </div>
              <Badge variant="secondary" className="text-base font-semibold">
                بعد {countdown}
              </Badge>
            </div>
          ) : (
            <div className="text-right text-sm">
              لم يتم العثور على وقت الصلاة.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NextPrayerCard;
