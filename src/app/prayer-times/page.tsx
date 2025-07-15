"use client";

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
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";
import { PrayerTimes } from "@/lib/types";
import { formatTo12Hour } from "@/lib/utils";
import { motion } from "framer-motion";
import { MapPin, Moon, Sun } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function PrayerTimesPage() {
  const {
    prayerTimes,
    setPrayerTimes,
    location,
    setLocation,
    isHandling,
    setIsHandling,
    setHeaderArabicTitle,
    setHeaderEnglishTitle,
  } = useAppStore();
  const [currentPrayer, setCurrentPrayer] = useState<string | undefined>("");
  const [nextPrayer, setNextPrayer] = useState<string | undefined>("");
  const [countdown, setCountdown] = useState<string>("");
  const [locationInput, setLocationInput] = useState<{
    city: string;
    country: string;
  }>({
    city: location.split(",")[0]?.trim() || "",
    country: location.split(",")[1]?.trim() || "",
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setHeaderArabicTitle("أوقات الصلاة");
    setHeaderEnglishTitle("Prayer Times");
  }, [setHeaderArabicTitle, setHeaderEnglishTitle]);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setIsHandling(true);
      try {
        const { city, country } = locationInput;
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
            city
          )}&country=${encodeURIComponent(country)}`
        );
        const data = await response.json();
        if (data.data?.timings) {
          setPrayerTimes(data.data.timings);
          setError("");
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        console.error(err);
        const fallbackTimes: PrayerTimes = {
          Fajr: "05:30",
          Sunrise: "06:45",
          Dhuhr: "12:15",
          Asr: "15:45",
          Maghrib: "18:20",
          Isha: "19:45",
        };
        setPrayerTimes(fallbackTimes);
        setError("فشل في جلب أوقات الصلاة. استخدام أوقات افتراضية.");
        toast.error(
          "فشل في جلب أوقات الصلاة. استخدام أوقات افتراضية للقاهرة، مصر."
        );
      } finally {
        setIsHandling(false);
      }
    };
    if (!prayerTimes) {
      fetchPrayerTimes();
    }
  }, [prayerTimes, setPrayerTimes, setIsHandling, locationInput]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (prayerTimes) {
        calculateCurrentAndNextPrayer(prayerTimes);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const calculateCurrentAndNextPrayer = (times: PrayerTimes) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: "Fajr", time: times.Fajr },
      { name: "Sunrise", time: times.Sunrise },
      { HOUSE: "Dhuhr", time: times.Dhuhr },
      { name: "Asr", time: times.Asr },
      { name: "Maghrib", time: times.Maghrib },
      { name: "Isha", time: times.Isha },
    ];

    let current: string | undefined = "";
    let next: string | undefined = "";

    for (let i = 0; i < prayers.length; i++) {
      const [hours, minutes] = prayers[i].time.split(":").map(Number);
      const prayerTime = hours * 60 + minutes;

      if (currentTime >= prayerTime) {
        current = prayers[i].name;
        next = prayers[i + 1]?.name || prayers[0].name;
      } else {
        if (!next) next = prayers[i].name;
        break;
      }
    }

    setCurrentPrayer(current);
    setNextPrayer(next);

    const nextPrayerData = prayers.find((p) => p.name === next);
    if (nextPrayerData) {
      const [hours, minutes] = nextPrayerData.time.split(":").map(Number);
      const nextPrayerTime = new Date();
      nextPrayerTime.setHours(hours, minutes, 0, 0);

      if (nextPrayerTime <= now) {
        nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
      }

      const diff = nextPrayerTime.getTime() - now.getTime();
      const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(
        `${hoursLeft.toString().padStart(2, "0")}:${minutesLeft
          .toString()
          .padStart(2, "0")}:${secondsLeft.toString().padStart(2, "0")}`
      );
    }
  };

  const prayerInfo = useMemo(
    () =>
      prayerTimes
        ? [
            {
              name: "الفجر",
              english: "Fajr",
              time: prayerTimes.Fajr,
              icon: <Moon className="h-5 w-5" />,
              description: "صلاة الفجر",
            },
            {
              name: "الشروق",
              english: "Sunrise",
              time: prayerTimes.Sunrise,
              icon: <Sun className="h-5 w-5" />,
              description: "الشروق (ليس صلاة)",
            },
            {
              name: "الظهر",
              english: "Dhuhr",
              time: prayerTimes.Dhuhr,
              icon: <Sun className="h-5 w-5" />,
              description: "صلاة الظهر",
            },
            {
              name: "العصر",
              english: "Asr",
              time: prayerTimes.Asr,
              icon: <Sun className="h-5 w-5" />,
              description: "صلاة العصر",
            },
            {
              name: "المغرب",
              english: "Maghrib",
              time: prayerTimes.Maghrib,
              icon: <Sun className="h-5 w-5" />,
              description: "صلاة المغرب",
            },
            {
              name: "العشاء",
              english: "Isha",
              time: prayerTimes.Isha,
              icon: <Moon className="h-5 w-5" />,
              description: "صلاة العشاء",
            },
          ]
        : [],
    [prayerTimes]
  );

  const handleLocationChange = async () => {
    const { city, country } = locationInput;
    if (city.trim() && country.trim()) {
      setIsHandling(true);
      setError("");
      setLocation(`${city.trim()}, ${country.trim()}`);
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
            city
          )}&country=${encodeURIComponent(country)}`
        );
        const data = await response.json();
        if (data.data?.timings) {
          setPrayerTimes(data.data.timings);
        } else {
          throw new Error("Invalid API response");
        }
      } catch (err) {
        console.error(err);
        const fallbackTimes: PrayerTimes = {
          Fajr: "05:30",
          Sunrise: "06:45",
          Dhuhr: "12:15",
          Asr: "15:45",
          Maghrib: "18:20",
          Isha: "19:45",
        };
        setPrayerTimes(fallbackTimes);
        setError("فشل في جلب أوقات الصلاة. استخدام أوقات افتراضية.");
        toast.error(
          "فشل في جلب أوقات الصلاة. استخدام أوقات افتراضية للقاهرة، مصر."
        );
      } finally {
        setIsHandling(false);
      }
    } else {
      setError("يرجى إدخال اسم مدينة ودولة صحيحين.");
      toast.error("يرجى إدخال اسم مدينة ودولة صحيحين.");
    }
  };

  if (isHandling || !prayerTimes) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Prayer Times</h1>
        </header>
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton
                className="h-[140px] w-full"
                aria-label="جارٍ تحميل بطاقة الموقع"
              />
              <Skeleton
                className="h-[140px] w-full"
                aria-label="جارٍ تحميل بطاقة الصلاة التالية"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[140px] w-full"
                  aria-label={`جارٍ تحميل بطاقة وقت الصلاة ${index + 1}`}
                />
              ))}
            </div>
            <Skeleton
              className="h-[160px] w-full"
              aria-label="جارٍ تحميل بطاقة تذكيرات الصلاة"
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 arabic-text">
                  <MapPin className="h-5 w-5" />
                  الموقع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div dir="rtl" className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={locationInput.city}
                      onChange={(e) =>
                        setLocationInput({
                          ...locationInput,
                          city: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                        })
                      }
                      placeholder="Enter city name"
                      aria-label="City name for prayer times"
                    />
                    <Input
                      value={locationInput.country}
                      onChange={(e) =>
                        setLocationInput({
                          ...locationInput,
                          country: e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                        })
                      }
                      placeholder="Enter country name"
                      aria-label="Country name for prayer times"
                    />
                    <Button onClick={handleLocationChange}>تحديث</Button>
                  </div>
                  {error && (
                    <p className="text-sm text-red-500 arabic-text">{error}</p>
                  )}
                  <p className="text-lg arabic-text">{location}</p>
                  <p className="text-sm text-muted-foreground arabic-text">
                    {new Date().toLocaleDateString("ar-EG", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="prayer-card">
              <CardHeader>
                <CardTitle className="arabic-text">الصلاة التالية</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold arabic-text">
                      {nextPrayer}
                    </div>
                    <div className="text-lg text-muted-foreground arabic-text">
                      {prayerInfo.find((p) => p.english === nextPrayer)?.name}
                    </div>
                  </div>
                  <motion.div className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {countdown}
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prayerInfo.map((prayer, index) => (
            <motion.div
              key={prayer.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                dir="rtl"
                className={`${
                  currentPrayer === prayer.english
                    ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950"
                    : ""
                } ${prayer.english === "Sunrise" ? "opacity-60" : ""}`}
                role="region"
                aria-label={`بطاقة وقت صلاة ${prayer.name}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {prayer.icon}
                      <span className="arabic-text">{prayer.name}</span>
                    </div>
                    {currentPrayer === prayer.english && (
                      <Badge className="bg-emerald-500 arabic-text">
                        الحالية
                      </Badge>
                    )}
                    {nextPrayer === prayer.english && (
                      <Badge
                        variant="outline"
                        className="border-emerald-500 text-emerald-600 arabic-text"
                      >
                        التالية
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold font-mono">
                      {formatTo12Hour(prayer.time)}
                    </div>
                    <div className="text-lg text-muted-foreground">
                      {prayer.english}
                    </div>
                    <div className="text-xs text-muted-foreground arabic-text">
                      {prayer.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="arabic-text">
            <CardHeader>
              <CardTitle className="arabic-text">تذكيرات الصلاة</CardTitle>
              <CardDescription className="arabic-text">
                كن على صلة بصلواتك اليومية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium arabic-text">قبل الصلاة</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 arabic-text">
                    <li>• الوضوء</li>
                    <li>• التوجه للقبلة</li>
                    <li>• اختيار مكان طاهر</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium arabic-text">بعد الصلاة</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 arabic-text">
                    <li>• التسبيح (٣٣ مرة لكل نوع)</li>
                    <li>• الدعاء</li>
                    <li>• قراءة القرآن</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
