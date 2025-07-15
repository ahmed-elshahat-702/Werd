"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { azkarTabsData, initialAzkarData } from "@/lib/consts";
import { useAppStore } from "@/lib/store";
import { AzkarCategory } from "@/lib/types";
import { motion } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function AzkarPage() {
  const { setHeaderArabicTitle, setHeaderEnglishTitle } = useAppStore();
  const {
    azkar,
    setAzkar,
    lastResetDate,
    setLastResetDate,
    incrementZikr,
    resetZikr,
    resetCategory,
    resetAllAzkar,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<AzkarCategory>("morning");

  useEffect(() => {
    setHeaderArabicTitle("الأذكار");
    setHeaderEnglishTitle("Azkar");
  }, [setHeaderArabicTitle, setHeaderEnglishTitle]);

  useEffect(() => {
    setAzkar(initialAzkarData);
  }, [setAzkar]);

  // Reset all azkar daily
  useEffect(() => {
    const today = new Date().toDateString();
    if (lastResetDate !== today) {
      resetAllAzkar();
      setLastResetDate(today);
    }
  }, [lastResetDate, resetAllAzkar, setLastResetDate]);

  const isCategoryComplete = (category: AzkarCategory) =>
    azkar[category].every((zikr) => zikr.currentCount >= zikr.count);

  const getCategoryProgress = (category: AzkarCategory) => {
    const total = azkar[category].reduce((sum, zikr) => sum + zikr.count, 0);
    const completed = azkar[category].reduce(
      (sum, zikr) => sum + zikr.currentCount,
      0
    );
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as AzkarCategory)}
          className="space-y-6"
        >
          <TabsList className="grid w-full h-fit grid-cols-2 lg:grid-cols-4">
            {azkarTabsData.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2"
              >
                <tab.icon className="w-4 h-4" />
                <div>
                  <div>{tab.label}</div>
                  <div className="text-xs arabic-text">{tab.arabic}</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {azkarTabsData.map((tab) => {
            const category = tab.value;

            return (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {tab.label} Azkar
                    </h2>
                    <p className="text-muted-foreground arabic-text">
                      {tab.arabic}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      {getCategoryProgress(category)}% Complete
                    </Badge>
                    <Button
                      onClick={() => resetCategory(category)}
                      variant="outline"
                      size="sm"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>

                <div className="space-y-4">
                  {azkar[category].map((zikr, index) => (
                    <motion.div
                      key={zikr.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        className={
                          zikr.currentCount >= zikr.count
                            ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800"
                            : ""
                        }
                      >
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div className="space-y-2 flex-1">
                              <CardTitle className="arabic-text text-xl leading-relaxed">
                                {zikr.arabic}
                              </CardTitle>
                              <CardDescription className="space-y-1">
                                <div className="text-base">
                                  {zikr.transliteration}
                                </div>
                                <div className="text-sm">
                                  {zikr.translation}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  - {zikr.reference}
                                </div>
                              </CardDescription>
                            </div>
                            {zikr.currentCount >= zikr.count && (
                              <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <Button
                                onClick={() => incrementZikr(category, zikr.id)}
                                disabled={zikr.currentCount >= zikr.count}
                                className="misbaha-button"
                              >
                                Count
                              </Button>
                              <div className="text-lg font-semibold">
                                {zikr.currentCount} / {zikr.count}
                              </div>
                            </div>
                            <Button
                              onClick={() => resetZikr(category, zikr.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="mt-3">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${
                                    (zikr.currentCount / zikr.count) * 100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {isCategoryComplete(category) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800">
                      <CardContent className="p-6 text-center space-y-2">
                        <Check className="h-12 w-12 mx-auto text-emerald-600 dark:text-emerald-400" />
                        <h3 className="text-lg font-semibold">
                          Congratulations!
                        </h3>
                        <p className="text-muted-foreground">
                          You have completed all {tab.label} Azkar. May Allah
                          accept your remembrance.
                        </p>
                        <p className="arabic-text text-emerald-600 dark:text-emerald-400">
                          بارك الله فيك
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
