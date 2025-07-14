"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { Surah } from "@/lib/types";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

const SurahsSidebar = ({
  selectedSurah,
  handleSurahClick,
}: {
  selectedSurah: Surah | null;
  handleSurahClick: (surah: Surah) => void;
}) => {
  const { setIsHandling } = useAppStore();
  const [surahs, setSurahs] = useState<Surah[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/surah")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.data) {
          setSurahs(data.data);
        }
        setIsHandling(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setSurahs([]);
        setIsHandling(false);
      });
  }, [setIsHandling]);

  // Function to remove Arabic diacritics
  function removeArabicDiacritics(text: string) {
    const arabicDiacritics =
      /[\u0610-\u061A\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g;
    return text.replace(arabicDiacritics, "");
  }

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      removeArabicDiacritics(surah.name).includes(
        removeArabicDiacritics(searchTerm)
      )
  );

  return (
    <div className="w-80 ml-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Surahs</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search surahs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {filteredSurahs.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No surahs found
          </div>
        ) : (
          filteredSurahs.map((surah, index) => (
            <motion.div
              key={surah.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedSurah?.number === surah.number ? "bg-accent" : ""
                }`}
                onClick={() => handleSurahClick(surah)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {surah.number}
                      </div>
                      <div>
                        <div className="font-medium">{surah.englishName}</div>
                        <div className="text-sm text-muted-foreground">
                          {surah.numberOfAyahs} verses
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="arabic-text text-lg font-semibold">
                        {surah.name}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {surah.revelationType}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default SurahsSidebar;
