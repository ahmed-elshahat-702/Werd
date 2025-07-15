"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EnhancedVerse, PageData } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const MushafView = ({
  pages,
  currentPage,
  totalPages,
  goToPage,
  playingVerseId,
  playIndividualVerse,
}: {
  pages: PageData[];
  currentPage: number;
  totalPages: number;
  goToPage: (pageNumber: number) => void;
  playingVerseId: number | null;
  playIndividualVerse: (verse: EnhancedVerse) => void;
}) => (
  <AnimatePresence>
    <motion.div
      key={currentPage}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-row items-center justify-between mb-4">
        <CardTitle>{`Page ${currentPage} of ${totalPages}`}</CardTitle>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {pages[currentPage - 1]?.verses.map((verse, index) => (
        <motion.div
          key={verse.number}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="arabic-text text-xl leading-relaxed flex-1">
              {verse.text}
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Badge variant="outline" className="text-xs">
                {verse.numberInSurah}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => playIndividualVerse(verse)}
                className="h-8 w-8 p-0"
              >
                {playingVerseId === verse.number ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {index < pages[currentPage - 1]?.verses.length - 1 && <Separator />}
        </motion.div>
      ))}
    </motion.div>
  </AnimatePresence>
);
export default MushafView;
