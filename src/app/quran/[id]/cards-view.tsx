"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EnhancedVerse, PageData } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";

const CardsView = ({
  pages,
  playingVerseId,
  playIndividualVerse,
}: {
  pages: PageData[];
  playingVerseId: number | null;
  playIndividualVerse: (verse: EnhancedVerse) => void;
}) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad && pages.length > 0) {
      setIsInitialLoad(false);
    }
  }, [pages.length, isInitialLoad]);

  return (
    <AnimatePresence>
      {pages.map((page) =>
        page.verses.map((verse, index) => (
          <motion.div
            key={verse.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    Verse {verse.numberInSurah}
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
                <div className="arabic-text text-xl leading-relaxed">
                  {verse.text}
                </div>
                {verse.translation && (
                  <div className="text-sm text-muted-foreground border-l-2 border-muted pl-4">
                    {verse.translation}
                  </div>
                )}
              </div>
            </Card>
            {index < page.verses.length - 1 && <Separator />}
          </motion.div>
        ))
      )}
    </AnimatePresence>
  );
};

export default CardsView;
