"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Surah } from "@/lib/types";
import { cn, convertToArabicNumber } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

const SurahCard = ({ surah, index }: { surah: Surah; index: number }) => {
  return (
    <motion.div
      key={surah.number}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/quran/${surah.number}`}
        className={cn(
          buttonVariants({
            variant: "outline",
            className: "w-full h-full",
          }),
          "p-4"
        )}
      >
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="arabic-text flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {convertToArabicNumber(surah.number)}
            </div>
            <div className="text-right space-y-2">
              <div className="arabic-text text-lg font-semibold">
                {surah.name}
              </div>
              <div className="text-sm text-muted-foreground arabic-text">
                {convertToArabicNumber(surah.numberOfAyahs)}{" "}
                {surah.numberOfAyahs === 1 ? "آية" : "آيات"}
              </div>
            </div>
          </div>
          <div dir="ltr" className="space-y-2">
            <div className="font-medium">{surah.englishName}</div>
            <Badge variant="outline" className="text-xs arabic-text">
              {surah.revelationType === "Meccan" ? "مكية" : "مدنية"}
            </Badge>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SurahCard;
