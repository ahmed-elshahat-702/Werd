"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Star, Moon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { useAppStore } from "@/lib/store";

interface HijriDate {
  day: string;
  month: {
    number: number;
    en: string;
    ar: string;
  };
  year: string;
  weekday: {
    en: string;
    ar: string;
  };
}

interface Event {
  id: string;
  name: string;
  nameAr: string;
  date: string;
  description: string;
  type: "major" | "minor";
  gregorianDate?: Date;
}

interface AladhanDay {
  hijri: {
    date: string;
    day: string;
    month: {
      number: number;
      en: string;
      ar: string;
    };
    holidays: string[];
  };
  gregorian: {
    date: string;
  };
}

export default function CalendarPage() {
  const { isHandling, setIsHandling } = useAppStore();
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [gregorianDate, setGregorianDate] = useState("");
  const [showHijri, setShowHijri] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [islamicEvents, setIslamicEvents] = useState<Event[]>([]);
  const [gregorianEvents] = useState<Event[]>([
    {
      id: "jan-1",
      name: "New Year's Day",
      nameAr: "رأس السنة الميلادية",
      date: "1 January",
      description: "Celebration of the new Gregorian year",
      type: "major",
      gregorianDate: new Date(2025, 0, 1),
    },
    {
      id: "apr-20",
      name: "Easter Sunday",
      nameAr: "عيد الفصح",
      date: "20 April",
      description: "Christian celebration of Jesus' resurrection",
      type: "major",
      gregorianDate: new Date(2025, 3, 20),
    },
    {
      id: "jul-4",
      name: "Independence Day",
      nameAr: "عيد الاستقلال",
      date: "4 July",
      description: "Commemoration of U.S. independence",
      type: "major",
      gregorianDate: new Date(2025, 6, 4),
    },
    {
      id: "oct-31",
      name: "Halloween",
      nameAr: "الهالوين",
      date: "31 October",
      description: "Evening of costumes and festivities",
      type: "minor",
      gregorianDate: new Date(2025, 9, 31),
    },
    {
      id: "nov-27",
      name: "Thanksgiving",
      nameAr: "عيد الشكر",
      date: "27 November",
      description: "Day of gratitude and feasting",
      type: "major",
      gregorianDate: new Date(2025, 10, 27),
    },
    {
      id: "dec-25",
      name: "Christmas",
      nameAr: "عيد الميلاد",
      date: "25 December",
      description: "Christian celebration of Jesus' birth",
      type: "major",
      gregorianDate: new Date(2025, 11, 25),
    },
  ]);

  useEffect(() => {
    const fetchDatesAndEvents = async () => {
      setIsHandling(true);
      const now = new Date();
      const year = now.getFullYear();
      const latitude = 21.4225; // Mecca coordinates
      const longitude = 39.8262;

      try {
        // Set Gregorian date
        setGregorianDate(
          now.toLocaleDateString("ar-SA", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        );

        // Fetch Hijri date
        const dateResponse = await fetch(
          `https://api.aladhan.com/v1/gToH/${now.getDate()}-${
            now.getMonth() + 1
          }-${year}?latitude=${latitude}&longitude=${longitude}`
        );
        const dateData = await dateResponse.json();

        if (dateData.data?.hijri) {
          const hijri = dateData.data.hijri;
          setHijriDate({
            day: hijri.day,
            month: {
              number: hijri.month.number,
              en: hijri.month.en,
              ar: hijri.month.ar,
            },
            year: hijri.year,
            weekday: {
              en: hijri.weekday.en,
              ar: hijri.weekday.ar,
            },
          });

          // Fetch Islamic events for the current Hijri year
          const eventResponse = await fetch(
            `https://api.aladhan.com/v1/hijriCalendar/1/${hijri.year}?latitude=${latitude}&longitude=${longitude}`
          );
          const eventData = await eventResponse.json();
          const events: Event[] = eventData.data
            .filter((day: AladhanDay) => day.hijri.holidays.length > 0)
            .map((day: AladhanDay, index: number) => ({
              id: `hijri-${day.hijri.date}-${index}`,
              name: day.hijri.holidays[0],
              nameAr: day.hijri.holidays[0],
              date: `${day.hijri.day} ${day.hijri.month.en}`,
              description: day.hijri.holidays[0],
              type: [
                "Islamic New Year",
                "Day of Ashura",
                "Mawlid an-Nabi",
                "Eid al-Fitr",
                "Eid al-Adha",
              ].includes(day.hijri.holidays[0])
                ? "major"
                : "minor",
              gregorianDate: new Date(day.gregorian.date),
            }));
          setIslamicEvents(events);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback Hijri date
        setHijriDate({
          day: "15",
          month: {
            number: 5,
            en: "Jumada al-awwal",
            ar: "جمادى الأولى",
          },
          year: "1446",
          weekday: {
            en: "Monday",
            ar: "الاثنين",
          },
        });
      } finally {
        setIsHandling(false);
      }
    };

    fetchDatesAndEvents();
  }, [setIsHandling]);

  if (isHandling) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Islamic Calendar</h1>
        </header>
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-40 mx-auto" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </SidebarInset>
    );
  }

  const eventDates = (showHijri ? islamicEvents : gregorianEvents)
    .filter((event) => event.gregorianDate)
    .map((event) => event.gregorianDate!);

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          <h1 className="text-lg font-semibold">Islamic Calendar</h1>
          <span className="text-sm arabic-text text-muted-foreground">
            التقويم الإسلامي
          </span>
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Date Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card
              className={
                showHijri ? "ring-2 ring-emerald-500" : "ring-2 ring-blue-500"
              }
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {showHijri ? (
                    <>
                      <Moon className="h-5 w-5" />
                      Hijri Date
                    </>
                  ) : (
                    <>
                      <CalendarIcon className="h-5 w-5" />
                      Gregorian Date
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showHijri && hijriDate ? (
                  <div className="space-y-2">
                    <div className="text-2xl font-bold arabic-text">
                      {`${hijriDate.weekday.ar}، ${hijriDate.day} ${hijriDate.month.ar} ${hijriDate.year}`}
                    </div>
                    <Badge variant="outline" className="text-emerald-600">
                      {hijriDate.year} AH
                    </Badge>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">{gregorianDate}</div>
                    <Badge variant="outline" className="text-blue-600">
                      {new Date().getFullYear()} CE
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Calendar Toggle */}
          <div className="flex justify-center">
            <div className="flex rounded-lg border p-1">
              <Button
                variant={showHijri ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowHijri(true)}
              >
                هجري
              </Button>
              <Button
                variant={!showHijri ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowHijri(false)}
              >
                ميلادي
              </Button>
            </div>
          </div>

          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Events Calendar</CardTitle>
                <CardDescription>
                  {showHijri
                    ? "Islamic Events Calendar"
                    : "Gregorian Events Calendar"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    events: eventDates,
                  }}
                  modifiersStyles={{
                    events: {
                      backgroundColor: showHijri
                        ? "rgba(16, 185, 129, 0.2)"
                        : "rgba(59, 130, 246, 0.2)",
                      fontWeight: "bold",
                    },
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  {showHijri ? "Islamic Events" : "Gregorian Events"}
                </CardTitle>
                <CardDescription>
                  {showHijri
                    ? "المناسبات والأحداث الإسلامية المهمة"
                    : "المناسبات والأحداث الميلادية المهمة"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {(showHijri ? islamicEvents : gregorianEvents).map(
                    (event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="h-full">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-base">
                                  {event.nameAr}
                                </CardTitle>
                                <Badge
                                  variant={
                                    event.type === "major"
                                      ? "default"
                                      : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {event.date}
                                </Badge>
                              </div>
                              {event.type === "major" && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              {event.description}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Islamic Months */}
          {showHijri && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>الأشهر الهجرية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      { en: "Muharram", ar: "محرم" },
                      { en: "Safar", ar: "صفر" },
                      { en: "Rabi' al-Awwal", ar: "ربيع الأول" },
                      { en: "Rabi' al-Thani", ar: "ربيع الثاني" },
                      { en: "Jumada al-Awwal", ar: "جمادى الأولى" },
                      { en: "Jumada al-Thani", ar: "جمادى الثانية" },
                      { en: "Rajab", ar: "رجب" },
                      { en: "Sha'ban", ar: "شعبان" },
                      { en: "Ramadan", ar: "رمضان" },
                      { en: "Shawwal", ar: "شوال" },
                      { en: "Dhul Qi'dah", ar: "ذو القعدة" },
                      { en: "Dhul Hijjah", ar: "ذو الحجة" },
                    ].map((month, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border text-center ${
                          hijriDate?.month.number === index + 1
                            ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800"
                            : "bg-muted/50"
                        }`}
                      >
                        <div className="font-medium">{month.ar}</div>
                        <div className="text-xs text-muted-foreground">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </SidebarInset>
  );
}
