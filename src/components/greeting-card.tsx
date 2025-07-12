"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";

const GreetingCard = ({ itemVariants }: { itemVariants: Variants }) => {
  const { user } = useAppStore();
  const [hijriDate, setHijriDate] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");
  const [isHandling, setIsHandling] = useState(true);

  useEffect(() => {
    const now = new Date();

    // Format Gregorian date
    const formattedGregorian = now.toLocaleDateString("ar-EG", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setGregorianDate(formattedGregorian);

    // Fetch Hijri date
    const fetchHijriDate = async () => {
      try {
        const res = await fetch(
          `https://api.aladhan.com/v1/gToH/${now.getDate()}-${
            now.getMonth() + 1
          }-${now.getFullYear()}`
        );
        const data = await res.json();

        if (data?.data?.hijri) {
          const hijri = data.data.hijri;
          setHijriDate(`${hijri.day} ${hijri.month.ar} ${hijri.year}`);
        } else {
          throw new Error("Hijri data not found");
        }
      } catch (error) {
        console.error(error);
        setHijriDate("١ محرم ١٤٤٦");
      } finally {
        setIsHandling(false);
      }
    };

    fetchHijriDate();
  }, []);

  return (
    <motion.div variants={itemVariants}>
      <Card className="sand-gradient" dir="rtl">
        <CardHeader className="text-right">
          <CardTitle className="text-2xl arabic-text">
            السلام عليكم، {user.name}
          </CardTitle>
          <CardDescription className="space-y-1 mt-2">
            {isHandling ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3 rounded-lg" />
                <Skeleton className="h-4 w-1/3 rounded-lg" />
              </div>
            ) : (
              <>
                <div className="arabic-text">{gregorianDate}</div>
                <div className="arabic-text text-emerald-600 dark:text-emerald-400">
                  {hijriDate}
                </div>
              </>
            )}
          </CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default GreetingCard;
