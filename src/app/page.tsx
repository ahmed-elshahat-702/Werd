"use client";

import DailyHadithCard from "@/components/daily-hadith-card";
import DailyVerseCard from "@/components/daily-verse-card";
import GreetingCard from "@/components/greeting-card";
import NextPrayerCard from "@/components/next-prayer-card";
import QuickActionsCard from "@/components/quick-actions-card";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { motion } from "framer-motion";

export default function Dashboard() {
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

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-baseline gap-2">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <span className="text-sm arabic-text text-muted-foreground">
            الرئيسية
          </span>
        </div>
      </header>

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
    </SidebarInset>
  );
}
