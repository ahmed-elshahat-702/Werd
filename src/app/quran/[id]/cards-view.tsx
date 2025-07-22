"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  PageData,
  // , EnhancedVerse
} from "@/lib/types"; // Make sure EnhancedVerse is imported
import { AnimatePresence, motion } from "framer-motion";
// import { Pause, Play } from "lucide-react"; // Uncomment these if you re-enable audio
import { convertToArabicNumber } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const CardsView = ({
  pages,
  currentPage,
}: // playingVerseId,
// playIndividualVerse,
{
  pages: PageData[];
  currentPage: number;
  // playingVerseId: number | null;
  // playIndividualVerse: (verse: EnhancedVerse) => void;
}) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad && pages.length > 0) {
      setIsInitialLoad(false);
    }
  }, [pages.length, isInitialLoad]);

  // Find the current page's data
  const currentPageData = pages.find((page) => page.number === currentPage);

  if (!currentPageData && !isInitialLoad) {
    // This case can happen if pages is empty or currentPage is out of bounds
    // during a brief transition, or if there's no data for the current page.
    // You might want to display a loading spinner or an empty state here.
    return (
      <div className="text-center text-muted-foreground py-10">
        No verses available for this page.
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {" "}
      {/* Use mode="wait" to ensure exit animation completes before new enters */}
      {currentPageData && ( // Only render if currentPageData is found
        <motion.div
          key={currentPageData.number} // Key on the page number for AnimatePresence
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }} // Add an exit animation
          transition={{ duration: 0.3 }}
        >
          {currentPageData.verses.map((verse, index) => (
            <motion.div
              key={verse.id}
              initial={{ opacity: 0, y: 10 }} // Subtle animation for individual verses
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.3 }} // Delay based on index, plus a small delay after page transition
            >
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between arabic-text">
                    <Badge variant="outline" className="text-xs">
                      آية {convertToArabicNumber(verse.verse_number)}
                    </Badge>
                    {/* Re-enable audio buttons if you plan to integrate audio playback here */}
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playIndividualVerse(verse)}
                      className="h-8 w-8 p-0"
                    >
                      {playingVerseId === verse.id ? ( // Use verse.id for comparison
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button> */}
                  </div>
                  <div className="arabic-text text-xl leading-relaxed">
                    {verse.text_imlaei}
                  </div>
                  {verse.words && (
                    <div className="text-sm border-l-2 border-muted pl-4">
                      <p className="text-sm text-muted-foreground mt-3 italic">
                        {verse.words
                          ?.map((w) => w.transliteration?.text)
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                      {verse.words
                        ?.map((w) => w.translation?.text)
                        .filter(Boolean)
                        .join(" ")}
                    </div>
                  )}
                </div>
              </Card>
              {index < currentPageData.verses.length - 1 && <Separator />}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardsView;
