"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Chapter } from "@/lib/types";
import { cn, convertToArabicNumber } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";

const ChapterCard = ({
  chapter,
  index,
}: {
  chapter: Chapter;
  index: number;
}) => {
  return (
    <motion.div
      key={chapter.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/quran/${chapter.id}`}
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
              {convertToArabicNumber(chapter.id)}
            </div>
            <div className="text-right space-y-2">
              <div className="arabic-text text-lg font-semibold">
                {chapter.name_arabic}
              </div>
              <div className="text-sm text-muted-foreground arabic-text">
                {convertToArabicNumber(chapter.verses_count)}{" "}
                {chapter.verses_count === 1 ? "آية" : "آيات"}
              </div>
            </div>
          </div>
          <div dir="ltr" className="space-y-2">
            <div className="font-medium">{chapter.name_simple}</div>
            <Badge variant="outline" className="text-xs arabic-text">
              {chapter.revelation_place === "makkah" ? "مكية" : "مدنية"}
            </Badge>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ChapterCard;
