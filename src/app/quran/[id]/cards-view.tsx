"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { convertToArabicNumber } from "@/lib/utils";
import { Verse } from "@/lib/types";

const CardsView = ({ verses }: { verses: Verse[] }) => {
  return (
    <AnimatePresence mode="wait">
      <div className="space-y-4">
        {verses.map((verse, index) => (
          <motion.div
            key={verse.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.3 }}
          >
            <Card className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between arabic-text">
                  <Badge variant="outline" className="text-xs">
                    آية {convertToArabicNumber(verse.verse_number)}
                  </Badge>
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
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default CardsView;
