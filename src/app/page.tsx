"use client";

import DailyHadithCard from "@/components/daily-hadith-card";
import DailyVerseCard from "@/components/daily-verse-card";
import GreetingCard from "@/components/greeting-card";
import NextPrayerCard from "@/components/next-prayer-card";
import QuickActionsCard from "@/components/quick-actions-card";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Dashboard() {
  const { setHeaderArabicTitle, setHeaderEnglishTitle } = useAppStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  useEffect(() => {
    setHeaderArabicTitle("الرئيسية");
    setHeaderEnglishTitle("Dashboard");
  }, [setHeaderArabicTitle, setHeaderEnglishTitle]);

  return (
    <div className="flex-1 space-y-6 p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Greeting Section */}
        <GreetingCard itemVariants={itemVariants} />

        {/* Next Prayer & Daily Verse */}
        <div className="grid gap-6 md:grid-cols-2">
          <NextPrayerCard itemVariants={itemVariants} />
          <DailyVerseCard itemVariants={itemVariants} />
        </div>

        {/* Daily Hadith */}
        <DailyHadithCard itemVariants={itemVariants} />

        {/* Quick Actions */}
        <QuickActionsCard itemVariants={itemVariants} />
      </motion.div>
    </div>
  );
}
